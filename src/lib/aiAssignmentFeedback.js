// (See <attachments> above for file contents. You may not need to search or read the file again.)
// Utility to compute feedback object for updateStudentProfile
export function buildLessonFeedback({ assignment, responses, aiFeedback, startTime, endTime }) {
  // Calculate accuracy (simple: percent correct if available)
  let correctCount = 0;
  let total = 0;
  if (aiFeedback && assignment && assignment.questions) {
    assignment.questions.forEach(q => {
      total++;
      if (aiFeedback.feedback && aiFeedback.feedback[q.id] && aiFeedback.feedback[q.id].toLowerCase().includes('correct')) {
        correctCount++;
      }
    });
  }
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : null;
  // Time spent
  const timeSpent = startTime && endTime ? Math.round((endTime - startTime) / 1000) : null;
  // Example: count retries (not tracked here, but could be added)
  // Example: count hint usage (not tracked here, but could be added)
  return {
    accuracy,
    timeSpent,
    // Add more fields as needed (retries, hintUsage, frustration, etc.)
  };
}
