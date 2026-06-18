import Ban from '../../../database/models/Ban.js';

export default {
  name: 'userunban',
  description: 'Unban a user',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🔓 Usage: .userunban @user' });
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) return sock.sendMessage(chatId, { text: '❌ Mention a user to unban.' });
    await Ban.deleteOne({ jid: mentioned });
    await sock.sendMessage(chatId, { text: `✅ Unbanned @${mentioned.split('@')[0]}` });
  }
};
