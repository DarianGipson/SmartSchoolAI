// (See <attachments> above for file contents. You may not need to search or read the file again.)
// API to update student mastery and engagement after a lesson
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

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
  const { student_id, mastery_updates, engagement_updates } = req.body;
  if (!student_id) {
    res.status(400).json({ error: 'Missing student_id' });
    return;
  }
  const profileRef = db.collection('students').doc(student_id);
  const profileSnap = await profileRef.get();
  if (!profileSnap.exists) {
    res.status(404).json({ error: 'Student profile not found' });
    return;
  }
  const profile = profileSnap.data();
  // Update mastery map and track mastery history for velocity calculation
  if (mastery_updates) {
    profile.mastery_map = { ...profile.mastery_map, ...mastery_updates };
    // --- Advanced: Track mastery history and calculate learning velocity ---
    if (!profile.mastery_history) profile.mastery_history = {};
    if (!profile.performanceTrends) profile.performanceTrends = {};
    for (const topic in mastery_updates) {
      const score = mastery_updates[topic];
      if (!profile.mastery_history[topic]) profile.mastery_history[topic] = [];
      profile.mastery_history[topic].push({ score, timestamp: Date.now() });
      // Keep only the last 5 scores for velocity calculation
      if (profile.mastery_history[topic].length > 5) {
        profile.mastery_history[topic] = profile.mastery_history[topic].slice(-5);
      }
      // Calculate learning velocity (slope)
      const history = profile.mastery_history[topic];
      if (history.length > 1) {
        // Simple linear regression slope: (y2-y1)/(x2-x1) over last N points
        const n = history.length;
        const x1 = history[0].timestamp;
        const x2 = history[n-1].timestamp;
        const y1 = history[0].score;
        const y2 = history[n-1].score;
        const slope = (y2 - y1) / (((x2 - x1) / (1000 * 60 * 60 * 24)) || 1); // per day
        profile.performanceTrends[topic] = slope;
      } else {
        profile.performanceTrends[topic] = 0;
      }
    }
  }
  // Update engagement/learning style if provided
  if (engagement_updates) {
    profile.engagement = { ...(profile.engagement || {}), ...engagement_updates };
    // Optionally update learning style if engagement suggests a new preference
    if (engagement_updates.preferred_style) {
      profile.learning_style = engagement_updates.preferred_style;
    }
  }
  await profileRef.set(profile);
  res.status(200).json({ message: 'Profile updated', profile });
}
