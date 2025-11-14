import { PythonParser } from './python-parser';

describe('PythonParser', () => {
  let parser: PythonParser;

  beforeEach(() => {
    parser = new PythonParser();
  });

  test('should support Python extensions', () => {
    const extensions = parser.getSupportedExtensions();
    expect(extensions).toContain('py');
    expect(extensions).toContain('pyw');
  });

  test('should count simple code lines', () => {
    const content = `x = 1
y = 2
z = 3`;
    
    const result = parser.parse(content);
    expect(result.codeLines).toBe(3);
    expect(result.commentLines).toBe(0);
  });

  test('should count hash comments', () => {
    const content = `# This is a comment
x = 1
# Another comment`;
    
    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(2);
  });

  test('should count docstrings', () => {
    const content = `"""
This is a docstring
Multiple lines
"""
def foo():
    pass`;
    
    const result = parser.parse(content);
    expect(result.codeLines).toBe(2);
    expect(result.commentLines).toBe(4);
  });

  test('should handle inline docstrings', () => {
    const content = `def foo():
    """Single line docstring"""
    pass`;
    
    const result = parser.parse(content);
    expect(result.codeLines).toBe(2);
    expect(result.commentLines).toBe(1);
  });

  test('should handle comments in strings', () => {
    const content = `text = "# not a comment"`;
    
    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
    expect(result.commentLines).toBe(0);
  });

  test('should handle single quote docstrings', () => {
    const content = `'''
This is a docstring
Multiple lines
'''
def foo():
    pass`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(2);
    expect(result.commentLines).toBe(4);
  });

  test('should handle inline hash comment with code', () => {
    const content = `x = 1  # inline comment`;

    const result = parser.parse(content);
    expect(result.codeLines).toBe(1);
  });

  test('should handle just hash comment', () => {
    const content = `  # just a comment`;

    const result = parser.parse(content);
    expect(result.commentLines).toBe(1);
    expect(result.codeLines).toBe(0);
  });
});
