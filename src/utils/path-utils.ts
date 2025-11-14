import { resolve, relative, sep, normalize } from 'path';

export function normalizePath(filePath: string): string {
  return normalize(filePath).replace(/\\/g, '/');
}

export function getRelativePath(from: string, to: string): string {
  return normalizePath(relative(from, to));
}

export function getAbsolutePath(filePath: string): string {
  return resolve(filePath);
}

export function isHiddenPath(filePath: string): boolean {
  const parts = filePath.split(sep);
  return parts.some((part) => part.startsWith('.') && part !== '.' && part !== '..');
}

export function getFileExtension(filePath: string): string {
  const match = filePath.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : '';
}
