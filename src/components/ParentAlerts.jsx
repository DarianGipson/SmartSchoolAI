import React, { useState } from 'react';

export default function ParentAlerts({ alerts }) {
  const [acknowledged, setAcknowledged] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState('');

  const handleAcknowledge = async (alert, idx) => {
    setLoading(idx);
    setError(null);
    try {
      // Simulate async acknowledge (replace with real logic if needed)
      await Promise.resolve();
      setAcknowledged(prev => [...prev, idx]);
    } catch (e) {
      setError('Failed to acknowledge alert. Please try again.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-red/40 p-8 max-w-lg mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-xl font-bold text-smartSchool-red mb-4 font-poppins drop-shadow">Parent/Guardian Alerts</h4>
      <ul className="w-full mb-4">
        {alerts.map((a, i) => (
          <li key={i} className="mb-2 flex items-center text-gray-800">
            <span className="flex-1">{a}</span>
            <button
              onClick={() => handleAcknowledge(a, i)}
              disabled={acknowledged.includes(i) || loading === i}
              aria-label={`Acknowledge alert: ${a}`}
              className={`ml-4 px-4 py-1.5 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-red/60 bg-smartSchool-red text-white hover:bg-red-400 active:scale-95 ${acknowledged.includes(i) || loading === i ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {acknowledged.includes(i) ? 'Acknowledged' : loading === i ? 'Acknowledging...' : 'Acknowledge'}
            </button>
          </li>
        ))}
      </ul>
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">Stay up to date with important alerts!</div>
    </div>
  );
}
