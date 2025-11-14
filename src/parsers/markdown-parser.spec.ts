import { MarkdownParser } from './markdown-parser';

describe('MarkdownParser', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  test('should support Markdown extensions', () => {
    const extensions = parser.getSupportedExtensions();
    expect(extensions).toContain('md');
    expect(extensions).toContain('markdown');
  });

  test('should count all content as documentation', () => {
    const content = `# Header

This is content.

\`\`\`javascript
const x = 1;
\`\`\`

More content.`;
    
    const result = parser.parse(content);
    expect(result.codeLines).toBe(0);
    expect(result.commentLines).toBeGreaterThan(0);
  });

  test('should count blank lines correctly', () => {
    const content = `# Header


Content`;
    
    const result = parser.parse(content);
    expect(result.blankLines).toBe(2);
  });
});
