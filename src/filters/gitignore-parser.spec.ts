import { GitignoreParser } from './gitignore-parser';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('GitignoreParser', () => {
  const testDir = join(__dirname, '../../tests/fixtures/gitignore-test');

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test('should load and parse .gitignore file', async () => {
    const gitignorePath = join(testDir, '.gitignore');
    await fs.writeFile(
      gitignorePath,
      `
# Comment
node_modules/
*.log
dist
`,
      'utf-8'
    );

    const parser = new GitignoreParser();
    await parser.loadGitignore(testDir);

    expect(parser.shouldIgnore(join(testDir, 'node_modules'), testDir, true)).toBe(true);
    expect(parser.shouldIgnore(join(testDir, 'test.log'), testDir, false)).toBe(true);
    expect(parser.shouldIgnore(join(testDir, 'dist'), testDir, true)).toBe(true);
    expect(parser.shouldIgnore(join(testDir, 'src/index.ts'), testDir, false)).toBe(false);
  });

  test('should handle directory without .gitignore', async () => {
    const emptyDir = join(testDir, 'empty');
    await fs.mkdir(emptyDir, { recursive: true });

    const parser = new GitignoreParser();
    await parser.loadGitignore(emptyDir);

    expect(parser.shouldIgnore(join(emptyDir, 'test.txt'), emptyDir, false)).toBe(false);
  });

  test('should handle negation patterns', async () => {
    const gitignorePath = join(testDir, '.gitignore');
    await fs.writeFile(
      gitignorePath,
      `
*.log
!important.log
`,
      'utf-8'
    );

    const parser = new GitignoreParser();
    await parser.loadGitignore(testDir);

    expect(parser.shouldIgnore(join(testDir, 'test.log'), testDir, false)).toBe(true);
    expect(parser.shouldIgnore(join(testDir, 'important.log'), testDir, false)).toBe(false);
  });

  test('should handle directory-only patterns', async () => {
    const gitignorePath = join(testDir, '.gitignore');
    await fs.writeFile(
      gitignorePath,
      `
build/
`,
      'utf-8'
    );

    const parser = new GitignoreParser();
    await parser.loadGitignore(testDir);

    expect(parser.shouldIgnore(join(testDir, 'build'), testDir, true)).toBe(true);
    expect(parser.shouldIgnore(join(testDir, 'build'), testDir, false)).toBe(false);
  });

  test('should handle root-relative patterns', async () => {
    const gitignorePath = join(testDir, '.gitignore');
    await fs.writeFile(
      gitignorePath,
      `
/dist
`,
      'utf-8'
    );

    const parser = new GitignoreParser();
    await parser.loadGitignore(testDir);

    expect(parser.shouldIgnore(join(testDir, 'dist'), testDir, true)).toBe(true);
  });
});
