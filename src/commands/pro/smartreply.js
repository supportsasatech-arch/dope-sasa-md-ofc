/// Hy Im Dope Sasa 🥰"
import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'smartreply',
  description: 'Generate smart reply to a message',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '💡 Usage: .smartreply <message>' });
    const response = await groqChat([
      { role: 'system', content: 'Generate a witty, friendly reply to this message.' },
      { role: 'user', content: args.join(' ') }
    ]);
    await sock.sendMessage(chatId, { text: `💬 Smart reply: ${response}` });
  }
};
