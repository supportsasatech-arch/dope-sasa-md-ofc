import axios from 'axios';

export default {
  name: 'imagine',
  description: 'Generate AI image (SDXL)',
  async execute(sock, msg, args, { chatId }) {
    if (!args.length) return sock.sendMessage(chatId, { text: '🎨 Usage: .imagine cyberpunk city' });
    const prompt = args.join(' ');
    // Use a free Stable Diffusion API
    const res = await axios.get(`https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image`, {
      headers: { Authorization: `Bearer ${process.env.STABILITY_API_KEY}` },
      data: { text_prompts: [{ text: prompt }], cfg_scale: 7, height: 1024, width: 1024, steps: 30, samples: 1 }
    });
    const base64 = res.data.artifacts[0].base64;
    await sock.sendMessage(chatId, { image: Buffer.from(base64, 'base64'), caption: `🎨 ${prompt}` });
  }
};
