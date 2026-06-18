import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'seo',
  description: 'SEO keyword suggestions',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🔍 Usage: .seo my website topic' });
    const response = await groqChat([
      { role: 'system', content: 'Provide SEO keyword ideas and meta description.' },
      { role: 'user', content: args.join(' ') }
    ]);
    await sock.sendMessage(chatId, { text: `🔍 *SEO Tips:*\n${response}` });
  }
};
