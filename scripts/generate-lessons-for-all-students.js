// scripts/generate-lessons-for-all-students.js
// Batch script to generate the next AI lesson for every student in Firestore

const { getFirestore } = require('firebase-admin/firestore');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { recommendNextTopic } = require('../src/lib/recommendNextTopic.js');

// Use fs to load curriculumMap.json for compatibility
const curriculumMapPath = path.resolve(__dirname, '../src/data/curriculumMap.json');
const curriculumMap = JSON.parse(fs.readFileSync(curriculumMapPath, 'utf-8'));

if (!global._firebaseAdminInitialized) {
  initializeApp({ credential: applicationDefault() });
  global._firebaseAdminInitialized = true;
}
const db = getFirestore();

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

async function generateLessonForStudent(student) {
  // Recommend next topic for this student
  const rec = recommendNextTopic(student, curriculumMap);
  if (!rec) return null;
  // Prepare lessonData for API
  const lessonData = {
    grade: student.grade,
    subject: rec.subject,
    topic: rec.topic
  };
  // Call backend API to generate lesson
  const res = await fetch(`${API_BASE}/api/generate-lesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...lessonData, studentProfile: student })
  });
  if (!res.ok) {
    console.error(`Failed to generate lesson for ${student.name} (${student.id})`);
    return null;
  }
  const lesson = await res.json();
  // Save lesson to Firestore
  await db.collection('students').doc(student.id).collection('lessons').doc(`${rec.subject}-${rec.topic}`).set(lesson);
  return lesson;
}

async function main() {
  const studentsSnap = await db.collection('students').get();
  const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  for (const student of students) {
    console.log(`Generating lesson for ${student.name} (${student.id})...`);
    await generateLessonForStudent(student);
  }
  console.log('Done generating lessons for all students.');
}

main().catch(err => {
  console.error('Batch lesson generation failed:', err);
  process.exit(1);
});
