import axios from 'axios';

export default {
  name: 'voiceclone',
  description: 'Clone voice (TTS with custom voice)',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🗣️ Usage: .voiceclone Hello there' });
    const text = args.join(' ');
    // Use ElevenLabs or similar, for demo we use gTTS
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(text)}`;
    await sock.sendMessage(chatId, { audio: { url }, mimetype: 'audio/mp4', ptt: true });
  }
};
