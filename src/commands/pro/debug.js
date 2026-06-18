import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'debug',
  description: 'Debug code or error',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🐛 Usage: .debug <error/code>' });
    const response = await groqChat([
      { role: 'system', content: 'You are a debugging expert. Find and fix the issue.' },
      { role: 'user', content: args.join(' ') }
    ]);
    await sock.sendMessage(chatId, { text: `🐛 *Debug:*\n${response}` });
  }
};
