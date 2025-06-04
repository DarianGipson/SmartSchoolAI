// scripts/generate-curriculum-map.cjs
// Script to generate a curriculum map JSON from the content/ directory structure (CommonJS version)
const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.resolve(__dirname, '../content');
const OUTPUT_FILE = path.resolve(__dirname, '../src/data/curriculumMap.json');

function getDirectories(srcPath) {
  return fs.readdirSync(srcPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

function generateCurriculumMap() {
  const grades = getDirectories(CONTENT_DIR);
  const curriculum = [];

  for (const gradeDir of grades) {
    const gradePath = path.join(CONTENT_DIR, gradeDir);
    const subjects = getDirectories(gradePath);
    const subjectMap = {};
    for (const subject of subjects) {
      const subjectPath = path.join(gradePath, subject);
      // List topics (files or subfolders)
      const topics = fs.readdirSync(subjectPath)
        .filter(f => !f.startsWith('.'))
        .map(f => f.replace(/\.[^/.]+$/, ''));
      subjectMap[subject] = topics;
    }
    curriculum.push({
      grade: gradeDir.replace('grade-', ''),
      subjects: subjectMap
    });
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(curriculum, null, 2));
  console.log('Curriculum map generated at', OUTPUT_FILE);
}

generateCurriculumMap();
