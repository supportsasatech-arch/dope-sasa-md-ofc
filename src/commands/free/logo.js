import axios from 'axios';
import { randomStr } from '../../../lib/utils.js';
import fs from 'fs/promises';

export default {
  name: 'logo',
  description: 'Generate logo text',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🖌️ Usage: .logo DOPE SASA' });
    const text = args.join(' ');
    const url = `https://flamingtext.com/net-fu/proxy_form.cgi?script=fluffy-logo&text=${encodeURIComponent(text)}&_loc=generate&imageoutput=true`;
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const path = `/tmp/${randomStr()}.png`;
    await fs.writeFile(path, res.data);
    await sock.sendMessage(chatId, { image: { url: path }, caption: 'Logo' });
    await fs.unlink(path);
  }
};
