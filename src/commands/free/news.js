import axios from 'axios';

export default {
  name: 'news',
  description: 'Latest headlines',
  async execute(sock, msg, args, { chatId }) {
    // Using NewsAPI (free tier) – requires API key, or use a free RSS approach
    // For production, use a simple RSS to text conversion or use GROQ to summarize from an RSS feed.
    // Example using a free news source:
    try {
      const res = await axios.get('https://api.nytimes.com/svc/topstories/v2/world.json?api-key=your_key');
      const headlines = res.data.results.slice(0, 5).map((a, i) => `${i+1}. ${a.title}`).join('\n');
      await sock.sendMessage(chatId, { text: `🗞️ *Top Headlines:*\n${headlines}` });
    } catch {
      // Fallback: use Groq to fetch news? For simplicity, we'll show a message.
      await sock.sendMessage(chatId, { text: '⚠️ News service unavailable. Please configure an API key.' });
    }
  }
};
