// (See <attachments> above for file contents. You may not need to search or read the file again.)
// API for onboarding a new student and generating a personalized profile
import OpenAI from "openai";
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

if (!global._firebaseAdminInitialized) {
  initializeApp({ credential: applicationDefault() });
  global._firebaseAdminInitialized = true;
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { name, age, parentEmail } = req.body;
  if (!name || !age) {
    res.status(400).json({ error: 'Missing required fields: name and age.' });
    return;
  }
  // Generate a unique student ID
  const student_id = Math.random().toString(36).substring(2, 15);
  // Use GPT to generate diagnostic questions and analyze answers (simulate for now)
  const prompt = `You are an expert digital teacher. A new student named ${name}, age ${age}, is joining.\nGenerate a JSON profile with:\n- grade_estimate for math, reading, science\n- learning_style (visual, audio, text, game-based, etc.)\n- pace (slow, moderate, fast)\n- mastery_map for key topics (0-100)\nReturn only the JSON.`;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a world-class AI teacher for a digital homeschool platform.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 400
    });
    let profile;
    try {
      profile = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
      res.status(500).json({ error: 'AI did not return valid JSON.' });
      return;
    }
    profile.student_id = student_id;
    profile.name = name;
    profile.age = age;
    profile.parentEmail = parentEmail || '';
    // Save profile to Firestore
    await db.collection('students').doc(student_id).set(profile);
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate student profile.' });
  }
}
