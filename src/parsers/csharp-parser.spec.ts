import { CSharpParser } from './csharp-parser';

describe('CSharpParser', () => {
  let parser: CSharpParser;

  beforeEach(() => {
    parser = new CSharpParser();
  });

  test('should support C# extensions', () => {
    const extensions = parser.getSupportedExtensions();
    expect(extensions).toContain('cs');
  });

  test('should count simple code lines', () => {
    const content = `var x = 1;
var y = 2;
var z = 3;`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(3);
    expect(result.commentLines).toBe(0);
  });

  test('should count single-line comments', () => {
    const content = `// This is a comment
var x = 1;
// Another comment`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(2);
  });

  test('should count XML doc comments', () => {
    const content = `/// <summary>
/// This is a doc comment
/// </summary>
public void Method() { }`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(3);
  });

  test('should count multi-line comments', () => {
    const content = `/*
 * Multi-line comment
 * Another line
 */
var x = 1;`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(4);
  });
});
