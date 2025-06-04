import React, { useState } from 'react';

const SUGGESTED_TOPICS = [
  'How do I reset my password?',
  'How do I access my assignments?',
  'How can I contact my teacher?',
  'Where can I find my grades?',
  'How do I use SmartSchool AI features?'
];

export default function HelpCenter({ onAsk }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState([]); // [{question, answer}]
  const [suggestion, setSuggestion] = useState('');

  const handleAsk = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setAnswer('');
    try {
      const response = await Promise.resolve(onAsk(input));
      setSuccess(true);
      setInput('');
      setAnswer(response?.answer || response || 'No answer provided.');
      setHistory(prev => [{ question: input, answer: response?.answer || response || 'No answer provided.' }, ...prev]);
    } catch (e) {
      setError(e?.message || 'Failed to submit question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Contextual suggestion as user types
  React.useEffect(() => {
    if (!input.trim()) {
      setSuggestion('');
      return;
    }
    const lower = input.toLowerCase();
    const found = SUGGESTED_TOPICS.find(topic => topic.toLowerCase().includes(lower));
    setSuggestion(found || '');
  }, [input]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-blue/40 p-8 max-w-lg mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-xl font-bold text-smartSchool-blue mb-4 font-poppins drop-shadow">Help Center</h4>
      <div className="flex w-full gap-2 mb-4">
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setSuccess(false); setError(null); }}
          placeholder="Ask a question or search help..."
          style={{width: '70%'}}
          aria-label="Ask a question or search help"
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-lg border-2 border-smartSchool-blue/30 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/40 text-lg shadow"
        />
        <button
          onClick={handleAsk}
          disabled={loading || !input.trim()}
          aria-label="Ask question"
          className={`px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/60 bg-smartSchool-blue text-white hover:bg-blue-700 active:scale-95 ${loading || !input.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </div>
      {/* Contextual suggestion */}
      {suggestion && (
        <div className="mb-2 text-blue-600 text-sm animate-fade-in">Did you mean: <span className="font-semibold">{suggestion}</span>?</div>
      )}
      {/* Suggested topics */}
      <div className="w-full mb-4">
        <div className="text-gray-600 text-sm mb-1">Suggested topics:</div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TOPICS.map(topic => (
            <button
              key={topic}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs hover:bg-blue-200 transition"
              onClick={() => { setInput(topic); setSuccess(false); setError(null); }}
              disabled={loading}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
      {/* AI Answer */}
      {answer && (
        <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 mb-2 animate-fade-in text-green-900">
          <div className="font-semibold mb-1">AI Answer:</div>
          <div>{answer}</div>
        </div>
      )}
      {/* Submission feedback */}
      {success && <span className="text-green-600 font-semibold animate-bounce mt-2">Submitted!</span>}
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      {/* History */}
      {history.length > 0 && (
        <div className="w-full mt-4">
          <div className="text-gray-700 font-semibold mb-2">Previous Questions:</div>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {history.map((item, idx) => (
              <li key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="text-sm text-gray-800"><span className="font-semibold">Q:</span> {item.question}</div>
                <div className="text-xs text-green-800 mt-1"><span className="font-semibold">A:</span> {item.answer}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">Get help, tips, or answers from SmartSchool AI!</div>
    </div>
  );
}
