import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import sharp from 'sharp';

export default {
  name: 'premiumsticker',
  description: 'HD sticker with custom quality',
  async execute(sock, msg, args, { chatId }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const target = quoted || msg.message;
    const type = Object.keys(target).find(k => k.includes('Message'));
    if (!type || !['imageMessage', 'videoMessage'].includes(type)) return sock.sendMessage(chatId, { text: '📸 Reply to media.' });

    const stream = await downloadContentFromMessage(target[type], type.replace('Message', ''));
    let buffer = Buffer.alloc(0);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const stickerBuffer = await sharp(buffer)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 100 })
      .toBuffer();

    await sock.sendMessage(chatId, { sticker: stickerBuffer });
  }
};
