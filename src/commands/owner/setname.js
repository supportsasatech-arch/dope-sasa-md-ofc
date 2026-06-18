export default {
  name: 'setname',
  description: 'Set bot name',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '✏️ Usage: .setname DOPE SASA V3' });
    const name = args.join(' ');
    await sock.updateProfileName(name);
    await sock.sendMessage(chatId, { text: `✅ Bot name changed to ${name}` });
  }
};
