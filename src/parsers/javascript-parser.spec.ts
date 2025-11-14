import { JavaScriptParser } from './javascript-parser';

describe('JavaScriptParser', () => {
  let parser: JavaScriptParser;

  beforeEach(() => {
    parser = new JavaScriptParser();
  });

  test('should support JavaScript extensions', () => {
    const extensions = parser.getSupportedExtensions();
    expect(extensions).toContain('js');
    expect(extensions).toContain('jsx');
    expect(extensions).toContain('ts');
    expect(extensions).toContain('tsx');
  });

  test('should count simple code lines', () => {
    const content = `const x = 1;
const y = 2;
const z = 3;`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(3);
    expect(result.commentLines).toBe(0);
  });

  test('should count single-line comments', () => {
    const content = `// This is a comment
const x = 1;
// Another comment`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(2);
  });

  test('should count multi-line comments', () => {
    const content = `/*
 * Multi-line comment
 * Another line
 */
const x = 1;`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(4);
  });

  test('should count blank lines', () => {
    const content = `const x = 1;

const y = 2;

`;

    const result = parser.parse(content);
    expect(result.blankLines).toBe(3);
  });

  test('should handle inline comments', () => {
    const content = `const x = 1; // inline comment`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
  });

  test('should handle comments in strings', () => {
    const content = `const str = "// not a comment";`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(0);
  });

  test('should handle block comment on single line', () => {
    const content = `/* comment */ const x = 1;`;

    const result = parser.parse(content);
    expect(result.commentLines).toBe(1);
  });

  test('should handle nested block comment markers', () => {
    const content = `/*
 * /* nested
 */
const x = 1;`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBeGreaterThan(0);
  });

  test('should handle code after inline comment', () => {
    const content = `const x = /* comment */ 1;`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
  });

  test('should handle strings with escape characters', () => {
    const content = `const str = "test\\"string";`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(0);
  });

  test('should handle template literals', () => {
    const content = 'const str = `// not a comment`;';

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(0);
  });
});
