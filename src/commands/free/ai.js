import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'ai',
  description: 'Chat with Groq AI',
  async execute(sock, msg, args, { chatId, user }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '❓ Please provide a question.' });
    if (user.settings.ai === false) return sock.sendMessage(chatId, { text: '🛑 AI is disabled in your settings.' });

    const query = args.join(' ');
    await sock.sendMessage(chatId, { text: '🤖 Thinking...' });

    const response = await groqChat([
      { role: 'system', content: 'You are DOPE SASA MD, a helpful assistant. Use emojis and reply concisely.' },
      { role: 'user', content: query }
    ]);

    await sock.sendMessage(chatId, { text: `🧠 *AI Response:*\n${response}` });
  }
};
