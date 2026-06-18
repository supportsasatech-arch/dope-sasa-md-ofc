import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commands = new Map();

export async function loadCommands() {
  if (commands.size > 0) return commands;
  const categories = ['free', 'pro', 'owner'];
  for (const cat of categories) {
    const dir = path.join(__dirname, '..', 'src', 'commands', cat);
    try {
      const files = await fs.readdir(dir);
      for (const file of files.filter(f => f.endsWith('.js'))) {
        const cmd = await import(`../src/commands/${cat}/${file}`);
        if (cmd.default?.name) {
          cmd.default.category = cat;
          commands.set(cmd.default.name, cmd.default);
        }
      }
    } catch (err) {
      // Directory may not exist, skip
    }
  }
  return commands;
}
