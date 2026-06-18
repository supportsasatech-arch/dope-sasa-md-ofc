import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'marketing',
  description: 'Marketing strategy ideas',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '📣 Usage: .marketing new app launch' });
    const response = await groqChat([
      { role: 'system', content: 'Provide creative marketing tactics.' },
      { role: 'user', content: args.join(' ') }
    ]);
    await sock.sendMessage(chatId, { text: `📣 *Marketing Ideas:*\n${response}` });
  }
};
