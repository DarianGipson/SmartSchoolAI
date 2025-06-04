// api/generate-lesson.js
// Backend API endpoint for AI lesson generation (Node.js/Express style)

import { generateLessonPrompt } from '../src/lib/aiLessonEngine.js';
// import your OpenAI client here (e.g., openai from openai npm package)
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { grade, subject, topic, style, mastery, pace, strengths, weaknesses, studentProfile } = req.body;
    // Use advanced fields from studentProfile if available
    const prompt = generateLessonPrompt({
      grade,
      subject,
      topic,
      style: style || studentProfile?.learningStyleVector,
      mastery: mastery || (studentProfile?.masteryMatrix && studentProfile?.masteryMatrix[topic]?.score) || 50,
      pace: pace || null,
      strengths: strengths || [],
      weaknesses: weaknesses || [],
      contentPreferences: studentProfile?.contentPreferences || {},
      engagementData: studentProfile?.engagementData || [],
      learningStyleVector: studentProfile?.learningStyleVector || null,
      performanceTrends: studentProfile?.performanceTrends || {},
      streaks: studentProfile?.streaks || {},
      age: studentProfile?.age || null
    });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7,
    });
    const content = completion.choices[0].message.content;
    let lesson;
    try {
      lesson = JSON.parse(content);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse lesson JSON from AI', raw: content });
    }
    res.status(200).json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
