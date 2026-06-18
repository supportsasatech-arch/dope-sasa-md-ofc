export default {
  name: 'ping',
  description: 'Check bot response time',
  async execute(sock, msg, args, { chatId }) {
    const start = Date.now();
    const sent = await sock.sendMessage(chatId, { text: '⏳ Pinging...' });
    const latency = Date.now() - start;
    await sock.sendMessage(chatId, { text: `🏓 Pong! ${latency}ms`, edit: sent.key });
  }
};
