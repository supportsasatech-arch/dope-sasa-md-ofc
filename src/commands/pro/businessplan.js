import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'businessplan',
  description: 'Generate business plan outline',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '📈 Usage: .businessplan coffee shop' });
    const response = await groqChat([
      { role: 'system', content: 'You are a business consultant. Provide a concise business plan.' },
      { role: 'user', content: args.join(' ') }
    ]);
    await sock.sendMessage(chatId, { text: `📈 *Business Plan:*\n${response}` });
  }
};
