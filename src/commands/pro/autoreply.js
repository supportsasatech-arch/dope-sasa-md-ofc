export default {
  name: 'autoreply',
  description: 'Set auto-reply message',
  async execute(sock, msg, args, { chatId, user }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '💬 Usage: .autoreply Hello, I am busy!' });
    const replyText = args.join(' ');
    await User.findOneAndUpdate({ jid: user.jid }, { $set: { 'settings.autoreply': replyText } });
    await sock.sendMessage(chatId, { text: `✅ Auto-reply set to: ${replyText}` });
  }
};
