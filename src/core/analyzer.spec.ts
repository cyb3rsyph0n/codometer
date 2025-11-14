import { Analyzer } from './analyzer';
import { ScanOptions } from './types';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('Analyzer', () => {
  const testDir = join(__dirname, '../../tests/fixtures/analyzer-test');

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
    
    // Create test files
    await fs.writeFile(join(testDir, 'code.js'), 'const x = 1;\nconst y = 2;', 'utf-8');
    await fs.writeFile(join(testDir, 'README.md'), '# Title\n\nContent', 'utf-8');
    await fs.writeFile(
      join(testDir, '.gitignore'),
      'node_modules/\n*.log',
      'utf-8'
    );
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test('should analyze directory and return metrics', async () => {
    const options: ScanOptions = {
      rootPath: testDir,
      respectGitignore: true,
      followSymlinks: false,
      includeHidden: false,
      verbose: false,
      maxFileSize: 10 * 1024 * 1024,
    };

    const analyzer = new Analyzer(options);
    const result = await analyzer.analyze();

    expect(result.totalFiles).toBeGreaterThan(0);
    expect(result.linesOfCode).toBeGreaterThan(0);
    expect(result.fileMetrics).toBeInstanceOf(Array);
    expect(result.languageBreakdown).toBeInstanceOf(Map);
  });

  test('should separate code from documentation', async () => {
    const options: ScanOptions = {
      rootPath: testDir,
      respectGitignore: true,
      followSymlinks: false,
      includeHidden: false,
      verbose: false,
      maxFileSize: 10 * 1024 * 1024,
    };

    const analyzer = new Analyzer(options);
    const result = await analyzer.analyze();

    expect(result.linesOfCode).toBeGreaterThan(0);
    expect(result.markdownLines).toBeGreaterThan(0);
    expect(result.languageBreakdown.size).toBeGreaterThan(0);
  });
});
