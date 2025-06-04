// (See <attachments> above for file contents. You may not need to search or read the file again.)
// Parent/Admin dashboard analytics API
import fs from 'fs';
import path from 'path';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

if (!global._firebaseAdminInitialized) {
  initializeApp({ credential: applicationDefault() });
  global._firebaseAdminInitialized = true;
}
const db = getFirestore();

const DATA_DIR = path.join(process.cwd(), 'data');

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) {
    res.status(400).json({ error: 'Missing userId' });
    return;
  }
  const profileRef = db.collection('students').doc(userId);
  const profileSnap = await profileRef.get();
  let progress = {};
  if (profileSnap.exists) {
    progress = profileSnap.data();
  }
  // --- Enhanced analytics: mastery velocity, remediation/enrichment, interventions ---
  const masteryMatrix = progress.masteryMatrix || progress.mastery_map || {};
  const performanceTrends = progress.performanceTrends || {};
  const interventionSummary = [];
  for (const topic in masteryMatrix) {
    const mastery = masteryMatrix[topic]?.score ?? masteryMatrix[topic];
    const velocity = performanceTrends[topic] ?? 0;
    let intervention = 'regular';
    if (mastery < 70 || velocity < 0) {
      intervention = 'remediation';
    } else if (mastery > 90 && velocity > 1) {
      intervention = 'enrichment';
    }
    interventionSummary.push({ topic, mastery, velocity, intervention });
  }
  const analytics = {
    strengths: progress.strengths || [],
    gaps: progress.gaps || [],
    learningStyle: progress.learning_style || progress.learningStyleVector || 'unknown',
    lastUpdated: progress.lastUpdated || null,
    interventions: interventionSummary.filter(i => i.intervention !== 'regular'),
    masteryVelocity: interventionSummary.map(i => ({ topic: i.topic, velocity: i.velocity })),
    interventionSummary,
    raw: progress
  };
  res.status(200).json(analytics);
}
