import { ParserRegistry } from './parser-registry';
import { MarkdownParser } from './markdown-parser';

describe('ParserRegistry', () => {
  let registry: ParserRegistry;

  beforeEach(() => {
    registry = new ParserRegistry();
  });

  test('should get JavaScript parser for .js extension', () => {
    const parser = registry.getParser('js');
    expect(parser).not.toBeNull();
    expect(parser?.getSupportedExtensions()).toContain('js');
  });

  test('should get TypeScript parser for .ts extension', () => {
    const parser = registry.getParser('ts');
    expect(parser).not.toBeNull();
    expect(parser?.getSupportedExtensions()).toContain('ts');
  });

  test('should get Python parser for .py extension', () => {
    const parser = registry.getParser('py');
    expect(parser).not.toBeNull();
    expect(parser?.getSupportedExtensions()).toContain('py');
  });

  test('should get C# parser for .cs extension', () => {
    const parser = registry.getParser('cs');
    expect(parser).not.toBeNull();
    expect(parser?.getSupportedExtensions()).toContain('cs');
  });

  test('should get C++ parser for .cpp extension', () => {
    const parser = registry.getParser('cpp');
    expect(parser).not.toBeNull();
    expect(parser?.getSupportedExtensions()).toContain('cpp');
  });

  test('should get Rust parser for .rs extension', () => {
    const parser = registry.getParser('rs');
    expect(parser).not.toBeNull();
    expect(parser?.getSupportedExtensions()).toContain('rs');
  });

  test('should get Markdown parser for .md extension', () => {
    const parser = registry.getParser('md');
    expect(parser).not.toBeNull();
    expect(parser).toBeInstanceOf(MarkdownParser);
  });

  test('should return null for unsupported extension', () => {
    const parser = registry.getParser('xyz');
    expect(parser).toBeNull();
  });

  test('should identify markdown extensions', () => {
    expect(registry.isMarkdownExtension('md')).toBe(true);
    expect(registry.isMarkdownExtension('markdown')).toBe(true);
    expect(registry.isMarkdownExtension('js')).toBe(false);
  });

  test('should handle case-insensitive extensions', () => {
    const parser = registry.getParser('JS');
    expect(parser).not.toBeNull();
  });
});
