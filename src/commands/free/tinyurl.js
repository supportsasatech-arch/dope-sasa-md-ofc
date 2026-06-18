// Similar, keep separate file
export default {
  name: 'tinyurl',
  description: 'Shorten using tinyurl',
  async execute(sock, msg, args, { chatId }) {
    // same as shorturl, but dedicated command name
    if (!args.length) return sock.sendMessage(chatId, { text: '🔗 Usage: .tinyurl https://example.com' });
    const url = args[0];
    const res = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    await sock.sendMessage(chatId, { text: `🔗 TinyURL: ${res.data}` });
  }
};
