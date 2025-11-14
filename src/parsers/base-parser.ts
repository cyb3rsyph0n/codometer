import { ParserResult } from '../core/types';

export abstract class BaseParser {
  abstract getSupportedExtensions(): string[];
  abstract getLanguageName(): string;
  abstract parse(content: string): ParserResult;

  protected countLines(content: string): number {
    if (!content) return 0;
    return content.split('\n').length;
  }

  protected isBlankLine(line: string): boolean {
    return line.trim().length === 0;
  }
}
