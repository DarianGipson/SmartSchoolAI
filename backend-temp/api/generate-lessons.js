import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { recommendNextTopic } from '../../src/lib/recommendNextTopic.js';
import fs from 'fs';
import path from 'path';

// Load curriculum map
const curriculumMapPath = path.resolve(process.cwd(), 'src/data/curriculumMap.json');
const curriculumMap = JSON.parse(fs.readFileSync(curriculumMapPath, 'utf-8'));

// Load service account from environment variable
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

if (!global._firebaseAdminInitialized) {
  initializeApp({ credential: cert(serviceAccount) });
  global._firebaseAdminInitialized = true;
}
const db = getFirestore();

// SECURITY: Require a secret token in the request header
const ADMIN_SECRET = process.env.ADMIN_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  // Check for admin secret
  if (!ADMIN_SECRET || req.headers['x-admin-secret'] !== ADMIN_SECRET) {
    res.status(401).json({ error: 'Unauthorized: missing or invalid admin secret.' });
    return;
  }
  try {
    const studentsSnap = await db.collection('students').get();
    const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    let results = [];
    for (const student of students) {
      const rec = recommendNextTopic(student, curriculumMap);
      if (!rec) continue;
      const lessonData = {
        grade: student.grade,
        subject: rec.subject,
        topic: rec.topic
      };
      // Simulate lesson generation (replace with your actual API call if needed)
      const lesson = {
        ...lessonData,
        generatedAt: new Date().toISOString(),
        studentId: student.id
      };
      await db.collection('students').doc(student.id).collection('lessons').doc(`${rec.subject}-${rec.topic}`).set(lesson);
      results.push({ student: student.id, lesson: `${rec.subject}-${rec.topic}` });
    }
    res.status(200).json({ message: 'Batch lesson generation complete!', results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
