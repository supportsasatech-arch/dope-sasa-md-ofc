import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import axios from 'axios';
import FormData from 'form-data';

export default {
  name: 'tourl',
  description: 'Upload media to temp URL',
  async execute(sock, msg, args, { chatId }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const target = quoted || msg.message;
    const type = Object.keys(target).find(k => k.includes('Message'));
    if (!type || !['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage'].includes(type))
      return sock.sendMessage(chatId, { text: '📎 Reply to a media file to get URL.' });

    const stream = await downloadContentFromMessage(target[type], type.replace('Message', ''));
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    // Using tmpfiles.org or similar – replace with your preferred upload API
    const form = new FormData();
    form.append('file', buffer, { filename: 'media' });
    const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, { headers: form.getHeaders() });
    const url = res.data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');

    await sock.sendMessage(chatId, { text: `🔗 URL: ${url}` });
  }
};
