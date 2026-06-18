import Groq from '@groq/sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function groqChat(messages, model = 'llama-3.3-70b-versatile') {
  const completion = await groq.chat.completions.create({
    messages,
    model,
    temperature: 0.7,
    max_tokens: 1024,
  });
  return completion.choices[0]?.message?.content;
}

export default groq;
