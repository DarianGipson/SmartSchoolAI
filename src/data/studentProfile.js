// Unified StudentProfile model for advanced personalization
// This can be imported in your backend APIs (Node.js/ES6)

class StudentProfile {
  constructor({ id, name, age, grade }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.grade = grade;
    this.learningStyleVector = null; // e.g., [0.2, 0.5, 0.3, 0.0] for VARK
    this.cognitiveModel = null; // e.g., embedding vector
    this.masteryMatrix = {}; // { topic: { score, attempts, lastUpdated } }
    this.engagementData = []; // [{ mood, sessionDuration, clickRate, timestamp }]
    this.performanceTrends = {}; // { topic: slope }
    this.contentPreferences = {}; // { video: 0.8, text: 0.2, ... }
    this.streaks = { daysActive: 0, goalsAchieved: 0 };
    this.embeddedVector = null; // fused profile vector
    this.historyLog = []; // [{ subject, topic, response, timestamp }]
  }
}

module.exports = StudentProfile;
