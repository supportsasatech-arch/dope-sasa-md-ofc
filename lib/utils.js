import fs from 'fs/promises';
import axios from 'axios';

export async function downloadBuffer(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(res.data);
}

export function randomStr(length = 8) {
  return Math.random().toString(36).substring(2, length + 2);
}

export async function deleteFile(path) {
  try { await fs.unlink(path); } catch {}
}
