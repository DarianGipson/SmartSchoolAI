// (See <attachments> above for file contents. You may not need to search or read the file again.)
// Secure backend API for AI tutor explainer mode using OpenAI
import OpenAI from "openai";
import { getFirestore } from 'firebase-admin/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { concept, studentProfile, styles } = req.body;
  if (!concept || !studentProfile || !styles || !Array.isArray(styles) || styles.length === 0) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).json({ error: 'Missing required fields: concept, studentProfile, and styles (array) are required.' });
    return;
  }
  const explanations = {};
  for (const style of styles) {
    const prompt = `You are an expert AI tutor for a digital homeschool platform.\nStudent profile: ${JSON.stringify(studentProfile)}\nConcept: ${concept}\n\nExplain this concept in the following style: ${style}.\nMake the explanation accessible, engaging, and tailored to the student's learning style and grade level.`;
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a world-class AI teacher for a digital homeschool platform.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 600
      });
      explanations[style] = completion.choices[0].message.content.trim();
    } catch (error) {
      explanations[style] = `Error generating explanation: ${error.message}`;
    }
  }
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ explainers: explanations });
}
