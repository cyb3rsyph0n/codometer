import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execAsync = promisify(exec);

describe('CLI Integration Tests', () => {
  const cliPath = join(__dirname, '../../dist/index.js');

  test('should display help text', async () => {
    const { stdout } = await execAsync(`node ${cliPath} --help`);
    expect(stdout).toContain('codometer');
    expect(stdout).toContain('Usage:');
    expect(stdout).toContain('Options:');
  });

  test('should display version', async () => {
    const { stdout } = await execAsync(`node ${cliPath} --version`);
    expect(stdout).toContain('codometer v');
  });

  test('should analyze src directory', async () => {
    const srcPath = join(__dirname, '../../src');
    const { stdout } = await execAsync(`node ${cliPath} ${srcPath}`);
    
    expect(stdout).toContain('Code Metrics Summary');
    expect(stdout).toContain('Files:');
    expect(stdout).toContain('Lines of Code:');
    expect(stdout).toContain('Lines of Documentation:');
  }, 10000);

  test('should exclude test files', async () => {
    const projectPath = join(__dirname, '../..');
    const { stdout } = await execAsync(
      `node ${cliPath} ${projectPath} --exclude-tests="*.test.ts"`
    );
    
    expect(stdout).toContain('Code Metrics Summary');
    expect(stdout).toContain('Files:');
  }, 10000);

  test('should output JSON when --output-json flag is used', async () => {
    const srcPath = join(__dirname, '../../src');
    const { stdout } = await execAsync(`node ${cliPath} ${srcPath} --output-json`);
    
    // Should be valid JSON
    const parsed = JSON.parse(stdout);
    
    expect(parsed).toHaveProperty('summary');
    expect(parsed).toHaveProperty('languages');
    expect(parsed.summary).toHaveProperty('totalFiles');
    expect(parsed.summary).toHaveProperty('linesOfCode');
    expect(parsed.summary).toHaveProperty('linesOfDocumentation');
    expect(parsed.summary).toHaveProperty('commentLines');
    expect(parsed.summary).toHaveProperty('markdownLines');
    expect(Array.isArray(parsed.languages)).toBe(true);
    
    // Should not contain progress output or text formatting
    expect(stdout).not.toContain('Code Metrics Summary');
    expect(stdout).not.toContain('Progress:');
  }, 10000);
});
