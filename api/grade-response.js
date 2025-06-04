// (See <attachments> above for file contents. You may not need to search or read the file again.)
// API for AI grading and feedback on student responses
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
  const { question, response, studentProfile, assignmentMeta } = req.body;
  if (!question || !response || !studentProfile) {
    res.status(400).json({ error: 'Missing required fields: question, response, studentProfile.' });
    return;
  }
  const prompt = `You are an expert AI tutor.\nStudent profile: ${JSON.stringify(studentProfile)}\nQuestion: ${JSON.stringify(question)}\nStudent response: ${response}\nAssignment context: ${JSON.stringify(assignmentMeta)}\n\nGrade the response, provide specific feedback, hints if needed, and suggest next steps. Return JSON: { correct: true/false, feedback: string, hints: [string], nextSteps: string }`;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a world-class AI teacher for a digital homeschool platform.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 500
    });
    let result;
    try {
      result = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      result = { correct: null, feedback: 'AI response was not valid JSON.', hints: [], nextSteps: '' };
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to grade response.' });
  }
}
