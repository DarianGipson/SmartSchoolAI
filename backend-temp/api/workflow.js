// (See <attachments> above for file contents. You may not need to search or read the file again.)
// API for workflow improvements: auto-assign lessons, adaptive practice, reflection, progress tracking
import fs from 'fs';
import path from 'path';
import { getFirestore } from 'firebase-admin/firestore';
import { recommendNextTopic } from '../../src/lib/recommendNextTopic.js';
import fsExtra from 'fs-extra';

const DATA_DIR = path.join(process.cwd(), 'data');
const db = getFirestore();

// Helper to load curriculum map for a grade
function loadCurriculumMap(grade) {
  const curriculumPath = path.join(process.cwd(), 'src', 'data', 'curriculumMap.json');
  const curriculumData = JSON.parse(fsExtra.readFileSync(curriculumPath, 'utf-8'));
  const gradeEntry = curriculumData.find(g => g.grade === grade);
  if (!gradeEntry) return {};
  return gradeEntry.subjects;
}

export default async function handler(req, res) {
  const { userId, action, data } = req.body;
  if (!userId || !action) {
    res.status(400).json({ error: 'Missing userId or action' });
    return;
  }
  const PROGRESS_FILE = path.join(DATA_DIR, `progress-${userId}.json`);
  let progress = {};
  if (fs.existsSync(PROGRESS_FILE)) {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  if (action === 'autoAssign') {
    // Load student profile from Firestore
    const profileSnap = await db.collection('students').doc(userId).get();
    if (!profileSnap.exists) {
      res.status(404).json({ error: 'Student profile not found' });
      return;
    }
    const studentProfile = profileSnap.data();
    // Load curriculum map for student's grade
    const curriculumMap = loadCurriculumMap(studentProfile.grade);
    // Use recommendation engine
    const rec = recommendNextTopic(studentProfile, curriculumMap);
    if (!rec) {
      res.status(200).json({ nextLesson: null, message: 'No suitable topic found.' });
      return;
    }
    // --- Smart remediation/enrichment trigger ---
    const mastery = studentProfile.masteryMatrix?.[rec.topic]?.score ?? 50;
    const velocity = studentProfile.performanceTrends?.[rec.topic] ?? 0;
    let intervention = 'regular';
    if (mastery < 70 || velocity < 0) {
      intervention = 'remediation';
    } else if (mastery > 90 && velocity > 1) {
      intervention = 'enrichment';
    }
    res.status(200).json({ nextLesson: rec, intervention });
    return;
  }
  if (action === 'adaptivePractice') {
    // Stub: Suggest practice based on recent errors
    const practice = progress.recentErrors || [];
    res.status(200).json({ practice });
    return;
  }
  if (action === 'reflection') {
    // Save student reflection
    progress.reflections = progress.reflections || [];
    progress.reflections.push({ date: new Date().toISOString(), ...data });
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
    res.status(200).json({ message: 'Reflection saved.' });
    return;
  }
  if (action === 'progressTracking') {
    // Return progress summary
    res.status(200).json({ summary: progress });
    return;
  }
  res.status(400).json({ error: 'Unknown action' });
}
