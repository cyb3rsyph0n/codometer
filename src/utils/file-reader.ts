import { promises as fs } from 'fs';

const MAX_BUFFER_SIZE = 512;

export async function readFileContent(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

export async function isBinaryFile(filePath: string): Promise<boolean> {
  try {
    const buffer = Buffer.alloc(MAX_BUFFER_SIZE);
    const fileHandle = await fs.open(filePath, 'r');

    try {
      const { bytesRead } = await fileHandle.read(buffer, 0, MAX_BUFFER_SIZE, 0);

      if (bytesRead === 0) {
        return false;
      }

      const sample = buffer.slice(0, bytesRead);

      for (let i = 0; i < sample.length; i++) {
        const byte = sample[i];
        if (byte === 0 || (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13)) {
          return true;
        }
      }

      return false;
    } finally {
      await fileHandle.close();
    }
  } catch {
    return true;
  }
}

export async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}
