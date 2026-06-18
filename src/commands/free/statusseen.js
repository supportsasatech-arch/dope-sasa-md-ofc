export default {
  name: 'statusseen',
  description: 'Toggle auto status view',
  async execute(sock, msg, args, { user, chatId }) {
    const newState = !user.settings.autostatusseen;
    await User.findOneAndUpdate({ jid: user.jid }, { $set: { 'settings.autostatusseen': newState } });
    await sock.sendMessage(chatId, { text: `👁️ Auto status seen ${newState ? 'on' : 'off'}.` });
  }
};
