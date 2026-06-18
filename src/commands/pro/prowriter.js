import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'prowriter',
  description: 'Professional writing assistant',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '✍️ Usage: .prowriter write a blog about AI' });
    const response = await groqChat([
      { role: 'system', content: 'You are a professional writer. Write in a clear, engaging style.' },
      { role: 'user', content: args.join(' ') }
    ]);
    await sock.sendMessage(chatId, { text: `✍️ *Pro Writer:*\n${response}` });
  }
};
