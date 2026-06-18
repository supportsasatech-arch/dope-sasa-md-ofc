// Similar to play, but returns song title + audio
export default {
  name: 'song',
  description: 'Download song by name',
  async execute(sock, msg, args, { chatId }) {
    return await import('./play.js').then(cmd => cmd.default.execute(sock, msg, args, { chatId }));
  }
};
