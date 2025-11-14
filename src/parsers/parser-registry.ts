import { BaseParser } from './base-parser';
import { JavaScriptParser } from './javascript-parser';
import { PythonParser } from './python-parser';
import { CSharpParser } from './csharp-parser';
import { CppParser } from './cpp-parser';
import { RustParser } from './rust-parser';
import { MarkdownParser } from './markdown-parser';

export class ParserRegistry {
  private parsers: BaseParser[] = [];
  private extensionMap: Map<string, BaseParser> = new Map();

  constructor() {
    this.registerParser(new JavaScriptParser());
    this.registerParser(new PythonParser());
    this.registerParser(new CSharpParser());
    this.registerParser(new CppParser());
    this.registerParser(new RustParser());
    this.registerParser(new MarkdownParser());
  }

  private registerParser(parser: BaseParser): void {
    this.parsers.push(parser);
    const extensions = parser.getSupportedExtensions();
    for (const ext of extensions) {
      this.extensionMap.set(ext.toLowerCase(), parser);
    }
  }

  getParser(extension: string): BaseParser | null {
    return this.extensionMap.get(extension.toLowerCase()) || null;
  }

  getLanguageName(extension: string): string {
    const parser = this.getParser(extension);
    return parser ? parser.getLanguageName() : 'Unknown';
  }

  isMarkdownExtension(extension: string): boolean {
    const parser = this.getParser(extension);
    return parser instanceof MarkdownParser;
  }
}
