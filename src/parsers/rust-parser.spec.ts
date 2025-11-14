import { RustParser } from './rust-parser';

describe('RustParser', () => {
  let parser: RustParser;

  beforeEach(() => {
    parser = new RustParser();
  });

  test('should support Rust extensions', () => {
    const extensions = parser.getSupportedExtensions();
    expect(extensions).toContain('rs');
  });

  test('should count simple code lines', () => {
    const content = `let x = 1;
let y = 2;
let z = 3;`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(3);
    expect(result.commentLines).toBe(0);
  });

  test('should count single-line comments', () => {
    const content = `// This is a comment
let x = 1;
// Another comment`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(2);
  });

  test('should count doc comments', () => {
    const content = `/// This is a doc comment
/// Another doc comment line
fn main() { }`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(2);
  });

  test('should count module doc comments', () => {
    const content = `//! This is a module doc comment
let x = 1;`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(1);
  });

  test('should count multi-line comments', () => {
    const content = `/*
 * Multi-line comment
 * Another line
 */
let x = 1;`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(4);
  });
});
