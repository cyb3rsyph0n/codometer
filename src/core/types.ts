export interface FileMetrics {
  filePath: string;
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  isDocumentation: boolean;
  language: string;
}

export interface ScanOptions {
  rootPath: string;
  respectGitignore: boolean;
  excludeTests?: string;
  followSymlinks: boolean;
  includeHidden: boolean;
  verbose: boolean;
  maxFileSize: number;
  silent?: boolean;
}

export interface LanguageMetrics {
  files: number;
  linesOfCode: number;
  commentLines: number;
}

export interface AnalysisResult {
  totalFiles: number;
  linesOfCode: number;
  linesOfDocumentation: number;
  commentLines: number;
  markdownLines: number;
  fileMetrics: FileMetrics[];
  languageBreakdown: Map<string, LanguageMetrics>;
}

export interface ParserResult {
  codeLines: number;
  commentLines: number;
  blankLines: number;
}

export interface CLIOptions {
  path?: string;
  ignoreGitignore: boolean;
  excludeTests?: string;
  followSymlinks: boolean;
  includeHidden: boolean;
  verbose: boolean;
  help: boolean;
  version: boolean;
  outputJson: boolean;
}
