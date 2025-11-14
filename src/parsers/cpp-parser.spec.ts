import { CppParser } from './cpp-parser';

describe('CppParser', () => {
  let parser: CppParser;

  beforeEach(() => {
    parser = new CppParser();
  });

  test('should support C/C++ extensions', () => {
    const extensions = parser.getSupportedExtensions();
    expect(extensions).toContain('cpp');
    expect(extensions).toContain('h');
    expect(extensions).toContain('hpp');
  });

  test('should count simple code lines', () => {
    const content = `int x = 1;
int y = 2;
int z = 3;`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(3);
    expect(result.commentLines).toBe(0);
  });

  test('should count single-line comments', () => {
    const content = `// This is a comment
int x = 1;
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
int x = 1;`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(4);
  });
});
