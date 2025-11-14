import { FileMetrics } from './types';
import { ParserRegistry } from '../parsers/parser-registry';
import { readFileContent } from '../utils/file-reader';
import { getFileExtension } from '../utils/path-utils';

export class Counter {
  private parserRegistry: ParserRegistry;

  constructor() {
    this.parserRegistry = new ParserRegistry();
  }

  async countFile(filePath: string): Promise<FileMetrics> {
    const extension = getFileExtension(filePath);
    const parser = this.parserRegistry.getParser(extension);

    if (!parser) {
      return {
        filePath,
        totalLines: 0,
        codeLines: 0,
        commentLines: 0,
        blankLines: 0,
        isDocumentation: false,
        language: 'Unknown',
      };
    }

    const content = await readFileContent(filePath);
    const result = parser.parse(content);
    const totalLines = result.codeLines + result.commentLines + result.blankLines;
    const isDocumentation = this.parserRegistry.isMarkdownExtension(extension);
    const language = this.parserRegistry.getLanguageName(extension);

    return {
      filePath,
      totalLines,
      codeLines: result.codeLines,
      commentLines: result.commentLines,
      blankLines: result.blankLines,
      isDocumentation,
      language,
    };
  }
}
