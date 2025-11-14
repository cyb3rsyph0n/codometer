import { AnalysisResult, JsonOutput } from '../core/types';

export function formatJsonOutput(result: AnalysisResult): string {
  const sortedLanguages = Array.from(result.languageBreakdown.entries())
    .sort((a, b) => b[1].linesOfCode - a[1].linesOfCode)
    .map(([name, metrics]) => ({
      name,
      files: metrics.files,
      linesOfCode: metrics.linesOfCode,
      commentLines: metrics.commentLines,
    }));

  const jsonOutput: JsonOutput = {
    summary: {
      totalFiles: result.totalFiles,
      linesOfCode: result.linesOfCode,
      linesOfDocumentation: result.linesOfDocumentation,
      commentLines: result.commentLines,
      markdownLines: result.markdownLines,
    },
    languages: sortedLanguages,
  };

  return JSON.stringify(jsonOutput, null, 2);
}

export function formatSummary(result: AnalysisResult): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('='.repeat(50));
  lines.push('Code Metrics Summary');
  lines.push('='.repeat(50));
  lines.push('');
  lines.push(`Files: ${result.totalFiles}`);
  lines.push(`Lines of Code: ${result.linesOfCode}`);
  lines.push(`Lines of Documentation: ${result.linesOfDocumentation}`);
  lines.push(`  - Comments: ${result.commentLines}`);
  lines.push(`  - Markdown Files: ${result.markdownLines}`);
  lines.push('');

  // Language breakdown
  lines.push('-'.repeat(50));
  lines.push('Language Breakdown');
  lines.push('-'.repeat(50));
  lines.push('');

  // Sort languages by lines of code (descending)
  const sortedLanguages = Array.from(result.languageBreakdown.entries()).sort(
    (a, b) => b[1].linesOfCode - a[1].linesOfCode
  );

  for (const [language, metrics] of sortedLanguages) {
    lines.push(`${language}:`);
    lines.push(`  Files: ${metrics.files}`);
    lines.push(`  Lines of Code: ${metrics.linesOfCode}`);
    lines.push(`  Comment Lines: ${metrics.commentLines}`);
    lines.push('');
  }

  return lines.join('\n');
}

export function formatVerboseOutput(result: AnalysisResult): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('File Details:');
  lines.push('-'.repeat(80));

  for (const metrics of result.fileMetrics) {
    lines.push(`File: ${metrics.filePath}`);
    lines.push(`  Total Lines: ${metrics.totalLines}`);
    lines.push(`  Code Lines: ${metrics.codeLines}`);
    lines.push(`  Comment Lines: ${metrics.commentLines}`);
    lines.push(`  Blank Lines: ${metrics.blankLines}`);
    lines.push(`  Type: ${metrics.isDocumentation ? 'Documentation' : 'Code'}`);
    lines.push('');
  }

  return lines.join('\n');
}

export function showProgress(current: number, total: number, silent = false): void {
  if (silent || total === 0) return;

  const percentage = Math.floor((current / total) * 100);
  const barLength = 40;
  const filledLength = Math.floor((barLength * current) / total);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

  process.stdout.write(`\rProgress: [${bar}] ${percentage}% (${current}/${total})`);

  if (current === total) {
    process.stdout.write('\n');
  }
}
