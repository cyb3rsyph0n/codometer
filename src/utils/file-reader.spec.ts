import { readFileContent, isBinaryFile, getFileSize } from './file-reader';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('file-reader', () => {
  const testDir = join(__dirname, '../../tests/fixtures');

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('readFileContent', () => {
    test('should read file content', async () => {
      const testFile = join(testDir, 'test.txt');
      await fs.writeFile(testFile, 'Hello, World!', 'utf-8');

      const content = await readFileContent(testFile);
      expect(content).toBe('Hello, World!');
    });
  });

  describe('isBinaryFile', () => {
    test('should detect text files as non-binary', async () => {
      const testFile = join(testDir, 'text.txt');
      await fs.writeFile(testFile, 'Plain text content', 'utf-8');

      const isBinary = await isBinaryFile(testFile);
      expect(isBinary).toBe(false);
    });

    test('should detect binary files', async () => {
      const testFile = join(testDir, 'binary.bin');
      const binaryData = Buffer.from([0x00, 0x01, 0x02, 0xFF, 0xFE]);
      await fs.writeFile(testFile, binaryData);

      const isBinary = await isBinaryFile(testFile);
      expect(isBinary).toBe(true);
    });

    test('should handle empty files', async () => {
      const testFile = join(testDir, 'empty.txt');
      await fs.writeFile(testFile, '', 'utf-8');

      const isBinary = await isBinaryFile(testFile);
      expect(isBinary).toBe(false);
    });

    test('should return true for non-existent files', async () => {
      const isBinary = await isBinaryFile('/non/existent/file.txt');
      expect(isBinary).toBe(true);
    });
  });

  describe('getFileSize', () => {
    test('should return file size', async () => {
      const testFile = join(testDir, 'size-test.txt');
      await fs.writeFile(testFile, 'Test content');

      const size = await getFileSize(testFile);
      expect(size).toBeGreaterThan(0);
    });

    test('should return 0 for non-existent files', async () => {
      const size = await getFileSize('/non/existent/file.txt');
      expect(size).toBe(0);
    });
  });
});
