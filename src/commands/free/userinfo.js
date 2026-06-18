export default {
  name: 'userinfo',
  description: 'Your user info',
  async execute(sock, msg, args, { user, chatId }) {
    await sock.sendMessage(chatId, { text: `👤 *Name:* ${user.name}\n🌟 Premium: ${user.premium}\n💰 Balance: ${user.balance}\n⚡ Level: ${user.level}` });
  }
};
