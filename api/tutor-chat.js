// (See <attachments> above for file contents. You may not need to search or read the file again.)
// Conversational AI learning assistant endpoint
import OpenAI from "openai";
import { getFirestore } from 'firebase-admin/firestore';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { messages, studentProfile, context } = req.body;
  if (!messages || !Array.isArray(messages) || !studentProfile) {
    res.status(400).json({ error: 'Missing required fields: messages (array), studentProfile.' });
    return;
  }
  const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
  chatHistory.unshift({ role: 'system', content: `You are a friendly, expert AI tutor for a digital homeschool platform. Student profile: ${JSON.stringify(studentProfile)}. Context: ${context || ''}` });
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: chatHistory,
      temperature: 0.7,
      max_tokens: 800
    });
    res.status(200).json({ reply: completion.choices[0].message.content.trim() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate tutor response.' });
  }
}
