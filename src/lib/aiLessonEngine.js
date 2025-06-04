// aiLessonEngine.js
import API_BASE from './apiBase';

/**
 * Generates the AI prompt for lesson creation based on student profile and lesson context.
 */
export function generateLessonPrompt({ grade, subject, topic, style, mastery, pace, strengths = [], weaknesses = [], contentPreferences = {}, engagementData = [], learningStyleVector = null, performanceTrends = {}, streaks = {}, age = null }) {
  // Build a richer, more personalized prompt
  const preferredFormats = Object.keys(contentPreferences).length
    ? Object.entries(contentPreferences).sort((a, b) => b[1] - a[1]).map(([k]) => k).join(', ')
    : 'N/A';
  const recentMood = engagementData.length ? engagementData[engagementData.length - 1].mood : 'N/A';
  const learningVelocity = performanceTrends[topic] || 'N/A';
  return `
You are a private AI tutor for a ${grade}-grade student (age: ${age || 'N/A'}).
Create a highly engaging ${subject} lesson on '${topic}'.
Tailor the lesson using these conditions:
- Learning style vector: ${learningStyleVector || style}
- Preferred content formats: ${preferredFormats}
- Current mastery: ${mastery}%
- Student age: ${age || 'N/A'}
- Recent mood: ${recentMood}
- Learning velocity (slope): ${learningVelocity}
- Streaks: ${JSON.stringify(streaks)}
- Strengths: ${strengths.length ? strengths.join(', ') : 'N/A'}
- Weaknesses: ${weaknesses.length ? weaknesses.join(', ') : 'N/A'}

Include: visual aids, narration, interactive quizzes, and real-life application. Output should include instruction, comprehension check, and reinforcement exercises. Respond in structured JSON for UI rendering.
`;
}

/**
 * Calls the backend API to generate a lesson for the given student and topic.
 * @param {Object} params
 * @param {string} params.grade
 * @param {string} params.subject
 * @param {string} params.topic
 * @param {Object} params.studentProfile
 * @returns {Promise<Object>} Lesson JSON
 */
export async function generateLesson({ grade, subject, topic, studentProfile }) {
  const strengths = studentProfile.subjects?.[subject]?.strengths || [];
  const weaknesses = studentProfile.subjects?.[subject]?.recentErrors || [];
  const payload = {
    grade,
    subject,
    topic,
    style: studentProfile.preferredStyle,
    mastery: studentProfile.subjects[subject]?.mastery ?? 50,
    pace: studentProfile.pace,
    strengths,
    weaknesses,
    studentProfile,
  };

  // Call backend API endpoint
  const response = await fetch(`${API_BASE}/api/generate-lesson`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to generate lesson from backend API');
  return await response.json();
}

/**
 * Updates a student's profile after a lesson, adjusting mastery, strengths, and weaknesses.
 * @param {Object} profile - The student profile object.
 * @param {Object} lessonResult - { lessonId, subject, score, timeSpent, usedHints, retryCount, errors }
 * @returns {Object} Updated profile
 */
export function updateStudentProfile(profile, lessonResult) {
  const { subject, score, usedHints, errors = [] } = lessonResult;
  // Update mastery (simple average, can be replaced with more advanced logic)
  if (!profile.subjects[subject]) profile.subjects[subject] = { mastery: 0, recentErrors: [], strengths: [] };
  profile.subjects[subject].mastery = Math.round((profile.subjects[subject].mastery + score) / 2);
  // Update recent errors (weaknesses)
  profile.subjects[subject].recentErrors = errors;
  // Update strengths if high score and no hints used
  if (score >= 85 && !usedHints) {
    profile.subjects[subject].strengths = [...new Set([...(profile.subjects[subject].strengths || []), lessonResult.topic || lessonResult.lessonId])];
  }
  // Add to history
  profile.history = profile.history || [];
  profile.history.push(lessonResult);
  return profile;
}

/**
 * Suggests next topics for the student based on mastery, strengths, and weaknesses.
 * @param {Object} curriculumMap - The curriculum map JSON (array of grades/subjects/topics)
 * @param {Object} profile - The student profile object
 * @returns {Array} List of recommended next topics (with grade, subject, topic, and reason)
 */
export function recommendNextTopics(curriculumMap, profile) {
  const grade = profile.grade;
  const gradeEntry = curriculumMap.find(g => g.grade === grade || g.grade === `Grade ${grade}`);
  if (!gradeEntry) return [];
  const recommendations = [];
  for (const [subject, topics] of Object.entries(gradeEntry.subjects)) {
    const subjProfile = profile.subjects[subject] || {};
    // Prioritize weaknesses (recentErrors)
    if (subjProfile.recentErrors && subjProfile.recentErrors.length) {
      subjProfile.recentErrors.forEach(topic => {
        if (topics.includes(topic)) {
          recommendations.push({ grade, subject, topic, reason: 'Needs improvement (recent errors)' });
        }
      });
    }
    // Then topics not yet attempted
    const attempted = new Set((profile.history || []).filter(h => h.subject === subject).map(h => h.lessonId));
    topics.forEach(topic => {
      if (!attempted.has(topic)) {
        recommendations.push({ grade, subject, topic, reason: 'Not yet attempted' });
      }
    });
    // Then reinforce strengths
    if (subjProfile.strengths && subjProfile.strengths.length) {
      subjProfile.strengths.forEach(topic => {
        if (topics.includes(topic)) {
          recommendations.push({ grade, subject, topic, reason: 'Reinforce strength' });
        }
      });
    }
  }
  return recommendations;
}

/**
 * Returns a summary of student progress for admin/teacher dashboards.
 * @param {Object} profile - The student profile object
 * @returns {Object} Progress summary (per subject, overall, strengths, weaknesses, time spent, etc.)
 */
export function getProgressSummary(profile) {
  const summary = {
    overallMastery: 0,
    subjects: {},
    strengths: [],
    weaknesses: [],
    totalTimeSpent: 0,
    lessonsCompleted: 0,
    retries: 0,
  };
  let subjectCount = 0;
  for (const [subject, subj] of Object.entries(profile.subjects)) {
    summary.subjects[subject] = {
      mastery: subj.mastery || 0,
      strengths: subj.strengths || [],
      weaknesses: subj.recentErrors || [],
    };
    summary.strengths.push(...(subj.strengths || []));
    summary.weaknesses.push(...(subj.recentErrors || []));
    summary.overallMastery += subj.mastery || 0;
    subjectCount++;
  }
  summary.overallMastery = subjectCount ? Math.round(summary.overallMastery / subjectCount) : 0;
  (profile.history || []).forEach(h => {
    summary.lessonsCompleted++;
    summary.retries += h.retries || 0;
    // Parse timeSpent as minutes if possible
    if (typeof h.timeSpent === 'string' && h.timeSpent.endsWith('m')) {
      summary.totalTimeSpent += parseInt(h.timeSpent);
    } else if (typeof h.timeSpent === 'number') {
      summary.totalTimeSpent += h.timeSpent;
    }
  });
  return summary;
}

/**
 * Returns a mastery map for visual analytics (subject -> topic -> mastery %).
 * @param {Object} profile - The student profile object
 * @param {Object} curriculumMap - The curriculum map JSON
 * @returns {Object} masteryMap
 */
export function getMasteryMap(profile, curriculumMap) {
  const grade = profile.grade;
  const gradeEntry = curriculumMap.find(g => g.grade === grade || g.grade === `Grade ${grade}`);
  if (!gradeEntry) return {};
  const masteryMap = {};
  for (const [subject, topics] of Object.entries(gradeEntry.subjects)) {
    masteryMap[subject] = {};
    topics.forEach(topic => {
      // Find lesson history for this topic
      const lesson = (profile.history || []).find(h => h.subject === subject && h.lessonId === topic);
      masteryMap[subject][topic] = lesson ? lesson.score : 0;
    });
  }
  return masteryMap;
}

/**
 * Returns a list of recommended external resources for a topic.
 * @param {string} subject
 * @param {string} topic
 * @returns {Array} List of { title, url }
 */
export function getExternalResources(subject, topic) {
  // Example static resources; in production, use an API or database
  const resources = [
    { title: 'Khan Academy', url: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(subject + ' ' + topic)}` },
    { title: 'CK-12', url: `https://www.ck12.org/search/?q=${encodeURIComponent(subject + ' ' + topic)}` },
    { title: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + ' ' + topic)}` },
  ];
  return resources;
}

/**
 * Returns a list of AI-generated motivational messages based on mood or progress.
 * @param {string} mood
 * @param {Object} profile
 * @returns {string}
 */
export function getMotivationalMessage(mood, profile) {
  if (mood === 'sad' || mood === 'frustrated') return "You're doing great! Every mistake is a step toward mastery.";
  if (profile && profile.lessonsCompleted > 0 && profile.lessonsCompleted % 5 === 0) return "Awesome job! You've completed another 5 lessons!";
  return "Keep going! Every day you learn, you grow.";
}

/**
 * Returns a list of enrichment or remediation topics for a student.
 * @param {Object} profile
 * @param {Object} curriculumMap
 * @returns {Object} { enrichment: [], remediation: [] }
 */
export function getEnrichmentRemediation(profile, curriculumMap) {
  const enrichment = [];
  const remediation = [];
  const grade = profile.grade;
  const gradeEntry = curriculumMap.find(g => g.grade === grade || g.grade === `Grade ${grade}`);
  if (!gradeEntry) return { enrichment, remediation };
  for (const [subject, topics] of Object.entries(gradeEntry.subjects)) {
    const subjProfile = profile.subjects[subject] || {};
    // Enrichment: topics with high mastery
    topics.forEach(topic => {
      const lesson = (profile.history || []).find(h => h.subject === subject && h.lessonId === topic);
      if (lesson && lesson.score >= 90) enrichment.push(`${subject}: ${topic}`);
    });
    // Remediation: recent errors or low scores
    (subjProfile.recentErrors || []).forEach(topic => {
      if (topics.includes(topic)) remediation.push(`${subject}: ${topic}`);
    });
    topics.forEach(topic => {
      const lesson = (profile.history || []).find(h => h.subject === subject && h.lessonId === topic);
      if (lesson && lesson.score < 60) remediation.push(`${subject}: ${topic}`);
    });
  }
  return { enrichment, remediation };
}

/**
 * Example of a student learning profile object.
 */
export const exampleStudentProfile = {
  id: 'student-uuid',
  grade: '5',
  preferredStyle: 'visual + example-based',
  pace: 'moderate',
  subjects: {
    Math: {
      mastery: 72,
      recentErrors: ['word problems', 'division']
    },
    ELA: {
      mastery: 85,
      recentErrors: []
    }
  },
  history: [
    {
      lessonId: 'math-fractions',
      score: 60,
      timeSpent: '9m',
      retries: 2
    }
  ]
};

/**
 * Example of a lesson JSON structure returned by the AI.
 */
export const exampleLessonJSON = {
  "intro": "Welcome! Today we'll learn about fractions in a fun and visual way.",
  "steps": [
    {
      "instruction": "A fraction represents a part of a whole. For example, 1/2 means one out of two equal parts.",
      "visual": "https://example.com/fraction-visual-1.png"
    },
    {
      "instruction": "Let's see another example: 3/4 means three out of four equal parts.",
      "visual": "https://example.com/fraction-visual-2.png"
    }
  ],
  "practice": [
    {
      "question": "What is 1/2 of 8?",
      "answer": 4,
      "hint": "Divide 8 into 2 equal parts."
    },
    {
      "question": "Which is bigger: 1/3 or 1/4?",
      "answer": "1/3",
      "hint": "The smaller the denominator, the bigger the part."
    }
  ],
  "progress": {
    "completion": 0,
    "retryCount": 0
  }
};
