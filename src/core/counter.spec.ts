import { Counter } from './counter';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('Counter', () => {
  const testDir = join(__dirname, '../../tests/fixtures/counter-test');
  let counter: Counter;

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  beforeEach(() => {
    counter = new Counter();
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test('should count JavaScript file', async () => {
    const testFile = join(testDir, 'test.js');
    await fs.writeFile(
      testFile,
      `// Comment
const x = 1;
const y = 2;`,
      'utf-8'
    );

    const metrics = await counter.countFile(testFile);
    expect(metrics.codeLines).toBe(2);
    expect(metrics.commentLines).toBe(1);
    expect(metrics.isDocumentation).toBe(false);
    expect(metrics.language).toBe('JavaScript/TypeScript');
  });

  test('should count Markdown file as documentation', async () => {
    const testFile = join(testDir, 'test.md');
    await fs.writeFile(testFile, '# Header\n\nContent', 'utf-8');

    const metrics = await counter.countFile(testFile);
    expect(metrics.codeLines).toBe(0);
    expect(metrics.commentLines).toBeGreaterThan(0);
    expect(metrics.isDocumentation).toBe(true);
    expect(metrics.language).toBe('Markdown');
  });

  test('should return zero metrics for unsupported extension', async () => {
    const testFile = join(testDir, 'test.xyz');
    await fs.writeFile(testFile, 'some content', 'utf-8');

    const metrics = await counter.countFile(testFile);
    expect(metrics.codeLines).toBe(0);
    expect(metrics.commentLines).toBe(0);
    expect(metrics.totalLines).toBe(0);
    expect(metrics.language).toBe('Unknown');
  });
});
