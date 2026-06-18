export default {
  name: 'removepro',
  description: 'Remove premium (by number)',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '❌ Usage: .removepro 9477xxxxxxx' });
    const jid = args[0] + '@s.whatsapp.net';
    await Premium.deleteOne({ jid });
    await User.findOneAndUpdate({ jid }, { premium: false, premiumExpiry: null });
    await sock.sendMessage(chatId, { text: `❌ Premium removed from ${args[0]}` });
  }
};
