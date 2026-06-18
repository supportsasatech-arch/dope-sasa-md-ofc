import { groqChat } from '../../../lib/groq.js';
import axios from 'axios';

export default {
  name: 'tts',
  description: 'Text to speech (audio)',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🔊 Usage: .tts Hello world' });
    const text = args.join(' ');
    // Use a free TTS API like voicerss (needs key) or gTTS via google-translate-api
    try {
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(text)}`;
      await sock.sendMessage(chatId, { audio: { url: audioUrl }, mimetype: 'audio/mp4', ptt: true });
    } catch {
      await sock.sendMessage(chatId, { text: '❌ TTS failed.' });
    }
  }
};
