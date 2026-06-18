import axios from 'axios';

export default {
  name: 'movie',
  description: 'Search movie info',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🎬 Usage: .movie Inception' });
    const query = args.join(' ');
    const res = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=your_omdb_key`);
    const movie = res.data;
    if (movie.Response === 'False') return sock.sendMessage(chatId, { text: '❌ Movie not found.' });
    await sock.sendMessage(chatId, { text: `🎥 *${movie.Title} (${movie.Year})*\n⭐ ${movie.imdbRating}\n📜 ${movie.Plot}` });
  }
};
