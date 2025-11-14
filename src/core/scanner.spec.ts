import { Scanner } from './scanner';
import { ScanOptions } from './types';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('Scanner', () => {
  const testDir = join(__dirname, '../../tests/fixtures/scanner-test');

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
    await fs.mkdir(join(testDir, 'src'), { recursive: true });
    await fs.mkdir(join(testDir, '.hidden'), { recursive: true });
    
    await fs.writeFile(join(testDir, 'file1.txt'), 'content', 'utf-8');
    await fs.writeFile(join(testDir, 'src', 'file2.txt'), 'content', 'utf-8');
    await fs.writeFile(join(testDir, '.hidden', 'file3.txt'), 'content', 'utf-8');
    await fs.writeFile(
      join(testDir, '.gitignore'),
      'ignored.txt\n*.log',
      'utf-8'
    );
    await fs.writeFile(join(testDir, 'ignored.txt'), 'ignored', 'utf-8');
    await fs.writeFile(join(testDir, 'test.log'), 'log', 'utf-8');
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test('should scan directory and find files', async () => {
    const options: ScanOptions = {
      rootPath: testDir,
      respectGitignore: false,
      followSymlinks: false,
      includeHidden: true,
      verbose: false,
      maxFileSize: 10 * 1024 * 1024,
    };

    const scanner = new Scanner(options);
    const files = await scanner.scan();

    expect(files.length).toBeGreaterThan(0);
    expect(files.some((f) => f.includes('file1.txt'))).toBe(true);
  });

  test('should respect .gitignore when enabled', async () => {
    const options: ScanOptions = {
      rootPath: testDir,
      respectGitignore: true,
      followSymlinks: false,
      includeHidden: false,
      verbose: false,
      maxFileSize: 10 * 1024 * 1024,
    };

    const scanner = new Scanner(options);
    const files = await scanner.scan();

    expect(files.some((f) => f.includes('ignored.txt'))).toBe(false);
    expect(files.some((f) => f.includes('test.log'))).toBe(false);
  });

  test('should exclude hidden files by default', async () => {
    const options: ScanOptions = {
      rootPath: testDir,
      respectGitignore: false,
      followSymlinks: false,
      includeHidden: false,
      verbose: false,
      maxFileSize: 10 * 1024 * 1024,
    };

    const scanner = new Scanner(options);
    const files = await scanner.scan();

    expect(files.some((f) => f.includes('.hidden'))).toBe(false);
  });

  test('should exclude test files when pattern provided', async () => {
    await fs.writeFile(join(testDir, 'test.spec.ts'), 'test', 'utf-8');

    const options: ScanOptions = {
      rootPath: testDir,
      respectGitignore: false,
      excludeTests: '*.spec.ts',
      followSymlinks: false,
      includeHidden: false,
      verbose: false,
      maxFileSize: 10 * 1024 * 1024,
    };

    const scanner = new Scanner(options);
    const files = await scanner.scan();

    expect(files.some((f) => f.includes('test.spec.ts'))).toBe(false);
  });
});
