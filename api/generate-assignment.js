// (See <attachments> above for file contents. You may not need to search or read the file again.)
// Secure backend API for generating assignments using OpenAI
import OpenAI from "openai";
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

// Initialize Firebase Admin SDK if not already initialized
if (!global._firebaseAdminInitialized) {
  initializeApp({ credential: applicationDefault() });
  global._firebaseAdminInitialized = true;
}
const db = getFirestore();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { userId, lessonId, lessonData, responses, studentProfile } = req.body;
  // Load student profile from Firestore if available
  let profile = studentProfile || {};
  if ((!profile || Object.keys(profile).length === 0) && userId) {
    try {
      const profileDoc = await db.collection('students').doc(userId).get();
      if (profileDoc.exists) {
        profile = profileDoc.data();
      }
    } catch (e) {
      console.error('Could not load student profile from Firestore:', e);
    }
  }
  if (!lessonData || !profile || Object.keys(profile).length === 0) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).json({ error: 'Missing required fields: lessonData and studentProfile/profile are required.' });
    return;
  }

  // --- Adaptation Reasoning (for traceability/debug) ---
  const adaptationLog = [];
  adaptationLog.push(`Profile: ${JSON.stringify(profile)}`);
  adaptationLog.push(`LessonData: ${JSON.stringify(lessonData)}`);
  adaptationLog.push(`Adapting lesson for learning style: ${profile.learning_style || 'unknown'}`);
  adaptationLog.push(`Mastery scores: ${JSON.stringify(profile.subjects?.[lessonData.subject]?.mastery_score || 'N/A')}`);
  adaptationLog.push(`Preferred format: ${profile.preferred_format || 'N/A'}`);
  adaptationLog.push(`Attention span: ${profile.attention_span || 'N/A'}`);
  adaptationLog.push(`Pace: ${profile.overall_pace || 'N/A'}`);

  // AI assignment generation only, no PDFs, always tailored to grade and student needs
  const prompt = `You are an expert AI teacher for a digital homeschool platform.\nStudent profile: ${JSON.stringify(profile)}\nLesson: ${lessonData.title} (Grade: ${lessonData.grade}, Subject: ${lessonData.subject})\nObjective: ${lessonData.objective}\n\nGenerate a fully digital, interactive assignment. Do NOT reference or use any PDFs or static worksheets. All content must be AI-generated, original, and tailored to this student's grade and learning needs.\n\nRequirements:\n- 3-5 questions (mix of multiple-choice, short answer, creative, and at least one interactive type: drag-and-drop, code sandbox, or embedded pop-up)\n- For each question, provide: type, prompt, answer, feedback, hints, and interactivity metadata (if applicable)\n- For each concept, provide at least two different explanation styles (e.g., visual, analogy, step-by-step, story) in an 'explainers' field\n- Adapt difficulty and content to student strengths, weaknesses, and learning style\n- Include 'learningStyleAdaptation' field describing how the assignment adapts to the student's style and progress\n- Provide 'enrichment' (challenge) and 'remediation' (support) fields\n- All content must be accessible and engaging for the student's grade level\n- Do NOT reference or use any PDFs, static worksheets, or non-AI-generated content\n\nReturn a JSON object with:\n{\n  questions: [\n    {\n      id,\n      type,\n      prompt,\n      answer,\n      feedback,\n      hints,\n      interactivity,\n      explainers: { style1: ..., style2: ... },\n      rationale\n    }\n  ],\n  enrichment: string,\n  remediation: string,\n  learningStyleAdaptation: string\n}`;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a world-class AI teacher for a digital homeschool platform.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1200
    });
    let assignment;
    try {
      assignment = JSON.parse(completion.choices[0].message.content);
      // Tag lesson with subject, grade, prerequisites, style, and difficulty
      assignment.subject = lessonData.subject;
      assignment.grade = lessonData.grade;
      assignment.prerequisites = lessonData.prerequisites || [];
      assignment.style = profile.learning_style || '';
      assignment.difficulty = lessonData.difficulty || 'adaptive';
      assignment.student_id = profile.student_id;
      assignment.lesson_id = lessonId || `${profile.student_id}-${Date.now()}`;
      // Save lesson to Firestore
      try {
        await db.collection('students').doc(profile.student_id).collection('lessons').doc(lessonId || `${profile.student_id}-${Date.now()}`).set(assignment);
      } catch (e) {
        console.error('Could not save lesson to Firestore:', e);
      }
      // Validate and fill missing fields for robustness
      if (!assignment.questions) assignment.questions = [];
      assignment.questions = assignment.questions.map(q => ({
        id: q.id || '',
        type: q.type || '',
        prompt: q.prompt || '',
        answer: q.answer || '',
        feedback: q.feedback || '',
        hints: q.hints || {},
        interactivity: q.interactivity || {},
        explainers: q.explainers || {},
        rationale: q.rationale || ''
      }));
      assignment.enrichment = assignment.enrichment || '';
      assignment.remediation = assignment.remediation || '';
      assignment.learningStyleAdaptation = assignment.learningStyleAdaptation || '';
      // --- Add debug info for traceability ---
      assignment._debug = {
        adaptationLog,
        usedProfile: profile,
        lessonData
      };
    } catch (e) {
      console.error('OpenAI response was not valid JSON:', completion.choices[0].message.content);
      assignment = {
        questions: [],
        enrichment: '',
        remediation: '',
        learningStyleAdaptation: '',
        error: 'OpenAI response was not valid JSON.'
      };
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(assignment);
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: 'Failed to generate assignment. Please try again later.' });
  }
}
