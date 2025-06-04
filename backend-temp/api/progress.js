// (See <attachments> above for file contents. You may not need to search or read the file again.)
// API for storing and retrieving student progress and learning profile
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, applicationDefault } from 'firebase-admin/app';

if (!global._firebaseAdminInitialized) {
  initializeApp({ credential: applicationDefault() });
  global._firebaseAdminInitialized = true;
}
const db = getFirestore();

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).json({ error: 'Missing userId' });
    return;
  }
  if (req.method === 'GET') {
    // Retrieve student progress from Firestore
    const progressRef = doc(db, 'students', userId, 'progress', 'current');
    const progressSnap = await getDoc(progressRef);
    if (!progressSnap.exists) {
      res.status(200).json({ progress: {}, message: 'No progress found.' });
      return;
    }
    res.status(200).json(progressSnap.data());
    return;
  }
  if (req.method === 'POST') {
    // Update student progress in Firestore
    const { progress } = req.body;
    if (!progress) {
      res.status(400).json({ error: 'Missing progress data.' });
      return;
    }
    const progressRef = doc(db, 'students', userId, 'progress', 'current');
    await setDoc(progressRef, progress);
    res.status(200).json({ message: 'Progress updated.' });
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  res.status(405).json({ error: 'Method not allowed' });
}
