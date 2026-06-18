import { groqChat } from '../../../lib/groq.js';

export default {
  name: 'gpt4',
  description: 'Advanced AI (Groq Llama-3)',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🧠 Usage: .gpt4 complex problem' });
    const response = await groqChat([
      { role: 'system', content: 'You are a highly intelligent assistant, answer in detail.' },
      { role: 'user', content: args.join(' ') }
    ], 'llama-3.3-70b-versatile');
    await sock.sendMessage(chatId, { text: `🧠 *GPT-4:* ${response}` });
  }
};
