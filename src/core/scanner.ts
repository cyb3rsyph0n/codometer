import { promises as fs } from 'fs';
import { join } from 'path';
import { ScanOptions } from './types';
import { GitignoreParser } from '../filters/gitignore-parser';
import { TestFilter } from '../filters/test-filter';
import { isHiddenPath, normalizePath } from '../utils/path-utils';
import { isBinaryFile, getFileSize } from '../utils/file-reader';

export class Scanner {
  private gitignoreParser: GitignoreParser;
  private testFilter: TestFilter;
  private options: ScanOptions;

  constructor(options: ScanOptions) {
    this.options = options;
    this.gitignoreParser = new GitignoreParser();
    this.testFilter = new TestFilter(options.excludeTests);
  }

  async scan(): Promise<string[]> {
    if (this.options.respectGitignore) {
      await this.gitignoreParser.loadGitignore(this.options.rootPath);
    }

    const files: string[] = [];
    await this.scanDirectory(this.options.rootPath, files);
    return files;
  }

  private async scanDirectory(dirPath: string, files: string[]): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);
        const relativePath = normalizePath(fullPath.substring(this.options.rootPath.length + 1));

        if (!this.options.includeHidden && isHiddenPath(entry.name)) {
          continue;
        }

        if (entry.isSymbolicLink() && !this.options.followSymlinks) {
          continue;
        }

        if (entry.isDirectory()) {
          if (
            this.options.respectGitignore &&
            this.gitignoreParser.shouldIgnore(fullPath, this.options.rootPath, true)
          ) {
            continue;
          }

          await this.scanDirectory(fullPath, files);
        } else if (entry.isFile()) {
          if (
            this.options.respectGitignore &&
            this.gitignoreParser.shouldIgnore(fullPath, this.options.rootPath, false)
          ) {
            continue;
          }

          if (this.testFilter.shouldExclude(relativePath)) {
            continue;
          }

          const fileSize = await getFileSize(fullPath);
          if (fileSize > this.options.maxFileSize) {
            continue;
          }

          const isBinary = await isBinaryFile(fullPath);
          if (isBinary) {
            continue;
          }

          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
}
