import { ScanOptions, AnalysisResult, FileMetrics } from './types';
import { Scanner } from './scanner';
import { Counter } from './counter';
import { showProgress } from '../utils/output-formatter';

export class Analyzer {
  private options: ScanOptions;
  private scanner: Scanner;
  private counter: Counter;

  constructor(options: ScanOptions) {
    this.options = options;
    this.scanner = new Scanner(options);
    this.counter = new Counter();
  }

  async analyze(): Promise<AnalysisResult> {
    const files = await this.scanner.scan();
    const fileMetrics: FileMetrics[] = [];

    let processed = 0;
    for (const file of files) {
      const metrics = await this.counter.countFile(file);
      fileMetrics.push(metrics);

      processed++;
      if (!this.options.verbose && files.length > 10) {
        showProgress(processed, files.length);
      }
    }

    return this.aggregateResults(fileMetrics);
  }

  private aggregateResults(fileMetrics: FileMetrics[]): AnalysisResult {
    let linesOfCode = 0;
    let commentLines = 0;
    let markdownLines = 0;
    const languageBreakdown = new Map<
      string,
      { files: number; linesOfCode: number; commentLines: number }
    >();

    for (const metrics of fileMetrics) {
      if (metrics.isDocumentation) {
        markdownLines += metrics.commentLines;
      } else {
        linesOfCode += metrics.codeLines;
        commentLines += metrics.commentLines;
      }

      // Track language breakdown
      const langStats = languageBreakdown.get(metrics.language) || {
        files: 0,
        linesOfCode: 0,
        commentLines: 0,
      };
      langStats.files++;
      langStats.linesOfCode += metrics.codeLines;
      langStats.commentLines += metrics.commentLines;
      languageBreakdown.set(metrics.language, langStats);
    }

    const linesOfDocumentation = commentLines + markdownLines;

    return {
      totalFiles: fileMetrics.length,
      linesOfCode,
      linesOfDocumentation,
      commentLines,
      markdownLines,
      fileMetrics,
      languageBreakdown,
    };
  }
}
