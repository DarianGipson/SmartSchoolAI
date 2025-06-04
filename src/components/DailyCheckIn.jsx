import React, { useState } from 'react';

export default function DailyCheckIn({ onCheckIn }) {
  const [mood, setMood] = useState('');
  const [moodEmoji, setMoodEmoji] = useState('');
  const [journal, setJournal] = useState('');
  const [energy, setEnergy] = useState(5);
  const [sleep, setSleep] = useState(7);
  const [goal, setGoal] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleSubmit = async () => {
    if (!moodEmoji || !mood.trim()) {
      setError('Please select your mood and describe it.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await Promise.resolve(onCheckIn({
        mood,
        moodEmoji,
        journal,
        energy,
        sleep,
        goal,
        gratitude,
        date: new Date().toLocaleDateString()
      }));
      setSuccess(true);
      setShowSummary(true);
      setMood('');
      setMoodEmoji('');
      setJournal('');
      setEnergy(5);
      setSleep(7);
      setGoal('');
      setGratitude('');
    } catch (e) {
      setError('Failed to submit check-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const moodOptions = [
    { emoji: '😃', label: 'Happy' },
    { emoji: '🙂', label: 'Okay' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😡', label: 'Angry' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '🤩', label: 'Excited' },
    { emoji: '😰', label: 'Anxious' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-red/40 p-6 max-w-md mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-2xl font-bold text-smartSchool-red mb-4 font-poppins drop-shadow">Daily Check-In</h4>
      {showSummary ? (
        <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4 mb-2 animate-fade-in">
          <div className="text-lg font-bold text-green-700 mb-2">Check-In Summary</div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{moodEmoji}</span>
            <span className="font-semibold text-smartSchool-red">Mood:</span> <span>{mood}</span>
          </div>
          <div className="mb-1"><span className="font-semibold">Journal:</span> {journal || <span className="text-gray-400">(none)</span>}</div>
          <div className="mb-1"><span className="font-semibold">Energy:</span> {energy}/10</div>
          <div className="mb-1"><span className="font-semibold">Sleep:</span> {sleep} hours</div>
          <div className="mb-1"><span className="font-semibold">Goal:</span> {goal || <span className="text-gray-400">(none)</span>}</div>
          <div className="mb-1"><span className="font-semibold">Gratitude:</span> {gratitude || <span className="text-gray-400">(none)</span>}</div>
          <button className="mt-3 px-4 py-1.5 rounded bg-smartSchool-red/80 text-white font-semibold shadow hover:bg-smartSchool-red/90 transition" onClick={() => setShowSummary(false)}>Check in again</button>
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col gap-2 mb-3">
            <label className="font-semibold text-smartSchool-red mb-1">How are you feeling today?</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {moodOptions.map(opt => (
                <button
                  key={opt.emoji}
                  type="button"
                  className={`px-3 py-2 rounded-xl border-2 text-2xl font-bold transition focus:outline-none focus:ring-2 focus:ring-smartSchool-red/40 ${moodEmoji === opt.emoji ? 'bg-smartSchool-red/20 border-smartSchool-red' : 'bg-white border-gray-200 hover:bg-smartSchool-red/10'}`}
                  onClick={() => { setMoodEmoji(opt.emoji); setError(null); }}
                  aria-label={opt.label}
                >
                  {opt.emoji}
                </button>
              ))}
            </div>
            <input
              value={mood}
              onChange={e => { setMood(e.target.value); setSuccess(false); setError(null); }}
              placeholder="Describe your mood in a word or two..."
              aria-label="Describe your mood"
              disabled={loading}
              className="px-4 py-2 rounded-lg border-2 border-smartSchool-red/30 focus:outline-none focus:ring-2 focus:ring-smartSchool-red/40 text-base shadow"
              maxLength={32}
            />
          </div>
          <div className="w-full flex flex-col gap-2 mb-3">
            <label className="font-semibold text-smartSchool-red">Write a short journal entry (optional)</label>
            <textarea
              value={journal}
              onChange={e => setJournal(e.target.value)}
              placeholder="Anything on your mind?"
              className="px-4 py-2 rounded-lg border-2 border-smartSchool-red/20 focus:outline-none focus:ring-2 focus:ring-smartSchool-red/30 text-base shadow min-h-[60px]"
              maxLength={200}
              disabled={loading}
            />
          </div>
          <div className="w-full flex flex-col gap-2 mb-3">
            <label className="font-semibold text-smartSchool-red">How much energy do you have?</label>
            <input
              type="range"
              min={1}
              max={10}
              value={energy}
              onChange={e => setEnergy(Number(e.target.value))}
              className="w-full accent-smartSchool-red"
              disabled={loading}
            />
            <div className="text-sm text-gray-600">Energy: <span className="font-bold text-smartSchool-red">{energy}</span>/10</div>
          </div>
          <div className="w-full flex flex-col gap-2 mb-3">
            <label className="font-semibold text-smartSchool-red">How many hours did you sleep last night?</label>
            <input
              type="number"
              min={0}
              max={16}
              value={sleep}
              onChange={e => setSleep(Number(e.target.value))}
              className="w-24 px-2 py-1 rounded-lg border-2 border-smartSchool-red/20 focus:outline-none focus:ring-2 focus:ring-smartSchool-red/30 text-base shadow"
              disabled={loading}
            />
            <div className="text-sm text-gray-600">Sleep: <span className="font-bold text-smartSchool-red">{sleep}</span> hours</div>
          </div>
          <div className="w-full flex flex-col gap-2 mb-3">
            <label className="font-semibold text-smartSchool-red">What's your main goal for today?</label>
            <input
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="E.g. Finish my math homework"
              className="px-4 py-2 rounded-lg border-2 border-smartSchool-red/20 focus:outline-none focus:ring-2 focus:ring-smartSchool-red/30 text-base shadow"
              maxLength={60}
              disabled={loading}
            />
          </div>
          <div className="w-full flex flex-col gap-2 mb-3">
            <label className="font-semibold text-smartSchool-red">One thing you're grateful for today?</label>
            <input
              value={gratitude}
              onChange={e => setGratitude(e.target.value)}
              placeholder="E.g. My family, a sunny day, a good friend..."
              className="px-4 py-2 rounded-lg border-2 border-smartSchool-red/20 focus:outline-none focus:ring-2 focus:ring-smartSchool-red/30 text-base shadow"
              maxLength={60}
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !moodEmoji || !mood.trim()}
            aria-label="Submit mood check-in"
            className={`w-full px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-red/60 bg-smartSchool-red text-white hover:bg-red-400 active:scale-95 ${loading || !moodEmoji || !mood.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </>
      )}
      {success && !showSummary && <span className="text-green-600 font-semibold animate-bounce mt-2">Check-in received!</span>}
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">Your feelings matter! Let us know how you are today.</div>
    </div>
  );
}
