import Ban from '../../../database/models/Ban.js';

export default {
  name: 'userban',
  description: 'Ban a user',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🚫 Usage: .userban @user' });
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) return sock.sendMessage(chatId, { text: '❌ Mention a user to ban.' });
    await Ban.findOneAndUpdate({ jid: mentioned }, { jid: mentioned, reason: 'Banned by owner' }, { upsert: true });
    await sock.sendMessage(chatId, { text: `🚫 Banned @${mentioned.split('@')[0]}` });
  }
};
