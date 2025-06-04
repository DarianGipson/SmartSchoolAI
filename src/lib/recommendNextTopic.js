// recommendNextTopic.js
// Simple recommendation engine for next topic selection
// Can be extended with RL or ML models

/**
 * Recommend the next topic for a student based on mastery, performance trends, and engagement.
 * @param {Object} studentProfile - The advanced student profile object
 * @param {Object} curriculumMap - { subject: [topics] }
 * @returns {Object} { subject, topic }
 */
export function recommendNextTopic(studentProfile, curriculumMap) {
  // Find all topics with low mastery or negative/flat learning velocity
  let candidates = [];
  for (const subject in curriculumMap) {
    for (const topic of curriculumMap[subject]) {
      const mastery = studentProfile.masteryMatrix?.[topic]?.score ?? 50;
      const velocity = studentProfile.performanceTrends?.[topic] ?? 0;
      // Prioritize topics with low mastery or negative/flat velocity
      if (mastery < 80 || velocity <= 0) {
        candidates.push({ subject, topic, mastery, velocity });
      }
    }
  }
  // Sort: lowest mastery, then lowest velocity
  candidates.sort((a, b) => a.mastery - b.mastery || a.velocity - b.velocity);
  // Optionally, deprioritize topics if recent engagement is low (to avoid burnout)
  // ...
  // Return the best candidate, or fallback to any topic
  if (candidates.length > 0) {
    return { subject: candidates[0].subject, topic: candidates[0].topic };
  }
  // Fallback: pick any topic
  for (const subject in curriculumMap) {
    if (curriculumMap[subject].length > 0) {
      return { subject, topic: curriculumMap[subject][0] };
    }
  }
  return null;
}
