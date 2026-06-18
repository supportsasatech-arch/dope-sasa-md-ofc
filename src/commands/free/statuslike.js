export default {
  name: 'statuslike',
  description: 'Toggle auto status like',
  async execute(sock, msg, args, { user, chatId }) {
    const newState = !user.settings.autostatuslike;
    await User.findOneAndUpdate({ jid: user.jid }, { $set: { 'settings.autostatuslike': newState } });
    await sock.sendMessage(chatId, { text: `👍 Auto status like ${newState ? 'on' : 'off'}.` });
  }
};
