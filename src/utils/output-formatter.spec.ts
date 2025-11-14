import { formatSummary, formatVerboseOutput } from './output-formatter';
import { AnalysisResult } from '../core/types';

describe('output-formatter', () => {
  const mockResult: AnalysisResult = {
    totalFiles: 10,
    linesOfCode: 500,
    linesOfDocumentation: 150,
    commentLines: 100,
    markdownLines: 50,
    fileMetrics: [
      {
        filePath: 'src/test.ts',
        totalLines: 50,
        codeLines: 40,
        commentLines: 5,
        blankLines: 5,
        isDocumentation: false,
        language: 'JavaScript/TypeScript',
      },
      {
        filePath: 'README.md',
        totalLines: 20,
        codeLines: 0,
        commentLines: 18,
        blankLines: 2,
        isDocumentation: true,
        language: 'Markdown',
      },
    ],
    languageBreakdown: new Map([
      ['JavaScript/TypeScript', { files: 1, linesOfCode: 40, commentLines: 5 }],
      ['Markdown', { files: 1, linesOfCode: 0, commentLines: 18 }],
    ]),
  };

  describe('formatSummary', () => {
    test('should format summary correctly', () => {
      const summary = formatSummary(mockResult);

      expect(summary).toContain('Code Metrics Summary');
      expect(summary).toContain('Files: 10');
      expect(summary).toContain('Lines of Code: 500');
      expect(summary).toContain('Lines of Documentation: 150');
      expect(summary).toContain('Comments: 100');
      expect(summary).toContain('Markdown Files: 50');
      expect(summary).toContain('Language Breakdown');
      expect(summary).toContain('JavaScript/TypeScript:');
      expect(summary).toContain('Markdown:');
    });
  });

  describe('formatVerboseOutput', () => {
    test('should format verbose output correctly', () => {
      const output = formatVerboseOutput(mockResult);

      expect(output).toContain('File Details:');
      expect(output).toContain('File: src/test.ts');
      expect(output).toContain('Total Lines: 50');
      expect(output).toContain('Code Lines: 40');
      expect(output).toContain('Comment Lines: 5');
      expect(output).toContain('Blank Lines: 5');
      expect(output).toContain('Type: Code');
      expect(output).toContain('File: README.md');
      expect(output).toContain('Type: Documentation');
    });
  });

  describe('formatJsonOutput', () => {
    test('should format JSON output correctly', () => {
      const { formatJsonOutput } = require('./output-formatter');
      const output = formatJsonOutput(mockResult);
      const parsed = JSON.parse(output);

      expect(parsed).toHaveProperty('summary');
      expect(parsed).toHaveProperty('languages');
      expect(parsed.summary.totalFiles).toBe(10);
      expect(parsed.summary.linesOfCode).toBe(500);
      expect(parsed.summary.linesOfDocumentation).toBe(150);
      expect(parsed.summary.commentLines).toBe(100);
      expect(parsed.summary.markdownLines).toBe(50);
      expect(Array.isArray(parsed.languages)).toBe(true);
      expect(parsed.languages).toHaveLength(2);
    });

    test('should sort languages by lines of code', () => {
      const { formatJsonOutput } = require('./output-formatter');
      const output = formatJsonOutput(mockResult);
      const parsed = JSON.parse(output);

      expect(parsed.languages[0].language).toBe('JavaScript/TypeScript');
      expect(parsed.languages[0].linesOfCode).toBe(40);
      expect(parsed.languages[1].language).toBe('Markdown');
      expect(parsed.languages[1].linesOfCode).toBe(0);
    });

    test('should include all language properties', () => {
      const { formatJsonOutput } = require('./output-formatter');
      const output = formatJsonOutput(mockResult);
      const parsed = JSON.parse(output);

      const lang = parsed.languages[0];
      expect(lang).toHaveProperty('language');
      expect(lang).toHaveProperty('files');
      expect(lang).toHaveProperty('linesOfCode');
      expect(lang).toHaveProperty('commentLines');
    });
  });

  describe('showProgress', () => {
    test('should not fail with zero total', () => {
      // Just make sure it doesn't crash
      const { showProgress } = require('./output-formatter');
      expect(() => showProgress(0, 0)).not.toThrow();
    });

    test('should handle progress updates', () => {
      const { showProgress } = require('./output-formatter');
      expect(() => showProgress(5, 10)).not.toThrow();
      expect(() => showProgress(10, 10)).not.toThrow();
    });
  });
});
