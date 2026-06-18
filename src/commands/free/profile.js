export default {
  name: 'profile',
  description: 'View WhatsApp profile picture',
  async execute(sock, msg, args, { chatId, sender }) {
    try {
      const ppUrl = await sock.profilePictureUrl(sender, 'image');
      await sock.sendMessage(chatId, { image: { url: ppUrl }, caption: '🖼️ Your Profile Picture' });
    } catch {
      await sock.sendMessage(chatId, { text: '❌ No profile picture.' });
    }
  }
};
