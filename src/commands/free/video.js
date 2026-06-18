import yts from 'yt-search';

export default {
  name: 'video',
  description: 'Search and send YouTube video',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🎬 Usage: .video song name' });
    const query = args.join(' ');
    const r = await yts(query);
    const video = r.videos[0];
    if (!video) return sock.sendMessage(chatId, { text: '❌ No results.' });
    const res = await axios.get(`https://api.download-youtube.mp4.lat/video?url=https://youtu.be/${video.videoId}`);
    await sock.sendMessage(chatId, { video: { url: res.data.url }, caption: `🎬 ${video.title}` });
  }
};
