import React, { useState } from 'react';

// Helper to initialize goal objects
function toGoalObj(goal) {
  if (typeof goal === 'string') {
    return { text: goal, completed: false, notes: '', due: '', editing: false };
  }
  return { ...goal, editing: false };
}

export default function GoalSetting({ goals, onAddGoal }) {
  // Convert incoming goals to objects if needed
  const [goalList, setGoalList] = useState(goals.map(toGoalObj));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [detailIdx, setDetailIdx] = useState(null); // Index of goal in detail view

  // Sync with parent if goals prop changes
  React.useEffect(() => {
    setGoalList(goals.map(toGoalObj));
  }, [goals]);

  // Remove a goal
  const handleDeleteGoal = (idx) => {
    if (window.confirm('Delete this goal?')) {
      const updated = goalList.filter((_, i) => i !== idx);
      setGoalList(updated);
      onAddGoal(updated);
    }
  };

  // Add a new goal
  const handleAddGoal = () => {
    if (input.trim()) {
      setLoading(true);
      setTimeout(() => {
        const updated = [...goalList, toGoalObj(input.trim())];
        setGoalList(updated);
        onAddGoal(updated);
        setInput('');
        setSuccess(true);
        setLoading(false);
      }, 500);
    } else {
      setError('Goal cannot be empty');
      setSuccess(false);
    }
  };

  // Toggle complete
  const handleToggleComplete = (idx) => {
    const updated = goalList.map((g, i) => i === idx ? { ...g, completed: !g.completed } : g);
    setGoalList(updated);
    onAddGoal(updated);
  };

  // Only render the main popup/modal content, no overlay or duplicate popups
  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-blue/40 p-8 max-w-md w-full mx-auto flex flex-col items-center relative animate-fade-in">
      <h4 className="text-xl font-bold text-smartSchool-blue mb-4 font-poppins drop-shadow">Learning Goals</h4>
      <ul className="w-full mb-4 list-disc ml-6">
        {goalList.length === 0 && <li className="text-gray-400 italic">No goals set yet. Start by adding one below!</li>}
        {goalList.map((g, i) => (
          <li key={i} className={`mb-2 flex flex-col gap-1 animate-fade-in-slow bg-blue-50/40 rounded-lg p-2 ${g.completed ? 'opacity-60 line-through' : ''}`}> 
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleComplete(i)}
                className={`w-5 h-5 rounded-full border-2 ${g.completed ? 'bg-green-400 border-green-600' : 'border-blue-400'} flex items-center justify-center mr-1`}
                aria-label="Mark as complete"
              >
                {g.completed && <span className="text-white font-bold">✓</span>}
              </button>
              <span className="text-gray-800 flex-1">{g.text}</span>
              <button onClick={() => setDetailIdx(i === detailIdx ? null : i)} className="ml-2 text-blue-600 hover:text-blue-900 text-xs font-bold underline">Details</button>
              <button onClick={() => handleDeleteGoal(i)} className="ml-2 text-red-500 hover:text-red-700 text-xs font-bold">Delete</button>
            </div>
            {/* Inline expanded details for this goal */}
            {detailIdx === i && (
              <div className="mt-2 bg-white border border-blue-200 rounded-lg p-3 shadow-inner">
                <div className="w-full mb-2">
                  <label className="block text-xs font-semibold mb-1">Goal</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg"
                    value={g.text}
                    onChange={e => handleEditGoal(i, { text: e.target.value })}
                  />
                </div>
                <div className="w-full mb-2">
                  <label className="block text-xs font-semibold mb-1">Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg"
                    value={g.notes}
                    onChange={e => handleEditGoal(i, { notes: e.target.value })}
                  />
                </div>
                <div className="w-full mb-2">
                  <label className="block text-xs font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={g.due}
                    onChange={e => handleEditGoal(i, { due: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={g.completed}
                    onChange={() => handleToggleComplete(i)}
                    id={`complete-checkbox-${i}`}
                  />
                  <label htmlFor={`complete-checkbox-${i}`} className="text-xs">Mark as complete</label>
                </div>
                <button
                  className="mt-1 px-3 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-800 text-xs"
                  onClick={() => setDetailIdx(null)}
                >
                  Done
                </button>
              </div>
            )}
            {g.due && detailIdx !== i && <div className="text-xs text-blue-700 ml-7">Due: {g.due}</div>}
            {g.notes && detailIdx !== i && <div className="text-xs text-blue-900 ml-7 italic">Notes: {g.notes}</div>}
          </li>
        ))}
      </ul>
      <div className="flex w-full gap-2 mb-2">
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setSuccess(false); setError(null); }}
          placeholder="Set a new goal (e.g. 'Finish math project by Friday')"
          aria-label="Set a new goal"
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-lg border-2 border-smartSchool-blue/30 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/40 text-lg shadow"
        />
        <button
          onClick={handleAddGoal}
          disabled={loading || !input.trim()}
          aria-label="Add goal"
          className={`px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/60 bg-smartSchool-blue text-white hover:bg-blue-700 active:scale-95 ${loading || !input.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <span className="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin"><circle cx="8" cy="8" r="7" stroke="#2563eb" strokeWidth="2"/></svg> Adding...</span>
          ) : 'Add Goal'}
        </button>
      </div>
      {success && <span className="text-green-600 font-semibold animate-bounce mt-2">Goal added!</span>}
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      <div className="w-full mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center shadow-inner">
        <div className="flex items-center gap-2 mb-2">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="inline-block align-middle"><rect x="2" y="2" width="18" height="18" rx="4" fill="#2563eb"/><text x="11" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontWeight="bold">TIP</text></svg>
          <span className="font-bold text-smartSchool-blue">Goal-Setting Tips</span>
        </div>
        <ul className="list-disc ml-6 text-sm text-blue-900">
          <li>Make your goals specific and measurable.</li>
          <li>Break big goals into smaller steps.</li>
          <li>Set a deadline or target date.</li>
          <li>Review your goals regularly and mark them as complete.</li>
        </ul>
      </div>
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">
        Set and track your learning goals here!<br />
        <span className="block mt-2 text-blue-700 font-bold">Tip: Click a goal to mark it as complete or view details.</span>
      </div>
    </div>
  );
}
