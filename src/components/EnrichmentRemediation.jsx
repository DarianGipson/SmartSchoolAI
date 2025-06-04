import React, { useState, useEffect } from 'react';

function getRandomContent(type, item) {
  // Simulate AI-generated content
  const now = new Date();
  const base = type === 'Enrichment'
    ? [
        `Try this advanced challenge: How could you apply "${item}" to a real-world problem?`,
        `Create a project or presentation about "${item}" and share it with your class!`,
        `Explore a new technology or tool related to "${item}".`,
        `Write a story or comic that uses "${item}" in a creative way.`
      ]
    : [
        `Practice "${item}" with these 3 problems: ${Math.floor(Math.random()*100)}, ${Math.floor(Math.random()*100)}, ${Math.floor(Math.random()*100)}.`,
        `Watch a short video about "${item}" and summarize what you learned.`,
        `Ask a friend or AI tutor to explain "${item}" in their own words.`,
        `Draw a diagram or picture to help you remember "${item}".`
      ];
  return base[Math.floor(Math.random()*base.length)] + ` (Generated at ${now.toLocaleTimeString()})`;
}

const getPersonalizedNote = (item, type) => {
  const notes = [
    `I noticed your approach to "${item}" was very creative!`,
    `You made great progress on "${item}". Keep it up!`,
    `For "${item}", try connecting it to something you enjoy.`,
    `Your explanation of "${item}" was clear and thoughtful.`,
    `Don't forget to review the basics of "${item}" for even more confidence.`,
    `Impressive effort on "${item}"—your hard work shows!`,
    `If you want to master "${item}", try teaching it to someone else!`,
    `Remember, mistakes are part of learning "${item}". Keep going!`,
    `Your persistence with "${item}" is inspiring!`,
    `Try using "${item}" in a real-life scenario for extra practice.`
  ];
  return notes[Math.floor(Math.random()*notes.length)];
};

// Simulate a more advanced AI grading API (could be replaced with real API call)
async function aiGradeItem({ item, type, attempt, details, response }) {
  // Simulate network/AI delay
  await new Promise(res => setTimeout(res, 900 + Math.random()*400));
  // Dynamic, item-aware feedback
  const gradeLevels = [
    { grade: 'A+', icon: '🌟', color: 'green', summary: `You truly mastered "${item}"!`,
      strengths: `Your work on "${item}" was exceptional—insightful, creative, and thorough.`,
      improvement: `Keep pushing your boundaries by exploring advanced aspects of "${item}".`,
      next: `Invent a new way to use "${item}" or teach it to a peer.` },
    { grade: 'A', icon: '✅', color: 'green', summary: `Excellent understanding of "${item}".`,
      strengths: `You explained "${item}" clearly and made strong connections.`,
      improvement: `Try adding more real-world examples or applications.`,
      next: `Explore how "${item}" relates to your interests.` },
    { grade: 'B+', icon: '👍', color: 'yellow', summary: `Solid work on "${item}".`,
      strengths: `You covered the essentials and showed good effort.`,
      improvement: `Review a few tricky parts and check your details.`,
      next: `Practice "${item}" with a new challenge or quiz.` },
    { grade: 'B', icon: '📝', color: 'yellow', summary: `Good effort on "${item}".`,
      strengths: `You showed understanding, but some details were missing.`,
      improvement: `Focus on accuracy and double-check your answers.`,
      next: `Try a timed challenge for "${item}".` },
    { grade: 'C', icon: '⚠️', color: 'red', summary: `Needs improvement on "${item}".`,
      strengths: `You made a good start and showed persistence.`,
      improvement: `Review the basics and ask for help if needed.`,
      next: `Try a simpler version of "${item}" or use a visual aid.` }
  ];
  // Personalize grade by attempt, item, and type
  const idx = (item.length + attempt + (type==='Enrichment'?1:0)) % gradeLevels.length;
  const base = gradeLevels[idx];
  // AI-generated, item-specific encouragement
  const aiNote = getPersonalizedNote(item, type) + (attempt > 1 ? ` (You improved since your last try!)` : '');
  // Simulate AI-generated next-step question
  const aiQuestion = `If you could ask an expert one thing about "${item}", what would it be?`;
  // Simulate AI-generated resource
  const aiResource = `Recommended: Watch "${item} in Real Life" on YouTube or try an interactive simulation.`;
  return {
    ...base,
    time: new Date().toLocaleTimeString(),
    item,
    type,
    attempt,
    personalized: aiNote,
    aiQuestion,
    aiResource,
    aiReflection: `Reflect: What was the hardest part of "${item}" for you? How did you overcome it?`
  };
}

export default function EnrichmentRemediation({ enrichment, remediation, onStart }) {
  const [loading, setLoading] = useState(''); // holds the current item being started
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState({}); // {item: {completed, retries, favorited}}
  const [showDetails, setShowDetails] = useState({});
  const [aiContent, setAiContent] = useState({}); // {item: content}
  const [aiGrade, setAiGrade] = useState({}); // {item: grade/feedback}
  // --- Grade/attempt history feature ---
  const [gradeHistory, setGradeHistory] = useState({}); // {item: [gradeObj, ...]}

  // Example details/tips for demo
  const details = {
    ...Object.fromEntries(enrichment.map(e => [e, { type: 'Enrichment', tip: 'Try to go above and beyond!', desc: 'Challenge yourself with this advanced activity.' }])),
    ...Object.fromEntries(remediation.map(r => [r, { type: 'Remediation', tip: 'Review and practice for mastery.', desc: 'Extra help to strengthen your skills.' }]))
  };

  const detailedGrades = [
    {
      grade: 'A+',
      summary: 'Outstanding work!',
      strengths: 'You demonstrated deep understanding and creativity.',
      improvement: 'Keep challenging yourself with even harder problems.',
      next: 'Try teaching this concept to a friend or create a mini-lesson.'
    },
    {
      grade: 'A',
      summary: 'Great job!',
      strengths: 'You covered all the main points clearly.',
      improvement: 'Add more real-world examples next time.',
      next: 'Explore how this topic connects to other subjects.'
    },
    {
      grade: 'B',
      summary: 'Good effort!',
      strengths: 'You showed solid understanding.',
      improvement: 'Review a few tricky parts and check your details.',
      next: 'Practice with a new set of problems.'
    },
    {
      grade: 'C',
      summary: 'Needs improvement.',
      strengths: 'You made a good start.',
      improvement: 'Focus on the basics and ask for help if needed.',
      next: 'Try a simpler version of this activity.'
    },
    {
      grade: 'A+',
      summary: 'Perfect! You mastered this.',
      strengths: 'Flawless execution and deep insight.',
      improvement: 'Keep up the excellent work!',
      next: 'Challenge yourself with an advanced project.'
    },
    {
      grade: 'A',
      summary: 'Excellent creativity!',
      strengths: 'Your approach was unique and effective.',
      improvement: 'Explain your thinking in more detail next time.',
      next: 'Invent a new way to use this concept.'
    },
    {
      grade: 'B+',
      summary: 'Solid understanding.',
      strengths: 'You got most of it right.',
      improvement: 'Double-check your answers for accuracy.',
      next: 'Try a timed challenge for extra practice.'
    }
  ];

  const handleStart = async (item) => {
    setLoading(item);
    setError(null);
    setSuccess('');
    try {
      await Promise.resolve(onStart(item));
      setSuccess(item);
      setProgress(p => ({
        ...p,
        [item]: {
          ...(p[item] || {}),
          completed: true,
          retries: (p[item]?.retries || 0),
          favorited: p[item]?.favorited || false
        }
      }));
      // --- AI-powered grading ---
      const attempt = (progress[item]?.retries || 0) + 1;
      const type = details[item]?.type || 'Enrichment';
      const aiResult = await aiGradeItem({ item, type, attempt, details: details[item], response: null });
      setAiGrade(prev => ({ ...prev, [item]: aiResult }));
      setGradeHistory(h => ({
        ...h,
        [item]: [...(h[item] || []), aiResult]
      }));
    } catch (e) {
      setError('Failed to start. Please try again.');
    } finally {
      setLoading('');
    }
  };

  const handleRetry = (item) => {
    setProgress(p => ({
      ...p,
      [item]: {
        ...(p[item] || {}),
        completed: false,
        retries: (p[item]?.retries || 0) + 1,
        favorited: p[item]?.favorited || false
      }
    }));
    setAiGrade(g => ({ ...g, [item]: undefined })); // Reset grade on retry
    setSuccess('');
    setError(null);
  };

  const handleFavorite = (item) => {
    setProgress(p => ({
      ...p,
      [item]: {
        ...(p[item] || {}),
        favorited: !(p[item]?.favorited)
      }
    }));
  };

  const handleShowDetails = (item, type) => {
    setShowDetails(sd => ({ ...sd, [item]: !sd[item] }));
    // Generate new AI content every time details are opened
    setAiContent(ac => ({ ...ac, [item]: getRandomContent(type, item) }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-yellow/40 p-8 max-w-lg mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-xl font-bold text-smartSchool-yellow mb-4 font-poppins drop-shadow">AI Enrichment & Remediation</h4>
      <div className="w-full mb-4">
        <strong className="text-smartSchool-yellow">Enrichment:</strong>
        <ul className="list-disc ml-6 mt-2">
          {enrichment.map((e, i) => (
            <li key={i} className="mb-2 flex flex-col gap-1">
              <div className="flex items-center">
                <span className="flex-1 text-gray-800 font-semibold">{e}</span>
                <button
                  onClick={() => handleShowDetails(e, 'Enrichment')}
                  className="ml-2 px-2 py-1 rounded bg-smartSchool-yellow/20 text-smartSchool-yellow text-xs font-bold hover:bg-smartSchool-yellow/40 transition"
                  aria-label="Show details"
                >
                  {showDetails[e] ? 'Hide' : 'Details'}
                </button>
                <button
                  onClick={() => handleFavorite(e)}
                  className={`ml-2 px-2 py-1 rounded-full text-lg ${progress[e]?.favorited ? 'bg-yellow-300 text-yellow-800' : 'bg-gray-100 text-gray-400'} hover:bg-yellow-200 transition`}
                  aria-label="Favorite"
                >
                  {progress[e]?.favorited ? '★' : '☆'}
                </button>
              </div>
              {showDetails[e] && (
                <div className="ml-2 mb-1 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  <div><strong>Type:</strong> {details[e]?.type}</div>
                  <div><strong>Description:</strong> {details[e]?.desc}</div>
                  <div><strong>AI Tip:</strong> {details[e]?.tip}</div>
                  <div className="mt-2"><strong>AI Learning Content:</strong> <span className="block mt-1 text-yellow-900">{aiContent[e]}</span></div>
                </div>
              )}
              <div className="flex items-center gap-2 ml-2 mt-1">
                <button
                  onClick={() => handleStart(e)}
                  disabled={loading === e || progress[e]?.completed}
                  aria-label={`Start enrichment: ${e}`}
                  className={`px-3 py-1 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-yellow/60 bg-smartSchool-yellow text-white hover:bg-yellow-400 active:scale-95 text-xs ${loading === e ? 'opacity-60 cursor-not-allowed' : ''} ${progress[e]?.completed ? 'bg-green-400 text-white' : ''}`}
                >
                  {loading === e ? 'Starting...' : progress[e]?.completed ? 'Completed!' : 'Start'}
                </button>
                <button
                  onClick={() => handleRetry(e)}
                  disabled={loading === e}
                  className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold hover:bg-yellow-200 transition"
                  aria-label="Retry"
                >
                  Retry
                </button>
                {progress[e]?.completed && <span className="text-green-600 font-bold text-xs ml-1">✓</span>}
                {typeof progress[e]?.retries === 'number' && progress[e].retries > 0 && <span className="text-xs text-yellow-700">Retried {progress[e].retries}x</span>}
                {progress[e]?.completed && aiGrade[e] && (
                  <div className={`block text-xs border rounded px-3 py-2 mt-2 animate-fade-in shadow-sm bg-${aiGrade[e].color}-50 border-${aiGrade[e].color}-200 text-${aiGrade[e].color}-900`}> 
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-lg text-${aiGrade[e].color}-600`}>{aiGrade[e].icon}</span>
                      <span className="font-bold text-lg">Grade: {aiGrade[e].grade}</span>
                      <span className="ml-auto text-[10px] text-gray-400">{aiGrade[e].time}</span>
                    </div>
                    <div className="font-semibold">{aiGrade[e].summary}</div>
                    <div className="mt-1"><span className="font-bold">Strengths:</span> {aiGrade[e].strengths}</div>
                    <div><span className="font-bold">Improvement:</span> {aiGrade[e].improvement}</div>
                    <div><span className="font-bold">Next Challenge:</span> {aiGrade[e].next}</div>
                    <div className="mt-1 italic text-sm text-blue-700">Personalized AI Note: {aiGrade[e].personalized}</div>
                    <div className="mt-1 text-[11px] text-gray-500">For: <span className="font-bold">{aiGrade[e].item}</span> (Attempt {aiGrade[e].attempt})</div>
                    <div className="mt-2 text-blue-900"><span className="font-bold">AI Reflection:</span> {aiGrade[e].aiReflection}</div>
                    <div className="mt-1 text-blue-900"><span className="font-bold">AI Question:</span> {aiGrade[e].aiQuestion}</div>
                    <div className="mt-1 text-blue-900"><span className="font-bold">AI Resource:</span> {aiGrade[e].aiResource}</div>
                  </div>
                )}
                {progress[e]?.completed && gradeHistory[e] && gradeHistory[e].length > 1 && (
                  <div className="mt-2 text-xs">
                    <div className="font-bold text-gray-700 mb-1">Grade History (Full Feedback):</div>
                    <ul className="space-y-2">
                      {gradeHistory[e].slice(0, -1).map((g, idx) => (
                        <li key={idx} className={`border-l-4 pl-2 pb-2 ${g.color === 'green' ? 'border-green-400 bg-green-50' : g.color === 'yellow' ? 'border-yellow-400 bg-yellow-50' : 'border-red-400 bg-red-50'}`}> 
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-lg ${g.color === 'green' ? 'text-green-600' : g.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>{g.icon}</span>
                            <span className="font-bold">{g.grade}</span>
                            <span className="ml-auto text-[10px] text-gray-400">{g.time}</span>
                          </div>
                          <div className="font-semibold">{g.summary}</div>
                          <div><span className="font-bold">Strengths:</span> {g.strengths}</div>
                          <div><span className="font-bold">Improvement:</span> {g.improvement}</div>
                          <div><span className="font-bold">Next Challenge:</span> {g.next}</div>
                          <div className="italic text-blue-700">AI Note: {g.personalized}</div>
                          <div className="text-[11px] text-gray-500">For: <span className="font-bold">{g.item}</span> (Attempt {g.attempt})</div>
                          <div className="text-blue-900"><span className="font-bold">AI Reflection:</span> {g.aiReflection}</div>
                          <div className="text-blue-900"><span className="font-bold">AI Question:</span> {g.aiQuestion}</div>
                          <div className="text-blue-900"><span className="font-bold">AI Resource:</span> {g.aiResource}</div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2">
                      <label className="block font-bold text-gray-700 mb-1" htmlFor={`reflection-e-${i}`}>Your Reflection on Past Attempts:</label>
                      <textarea id={`reflection-e-${i}`} className="w-full border rounded p-1 text-xs" rows={2} placeholder="What did you learn or change after each attempt? (Not saved)" />
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full mb-2">
        <strong className="text-smartSchool-red">Remediation:</strong>
        <ul className="list-disc ml-6 mt-2">
          {remediation.map((r, i) => (
            <li key={i} className="mb-2 flex flex-col gap-1">
              <div className="flex items-center">
                <span className="flex-1 text-gray-800 font-semibold">{r}</span>
                <button
                  onClick={() => handleShowDetails(r, 'Remediation')}
                  className="ml-2 px-2 py-1 rounded bg-smartSchool-red/20 text-smartSchool-red text-xs font-bold hover:bg-smartSchool-red/40 transition"
                  aria-label="Show details"
                >
                  {showDetails[r] ? 'Hide' : 'Details'}
                </button>
                <button
                  onClick={() => handleFavorite(r)}
                  className={`ml-2 px-2 py-1 rounded-full text-lg ${progress[r]?.favorited ? 'bg-red-300 text-red-800' : 'bg-gray-100 text-gray-400'} hover:bg-red-200 transition`}
                  aria-label="Favorite"
                >
                  {progress[r]?.favorited ? '★' : '☆'}
                </button>
              </div>
              {showDetails[r] && (
                <div className="ml-2 mb-1 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  <div><strong>Type:</strong> {details[r]?.type}</div>
                  <div><strong>Description:</strong> {details[r]?.desc}</div>
                  <div><strong>AI Tip:</strong> {details[r]?.tip}</div>
                  <div className="mt-2"><strong>AI Learning Content:</strong> <span className="block mt-1 text-red-900">{aiContent[r]}</span></div>
                </div>
              )}
              <div className="flex items-center gap-2 ml-2 mt-1">
                <button
                  onClick={() => handleStart(r)}
                  disabled={loading === r || progress[r]?.completed}
                  aria-label={`Start remediation: ${r}`}
                  className={`px-3 py-1 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-red/60 bg-smartSchool-red text-white hover:bg-red-400 active:scale-95 text-xs ${loading === r ? 'opacity-60 cursor-not-allowed' : ''} ${progress[r]?.completed ? 'bg-green-400 text-white' : ''}`}
                >
                  {loading === r ? 'Starting...' : progress[r]?.completed ? 'Completed!' : 'Start'}
                </button>
                <button
                  onClick={() => handleRetry(r)}
                  disabled={loading === r}
                  className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-semibold hover:bg-red-200 transition"
                  aria-label="Retry"
                >
                  Retry
                </button>
                {progress[r]?.completed && <span className="text-green-600 font-bold text-xs ml-1">✓</span>}
                {typeof progress[r]?.retries === 'number' && progress[r].retries > 0 && <span className="text-xs text-red-700">Retried {progress[r].retries}x</span>}
                {progress[r]?.completed && aiGrade[r] && (
                  <div className={`block text-xs border rounded px-3 py-2 mt-2 animate-fade-in shadow-sm bg-${aiGrade[r].color}-50 border-${aiGrade[r].color}-200 text-${aiGrade[r].color}-900`}> 
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-lg text-${aiGrade[r].color}-600`}>{aiGrade[r].icon}</span>
                      <span className="font-bold text-lg">Grade: {aiGrade[r].grade}</span>
                      <span className="ml-auto text-[10px] text-gray-400">{aiGrade[r].time}</span>
                    </div>
                    <div className="font-semibold">{aiGrade[r].summary}</div>
                    <div className="mt-1"><span className="font-bold">Strengths:</span> {aiGrade[r].strengths}</div>
                    <div><span className="font-bold">Improvement:</span> {aiGrade[r].improvement}</div>
                    <div><span className="font-bold">Next Challenge:</span> {aiGrade[r].next}</div>
                    <div className="mt-1 italic text-sm text-blue-700">Personalized AI Note: {aiGrade[r].personalized}</div>
                    <div className="mt-1 text-[11px] text-gray-500">For: <span className="font-bold">{aiGrade[r].item}</span> (Attempt {aiGrade[r].attempt})</div>
                    <div className="mt-2 text-blue-900"><span className="font-bold">AI Reflection:</span> {aiGrade[r].aiReflection}</div>
                    <div className="mt-1 text-blue-900"><span className="font-bold">AI Question:</span> {aiGrade[r].aiQuestion}</div>
                    <div className="mt-1 text-blue-900"><span className="font-bold">AI Resource:</span> {aiGrade[r].aiResource}</div>
                  </div>
                )}
                {progress[r]?.completed && gradeHistory[r] && gradeHistory[r].length > 1 && (
                  <div className="mt-2 text-xs">
                    <div className="font-bold text-gray-700 mb-1">Grade History (Full Feedback):</div>
                    <ul className="space-y-2">
                      {gradeHistory[r].slice(0, -1).map((g, idx) => (
                        <li key={idx} className={`border-l-4 pl-2 pb-2 ${g.color === 'green' ? 'border-green-400 bg-green-50' : g.color === 'yellow' ? 'border-yellow-400 bg-yellow-50' : 'border-red-400 bg-red-50'}`}> 
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-lg ${g.color === 'green' ? 'text-green-600' : g.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>{g.icon}</span>
                            <span className="font-bold">{g.grade}</span>
                            <span className="ml-auto text-[10px] text-gray-400">{g.time}</span>
                          </div>
                          <div className="font-semibold">{g.summary}</div>
                          <div><span className="font-bold">Strengths:</span> {g.strengths}</div>
                          <div><span className="font-bold">Improvement:</span> {g.improvement}</div>
                          <div><span className="font-bold">Next Challenge:</span> {g.next}</div>
                          <div className="italic text-blue-700">AI Note: {g.personalized}</div>
                          <div className="text-[11px] text-gray-500">For: <span className="font-bold">{g.item}</span> (Attempt {g.attempt})</div>
                          <div className="text-blue-900"><span className="font-bold">AI Reflection:</span> {g.aiReflection}</div>
                          <div className="text-blue-900"><span className="font-bold">AI Question:</span> {g.aiQuestion}</div>
                          <div className="text-blue-900"><span className="font-bold">AI Resource:</span> {g.aiResource}</div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2">
                      <label className="block font-bold text-gray-700 mb-1" htmlFor={`reflection-r-${i}`}>Your Reflection on Past Attempts:</label>
                      <textarea id={`reflection-r-${i}`} className="w-full border rounded p-1 text-xs" rows={2} placeholder="What did you learn or change after each attempt? (Not saved)" />
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">Challenge yourself or get extra help—AI-powered for you!</div>
    </div>
  );
}
