import React, { useState, useRef, useEffect } from 'react';

/**
 * TutorChat component provides an AI-powered chat for on-demand help.
 * @param {Object} props
 * @param {Object} props.profile - The student profile object.
 * @param {Function} props.onSendMessage - Function to send a message to the AI tutor.
 * @param {Array} props.messages - Array of chat messages.
 */
export default function TutorChat({ profile, onSendMessage, messages }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([
    'Can you explain this concept?',
    'Can you help me with my homework?',
    'What are some tips for studying?',
    'How do I solve this problem?',
    'Can you quiz me on this topic?'
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (input.trim()) {
      setLoading(true);
      setError(null);
      try {
        await onSendMessage(input);
        setInput('');
      } catch (e) {
        setError('Failed to send message. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Contextual suggestion as user types
  useEffect(() => {
    if (!input.trim()) {
      setShowSuggestions(false);
      return;
    }
    setShowSuggestions(true);
  }, [input]);

  // Format timestamp
  const formatTime = ts => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-blue/40 p-8 max-w-lg mx-auto flex flex-col items-center">
        <h4 className="text-xl font-bold text-smartSchool-blue mb-2 font-poppins drop-shadow">AI Tutor Chat</h4>
        <div className="text-sm text-gray-600 mb-2">Student: <span className="font-semibold">{profile?.id}</span> | Grade: <span className="font-semibold">{profile?.grade}</span></div>
        <div className="w-full h-56 overflow-y-auto bg-smartSchool-blue/5 rounded-lg mb-4 p-3 animate-fade-in-slow">
          {messages.length === 0 && (
            <div className="text-gray-400 text-center mt-8">No messages yet. Start the conversation!</div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs px-3 py-2 rounded-lg shadow font-poppins ${msg.role === 'ai' ? 'bg-smartSchool-yellow/20 text-smartSchool-yellow' : 'bg-smartSchool-blue/20 text-smartSchool-blue'}`}>
                <div className="flex items-center gap-2">
                  <strong>{msg.role === 'ai' ? 'AI' : 'You'}</strong>
                  <span className="text-xs text-gray-400">{formatTime(msg.time)}</span>
                </div>
                <div>{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {showSuggestions && (
          <div className="w-full mb-2 flex flex-wrap gap-2 animate-fade-in">
            {suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase())).map((s, i) => (
              <button
                key={i}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs hover:bg-blue-200 transition hover:animate-pop-on-hover"
                onClick={() => { setInput(s); setShowSuggestions(false); }}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex w-full gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question..."
            className={`flex-1 px-4 py-2 rounded-lg border-2 border-smartSchool-blue/30 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/40 text-lg shadow ${error ? 'animate-shake border-red-400' : ''}`}
            disabled={loading}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/60 bg-smartSchool-blue text-white hover:bg-blue-700 active:scale-95 ${!input.trim() || loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending...' : <span className="flex items-center"><span className="sr-only">Send</span><svg className="w-5 h-5 inline-block animate-wiggle hover:animate-wiggle ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></span>}
          </button>
        </div>
        {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
        <div className="mt-4 text-gray-500 text-sm text-center">Chat with your AI tutor for instant help! Try asking for explanations, tips, or practice questions.</div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => setInput(s)} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-yellow-100 text-gray-700 text-xs font-semibold transition hover:animate-pop-on-hover">
            {s}
          </button>
        ))}
      </div>
      {/* Floating help button for chat tips */}
      <div className="fixed bottom-6 right-24 z-50 group">
        <button className="bg-smartSchool-blue text-white rounded-full shadow-lg p-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 animate-float relative">
          <span className="sr-only">Chat tips</span>
          <svg width="22" height="22" fill="none" viewBox="0 0 22 22" className="inline-block align-middle animate-wiggle group-hover:animate-wiggle"><circle cx="11" cy="11" r="10" stroke="#facc15" strokeWidth="2" fill="#2563eb"/><text x="50%" y="55%" textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="bold" dy=".3em">?</text></svg>
        </button>
        <div className="absolute right-16 bottom-1/2 translate-y-1/2 bg-white text-gray-700 px-4 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          Try asking for examples, quizzes, or explanations!
        </div>
      </div>
    </div>
  );
}
