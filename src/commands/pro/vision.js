import { groqChat } from '../../../lib/groq.js';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export default {
  name: 'vision',
  description: 'Describe an image using AI vision',
  async execute(sock, msg, args, { chatId }) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMsg = quoted?.imageMessage || msg.message?.imageMessage;
    if (!imageMsg) return sock.sendMessage(chatId, { text: '🖼️ Reply to an image to analyze.' });

    const stream = await downloadContentFromMessage(imageMsg, 'image');
    let buffer = Buffer.alloc(0);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    const base64 = buffer.toString('base64');

    // Use Groq's vision model (llama-3.2-11b-vision-preview)
    const response = await groqChat([
      { role: 'user', content: [
        { type: 'text', text: 'Describe this image in detail.' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } }
      ]}
    ], 'llama-3.2-11b-vision-preview');
    await sock.sendMessage(chatId, { text: `👁️ *Vision:* ${response}` });
  }
};
