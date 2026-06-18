import axios from 'axios';
import { randomStr } from '../../../lib/utils.js';
import fs from 'fs/promises';

export default {
  name: 'attp',
  description: 'Animated text sticker (ATTP)',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '💬 Usage: .attp DOPE SASA' });
    const text = args.join(' ');
    const url = `https://api.xteam.xyz/attp?file&text=${encodeURIComponent(text)}`;
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const path = `/tmp/${randomStr()}.gif`;
    await fs.writeFile(path, res.data);
    await sock.sendMessage(chatId, { sticker: { url: path } });
    await fs.unlink(path);
  }
};
