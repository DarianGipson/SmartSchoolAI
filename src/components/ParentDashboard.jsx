import React from 'react';

/**
 * ParentDashboard component displays student progress, mastery, and recommendations.
 * @param {Object} props
 * @param {Object} props.profile - The student profile object.
 * @param {Array} props.recommendations - Array of recommended next topics.
 */
export default function ParentDashboard({ profile, recommendations }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const [expandedSubject, setExpandedSubject] = React.useState(null);

  // Calculate overall mastery average
  const subjectEntries = Object.entries(profile.subjects);
  const masteryValues = subjectEntries.map(([_, subj]) => subj.mastery || 0);
  const avgMastery = masteryValues.length ? Math.round(masteryValues.reduce((a, b) => a + b, 0) / masteryValues.length) : 0;

  // Copy dashboard summary to clipboard
  const handleCopy = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      let summary = `Student: ${profile.id} (Grade ${profile.grade})\n`;
      summary += 'Subject Mastery:\n';
      for (const [subject, subj] of Object.entries(profile.subjects)) {
        summary += `- ${subject}: Mastery ${subj.mastery || 0}%`;
        if (subj.strengths && subj.strengths.length > 0) summary += ` | Strengths: ${subj.strengths.join(', ')}`;
        if (subj.recentErrors && subj.recentErrors.length > 0) summary += ` | Needs work: ${subj.recentErrors.join(', ')}`;
        summary += '\n';
      }
      summary += 'Recent Lessons:\n';
      (profile.history || []).slice(-5).reverse().forEach(h => {
        summary += `- ${h.lessonId} | Score: ${h.score} | Time: ${h.timeSpent} | Retries: ${h.retries}\n`;
      });
      summary += 'Recommended Next Topics:\n';
      recommendations.forEach(rec => {
        summary += `- ${rec.subject}: ${rec.topic} (${rec.reason})\n`;
      });
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch (e) {
      setError('Failed to copy dashboard summary.');
    } finally {
      setLoading(false);
    }
  };

  // Trend: compare last 5 lesson scores
  const lastScores = (profile.history || []).slice(-5).map(h => h.score);
  const trend = lastScores.length > 1 ? (lastScores[lastScores.length - 1] > lastScores[0] ? 'up' : lastScores[lastScores.length - 1] < lastScores[0] ? 'down' : 'flat') : 'flat';

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-blue/40 p-8 max-w-2xl mx-auto animate-fade-in flex flex-col items-center">
      <h2 className="text-2xl font-bold text-smartSchool-blue font-poppins drop-shadow mb-2 animate-tada">Parent/Guardian Dashboard</h2>
      <h3 className="text-lg font-semibold text-smartSchool-yellow mb-2">Student: {profile.id} (Grade {profile.grade})</h3>
      {/* Summary Section */}
      <div className="w-full mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-lg font-bold text-smartSchool-blue">Overall Mastery: <span className="text-2xl">{avgMastery}%</span></div>
        <div className="text-sm text-gray-600 mt-2 md:mt-0">Recent Progress: <span className={trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}>{trend === 'up' ? 'Improving' : trend === 'down' ? 'Needs Attention' : 'Stable'}</span></div>
      </div>
      <h4 className="text-base font-bold text-smartSchool-blue mb-2">Subject Mastery</h4>
      <ul className="w-full mb-4">
        {subjectEntries.map(([subject, subj]) => (
          <li key={subject} className="mb-2 text-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-smartSchool-blue cursor-pointer" onClick={() => setExpandedSubject(expandedSubject === subject ? null : subject)} title="Click for details">{subject}</strong>: Mastery {subj.mastery || 0}%
              </div>
              {/* Progress bar */}
              <div className="w-32 h-3 bg-gray-200 rounded-full ml-4 overflow-hidden">
                <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${subj.mastery || 0}%`, background: '#3b82f6' }}></div>
              </div>
            </div>
            {expandedSubject === subject && (
              <div className="mt-2 ml-2 p-2 bg-yellow-50 rounded-lg border border-yellow-100 animate-fade-in">
                {subj.strengths && subj.strengths.length > 0 && (
                  <div className="text-green-600 text-sm mb-1">Strengths: {subj.strengths.join(', ')}</div>
                )}
                {subj.recentErrors && subj.recentErrors.length > 0 && (
                  <div className="text-red-500 text-sm mb-1">Needs work: {subj.recentErrors.join(', ')}</div>
                )}
                {subj.recentLessons && subj.recentLessons.length > 0 && (
                  <div className="text-gray-700 text-xs">Recent Lessons: {subj.recentLessons.join(', ')}</div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      <h4 className="text-base font-bold text-smartSchool-yellow mb-2">Recent Lessons</h4>
      <div className="w-full mb-4 overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-1">Lesson</th>
              <th className="px-2 py-1">Score</th>
              <th className="px-2 py-1">Time</th>
              <th className="px-2 py-1">Retries</th>
            </tr>
          </thead>
          <tbody>
            {(profile.history || []).slice(-5).reverse().map((h, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-2 py-1 text-smartSchool-blue">{h.lessonId}</td>
                <td className="px-2 py-1">{h.score}</td>
                <td className="px-2 py-1">{h.timeSpent}</td>
                <td className="px-2 py-1">{h.retries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4 className="text-base font-bold text-smartSchool-blue mb-2 flex items-center">Recommended Next Topics <span className="ml-2 text-xs text-gray-400" title="AI-powered suggestions based on progress">ⓘ</span></h4>
      <ul className="w-full mb-4">
        {recommendations.map((rec, i) => (
          <li key={i} className="mb-1 text-gray-800">
            <span className="text-smartSchool-yellow">{rec.subject}:</span> {rec.topic} <span className="text-gray-500" title={rec.reason}>({rec.reason})</span>
          </li>
        ))}
      </ul>
      <button
        onClick={handleCopy}
        disabled={loading}
        className="px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/60 bg-smartSchool-blue text-white hover:bg-blue-700 active:scale-95 mt-2"
        title="Copy dashboard summary to clipboard"
      >
        {loading ? 'Copying...' : copied ? 'Copied!' : 'Copy Summary'}
      </button>
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      <div className="mt-4 text-gray-500 text-sm text-center">Monitor progress and get recommendations for your student. Click a subject for more details.</div>
    </div>
  );
}
