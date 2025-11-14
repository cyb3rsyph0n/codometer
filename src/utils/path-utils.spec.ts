import { getFileExtension, isHiddenPath, normalizePath } from './path-utils';

describe('path-utils', () => {
  describe('getFileExtension', () => {
    test('should extract file extension', () => {
      expect(getFileExtension('file.ts')).toBe('ts');
      expect(getFileExtension('path/to/file.js')).toBe('js');
      expect(getFileExtension('file.spec.ts')).toBe('ts');
    });

    test('should return empty string for no extension', () => {
      expect(getFileExtension('file')).toBe('');
      expect(getFileExtension('path/to/file')).toBe('');
    });

    test('should handle uppercase extensions', () => {
      expect(getFileExtension('FILE.JS')).toBe('js');
    });
  });

  describe('isHiddenPath', () => {
    test('should detect hidden files', () => {
      expect(isHiddenPath('.hidden')).toBe(true);
      expect(isHiddenPath('path/to/.hidden')).toBe(true);
    });

    test('should not flag regular files as hidden', () => {
      expect(isHiddenPath('file.ts')).toBe(false);
      expect(isHiddenPath('path/to/file.ts')).toBe(false);
    });

    test('should not flag current/parent directory markers', () => {
      expect(isHiddenPath('.')).toBe(false);
      expect(isHiddenPath('..')).toBe(false);
    });
  });

  describe('normalizePath', () => {
    test('should normalize path separators', () => {
      expect(normalizePath('path\\to\\file')).toBe('path/to/file');
      expect(normalizePath('path/to/file')).toBe('path/to/file');
    });
  });

  describe('getRelativePath', () => {
    test('should calculate relative path', () => {
      const { getRelativePath } = require('./path-utils');
      const result = getRelativePath('/home/user', '/home/user/project/file.txt');
      expect(result).toContain('project');
    });
  });

  describe('getAbsolutePath', () => {
    test('should resolve absolute path', () => {
      const { getAbsolutePath } = require('./path-utils');
      const result = getAbsolutePath('.');
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
