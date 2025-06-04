import React, { useState } from 'react';

const BREAK_OPTIONS = [
  {
    type: 'mindfulness',
    label: 'Mindfulness Break',
    description: 'Take a moment to breathe, relax, and refocus your mind.',
    examples: ['Deep breathing', 'Guided meditation', 'Visualization']
  },
  {
    type: 'movement',
    label: 'Movement Activity',
    description: 'Get up and move to refresh your body and boost energy.',
    examples: ['Stretching', 'Jumping jacks', 'Dance break']
  }
];

export default function BrainBreaks({ onTakeBreak }) {
  const [loading, setLoading] = useState(null); // 'mindfulness' | 'movement' | null
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // type of last successful break
  const [history, setHistory] = useState([]); // [{type, time}]

  // Simulate async break action (replace with real logic if needed)
  const handleBreak = async (type) => {
    setLoading(type);
    setError(null);
    setSuccess(null);
    try {
      await Promise.resolve(onTakeBreak?.(type));
      setSuccess(type);
      setHistory([{ type, time: new Date().toLocaleTimeString() }, ...history]);
    } catch (e) {
      setError('Failed to start break. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-yellow/40 p-8 max-w-md mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-xl font-bold text-smartSchool-yellow mb-2 font-poppins drop-shadow">Brain Breaks</h4>
      <div className="text-gray-700 text-sm mb-4 text-center">Short activities to refresh your mind and body. Choose a break below!</div>
      <div className="flex flex-col gap-4 w-full mb-4">
        {BREAK_OPTIONS.map(opt => (
          <div key={opt.type} className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold text-smartSchool-yellow mb-1">{opt.label}</div>
              <div className="text-xs text-gray-600 mb-1">{opt.description}</div>
              <div className="text-xs text-gray-500">Examples: {opt.examples.join(', ')}</div>
            </div>
            <button
              onClick={() => handleBreak(opt.type)}
              aria-label={opt.label}
              disabled={loading === opt.type}
              className={`mt-2 md:mt-0 px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-yellow/60 bg-smartSchool-yellow text-white hover:bg-yellow-400 active:scale-95 ${loading === opt.type ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading === opt.type ? 'Starting...' : opt.label}
            </button>
          </div>
        ))}
      </div>
      {success && (
        <div className="text-green-600 font-semibold animate-bounce mt-2">
          {success === 'mindfulness' ? 'Enjoy your mindfulness break!' : 'Enjoy your movement activity!'}
        </div>
      )}
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      {history.length > 0 && (
        <div className="w-full mt-4">
          <div className="text-gray-700 font-semibold mb-2">Recent Breaks:</div>
          <ul className="space-y-1 text-xs text-gray-600">
            {history.slice(0, 5).map((h, i) => (
              <li key={i} className="bg-gray-50 border border-gray-100 rounded px-2 py-1">
                {h.type === 'mindfulness' ? 'Mindfulness' : 'Movement'} at {h.time}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">Take a short break to refresh your mind and body! Try a new activity each time.</div>
    </div>
  );
}
