// (See <attachments> above for file contents. You may not need to search or read the file again.)
// API endpoint to update student profile with lesson feedback and behavioral data
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import StudentProfile from '../src/data/studentProfile.js';

if (!global._firebaseAdminInitialized) {
  initializeApp({ credential: applicationDefault() });
  global._firebaseAdminInitialized = true;
}
const db = getFirestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { student_id, subject, feedback } = req.body;
  // feedback: { completion, retries, accuracy, timeSpent, hintUsage, frustration, attention, ... }
  if (!student_id || !subject || !feedback) {
    res.status(400).json({ error: 'Missing required fields: student_id, subject, feedback.' });
    return;
  }
  try {
    const profileRef = db.collection('students').doc(student_id);
    const profileSnap = await profileRef.get();
    let profile;
    if (!profileSnap.exists) {
      // Create a new profile if not found
      profile = new StudentProfile({ id: student_id, name: '', age: 0, grade: '' });
    } else {
      profile = profileSnap.data();
    }
    // --- Update masteryMatrix ---
    if (!profile.masteryMatrix) profile.masteryMatrix = {};
    if (!profile.masteryMatrix[subject]) profile.masteryMatrix[subject] = { score: 50, attempts: 0 };
    if (typeof feedback.accuracy === 'number') {
      const prev = profile.masteryMatrix[subject].score || 50;
      profile.masteryMatrix[subject].score = Math.round((prev * 4 + feedback.accuracy) / 5);
      profile.masteryMatrix[subject].attempts = (profile.masteryMatrix[subject].attempts || 0) + 1;
      profile.masteryMatrix[subject].lastUpdated = new Date().toISOString();
    }
    // --- Update engagementData ---
    if (!profile.engagementData) profile.engagementData = [];
    profile.engagementData.push({
      mood: feedback.mood || null,
      sessionDuration: feedback.timeSpent || null,
      clickRate: feedback.clickRate || null,
      timestamp: new Date().toISOString()
    });
    // --- Update contentPreferences ---
    if (!profile.contentPreferences) profile.contentPreferences = {};
    if (feedback.preferred_format) {
      profile.contentPreferences[feedback.preferred_format] = (profile.contentPreferences[feedback.preferred_format] || 0) + 1;
    }
    // --- Update learningStyleVector ---
    if (feedback.style_pref) {
      profile.learningStyleVector = feedback.style_pref;
    }
    // --- Update performanceTrends (placeholder for now) ---
    if (!profile.performanceTrends) profile.performanceTrends = {};
    // --- Update streaks (placeholder for now) ---
    if (!profile.streaks) profile.streaks = { daysActive: 0, goalsAchieved: 0 };
    // --- Update historyLog ---
    if (!profile.historyLog) profile.historyLog = [];
    profile.historyLog.push({ subject, feedback, timestamp: new Date().toISOString() });
    // Save updated profile
    await profileRef.set(profile);
    res.status(200).json({ success: true, updatedProfile: profile });
  } catch (e) {
    console.error('Failed to update student profile:', e);
    res.status(500).json({ error: 'Failed to update student profile.' });
  }
}
