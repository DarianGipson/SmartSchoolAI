import React, { useState } from 'react';

/**
 * GamificationPanel component displays XP, badges, and level-ups for the student.
 * @param {Object} props
 * @param {Object} props.profile - The student profile object.
 */
export default function GamificationPanel({ profile }) {
  const xp = profile.gamification?.xp || 0;
  const level = profile.gamification?.level || 1;
  const badges = profile.gamification?.badges || [];
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Copy gamification summary to clipboard
  const handleCopy = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const text = `XP: ${xp}\nLevel: ${level}\nBadges: ${badges.length > 0 ? badges.join(', ') : 'No badges yet'}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (e) {
      setError('Failed to copy gamification summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-yellow/40 p-8 max-w-md mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-xl font-bold text-smartSchool-yellow mb-4 font-poppins drop-shadow">Gamification</h4>
      <div className="flex flex-col items-center w-full mb-4">
        <div className="flex items-center gap-3 text-lg font-semibold text-smartSchool-yellow">
          <span className="flex items-center gap-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline-block align-middle">
              <circle cx="10" cy="10" r="10" fill="#FFD600" />
              <text x="10" y="15" textAnchor="middle" fontSize="12" fill="#1E40AF" fontWeight="bold">XP</text>
            </svg>
            <span className="text-smartSchool-blue font-bold">{xp}</span>
          </span>
          <span className="flex items-center gap-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="inline-block align-middle">
              <rect x="2" y="2" width="16" height="16" rx="4" fill="#34D399" />
              <text x="10" y="15" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">Lv</text>
            </svg>
            <span className="text-smartSchool-blue font-bold">{level}</span>
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
          {badges.length > 0 ? badges.map((b, i) => (
            <span key={i} className="bg-yellow-100 border border-blue-200 text-smartSchool-blue px-3 py-1 rounded-full font-semibold text-sm shadow flex items-center gap-1">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="inline-block align-middle">
                <circle cx="10" cy="10" r="9" fill="#60A5FA" stroke="#1E40AF" strokeWidth="2" />
                <text x="10" y="15" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">B</text>
              </svg>
              {b}
            </span>
          )) : <span className="text-gray-400">No badges yet</span>}
        </div>
        <div className="w-full mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col items-center shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="inline-block align-middle">
              <rect x="2" y="2" width="18" height="18" rx="4" fill="#F59E42" />
              <text x="11" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">XP</text>
            </svg>
            <span className="font-bold text-smartSchool-yellow">Progress to Next Level</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div className="bg-smartSchool-yellow h-4 rounded-full transition-all duration-700" style={{ width: `${Math.min((xp % 100) || 0, 100)}%` }} />
          </div>
          <div className="text-xs text-gray-500 mt-1">{100 - (xp % 100)} XP to Level {level + 1}</div>
        </div>
      </div>
      <button
        onClick={handleCopy}
        disabled={loading}
        aria-label="Copy gamification summary"
        className="px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-yellow/60 bg-smartSchool-yellow text-white hover:bg-yellow-400 active:scale-95 mt-2"
      >
        {loading ? 'Copying...' : copied ? 'Copied!' : 'Copy Summary'}
      </button>
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">
        Earn XP, level up, and collect badges as you learn!<br/>
        <span className="block mt-2 text-yellow-700 font-bold">Tip: Complete activities, help others, and explore new topics to earn more rewards!</span>
      </div>
    </div>
  );
}
