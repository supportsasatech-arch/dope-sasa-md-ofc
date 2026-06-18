export default {
  name: 'shutdown',
  description: 'Shutdown the bot',
  async execute(sock, msg, args, { chatId }) {
    await sock.sendMessage(chatId, { text: '🛑 Shutting down...' });
    process.exit(1);
  }
};
