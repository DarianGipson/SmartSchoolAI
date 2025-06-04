import React, { useState } from 'react';

export default function StudyBuddyGroup({ group, onJoin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleJoin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await Promise.resolve(onJoin(joinMessage));
      setSuccess(true);
      setShowJoinForm(false);
      setJoinMessage('');
    } catch (e) {
      setError('Failed to join group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Group details
  const { name, subject, meetingTime, description, members, upcomingSessions, goals } = group;

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-yellow/40 p-8 max-w-md mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-xl font-bold text-smartSchool-yellow mb-2 font-poppins drop-shadow">Study Buddy Group</h4>
      {name && <div className="text-lg font-semibold text-smartSchool-yellow mb-1">{name}</div>}
      {subject && <div className="text-sm text-gray-700 mb-1">Subject: <span className="font-semibold">{subject}</span></div>}
      {meetingTime && (
        <div className="text-sm text-gray-700 mb-1">Next Meeting: <span className="font-semibold">{meetingTime}</span></div>
      )}
      {goals && (
        <div className="text-xs text-blue-700 mb-2">Group Goals: {goals}</div>
      )}
      {description && (
        <div className="text-gray-600 text-sm mb-2 italic">{description}</div>
      )}
      <div className="w-full mb-2 text-gray-600 text-xs">Members ({members.length}):</div>
      <ul className="w-full mb-4 list-disc ml-6">
        {members.map((m, i) => (
          <li key={i} className="mb-1 text-gray-800 animate-fade-in-slow">{m}</li>
        ))}
      </ul>
      {upcomingSessions && upcomingSessions.length > 0 && (
        <div className="w-full mb-4">
          <div className="text-sm font-semibold text-smartSchool-yellow mb-1">Upcoming Sessions:</div>
          <ul className="list-disc ml-6 text-gray-700 text-xs">
            {upcomingSessions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {showJoinForm ? (
        <form onSubmit={handleJoin} className="w-full flex flex-col gap-2 mb-2 animate-fade-in">
          <textarea
            placeholder="Introduce yourself or add a message (optional)"
            className="px-3 py-2 rounded border border-gray-300"
            value={joinMessage}
            onChange={e => setJoinMessage(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 bg-smartSchool-yellow text-white hover:bg-yellow-400 active:scale-95 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Joining...' : 'Confirm Join'}
          </button>
          <button type="button" className="text-sm text-gray-500 underline" onClick={() => setShowJoinForm(false)} disabled={loading}>Cancel</button>
        </form>
      ) : (
        <button
          onClick={() => { setShowJoinForm(true); setSuccess(false); setError(null); }}
          disabled={loading}
          aria-label="Join study buddy group"
          className={`px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-yellow/60 bg-smartSchool-yellow text-white hover:bg-yellow-400 active:scale-95 mt-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Joining...' : success ? 'Joined!' : 'Join Group'}
        </button>
      )}
      {success && <span className="text-green-600 font-semibold animate-bounce mt-2">You joined the group!</span>}
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">Collaborate and learn together with your study buddies! Share your goals and join the next session.</div>
    </div>
  );
}
