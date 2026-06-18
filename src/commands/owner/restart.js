export default {
  name: 'restart',
  description: 'Restart the bot',
  async execute(sock, msg, args, { chatId }) {
    await sock.sendMessage(chatId, { text: '🔄 Restarting...' });
    process.exit(0);
  }
};
