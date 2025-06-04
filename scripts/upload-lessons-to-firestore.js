const { collection, doc, setDoc } = require('firebase/firestore');
const { db } = require('./firebase.cjs'); // Use CommonJS firebase config
const fs = require('fs');

// This script uploads all lesson JSONs from /content to Firestore
async function uploadLessons() {
  const grades = fs.readdirSync('./content');
  for (const grade of grades) {
    const subjects = fs.readdirSync(`./content/${grade}`);
    for (const subject of subjects) {
      const lessons = fs.readdirSync(`./content/${grade}/${subject}`);
      for (const lessonFile of lessons) {
        const lessonData = JSON.parse(fs.readFileSync(`./content/${grade}/${subject}/${lessonFile}`));
        const lessonId = `${grade}_${subject}_${lessonFile.replace('.json','')}`;
        await setDoc(doc(collection(db, 'lessons'), lessonId), {
          ...lessonData,
          grade,
          subject,
          lessonId
        });
        console.log('Uploaded', lessonId);
      }
    }
  }
}

uploadLessons();
