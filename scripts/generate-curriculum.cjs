// scripts/generate-curriculum.js
const fs = require('fs');
const path = require('path');

const grades = [
  'PreK', 'Kindergarten', ...Array.from({length: 12}, (_, i) => `Grade ${i+1}`)
];
const subjects = {
  'PreK': ['Phonics', 'Reading', 'Math', 'Science', 'Emotions', 'Shapes', 'Colors', 'Bible Stories', 'Art', 'Music', 'Fun Time'],
  'Kindergarten': ['Phonics', 'Reading', 'Math', 'Science', 'Social Studies', 'Bible Stories', 'Art', 'Music', 'Fun Time'],
  'Grade 1': ['Reading', 'Writing', 'Math', 'Science', 'Social Studies', 'Art', 'Music'],
  'Grade 2': ['Reading', 'Writing', 'Math', 'Science', 'Social Studies', 'Art', 'Music'],
  'Grade 3': ['Reading', 'Writing', 'Math', 'Science', 'Social Studies', 'Coding', 'Art', 'Music'],
  'Grade 4': ['Reading', 'Writing', 'Math', 'Science', 'Social Studies', 'Coding', 'Art', 'Music'],
  'Grade 5': ['Reading', 'Writing', 'Math', 'Science', 'Social Studies', 'Coding', 'Art', 'Music'],
  'Grade 6': ['ELA', 'Math', 'Science', 'World History', 'Civics', 'Programming', 'Art', 'Music'],
  'Grade 7': ['ELA', 'Math', 'Science', 'World History', 'Civics', 'Programming', 'Art', 'Music'],
  'Grade 8': ['ELA', 'Math', 'Science', 'World History', 'Civics', 'Programming', 'Art', 'Music'],
  'Grade 9': ['English I', 'Algebra I', 'Biology', 'World History', 'Government', 'Computer Science', 'Health', 'Art', 'Music'],
  'Grade 10': ['English II', 'Geometry', 'Chemistry', 'US History', 'Economics', 'Computer Science', 'Health', 'Art', 'Music'],
  'Grade 11': ['English III', 'Algebra II', 'Physics', 'US Government', 'Economics', 'Computer Science', 'Health', 'Art', 'Music'],
  'Grade 12': ['English IV', 'Calculus', 'Biology', 'Chemistry', 'US Government', 'Economics', 'Computer Science', 'Health', 'Digital Literacy']
};

function getStandard(subject, grade, i) {
  // Return a standards code string based on subject/grade/lesson
  return `STANDARD-${subject}-${grade}-${i}`;
}

function getLessonJSON(grade, subject, i) {
  return {
    title: `Lesson ${i}: ${subject} (${grade})`,
    subject,
    grade,
    standard: getStandard(subject, grade, i),
    estimated_duration: "30 minutes",
    difficulty: Math.ceil(i/10),
    visuals_required: true,
    audio_required: true,
    tts_ready: true,
    content_blocks: [
      {
        type: "introduction",
        tts: `Welcome to ${subject} for ${grade}! Today’s lesson is about...`,
        engagement: "Say it with me! High five!"
      },
      {
        type: "core_content",
        tts: "Here is the main explanation, with examples and visuals.",
        visual_description: "A colorful diagram or animation."
      },
      {
        type: "practice",
        tts: "Try this activity: ...",
        worksheet: `${subject.toLowerCase()}-worksheet-${i}.pdf`
      }
    ],
    quiz: [
      {
        question: "What did you learn today?",
        type: "short_answer",
        answer: "Sample answer",
        feedback: "Great thinking!"
      }
    ],
    answer_key: { "1": "Sample answer" },
    metadata: {
      subject,
      grade,
      standard: getStandard(subject, grade, i),
      estimated_duration: "30 minutes",
      difficulty: Math.ceil(i/10),
      visuals_required: true,
      audio_required: true
    }
  };
}

grades.forEach(grade => {
  (subjects[grade] || []).forEach(subject => {
    for (let i = 1; i <= 40; i++) {
      const lesson = getLessonJSON(grade, subject, i);
      const dir = path.join(__dirname, `../content/grade-${grade}/${subject}`);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `lesson-${i}.json`), JSON.stringify(lesson, null, 2));
    }
  });
});
