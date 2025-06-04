import React, { useState, useRef, useEffect } from 'react';

export default function AITeacherBot({ studentName = "Student" }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Hi ${studentName}! I'm your AI Teacher. Ask me anything about your lesson!` }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'bot', text: aiResponse(input) }]);
    }, 800);
    setInput('');
  }

  function aiResponse(text) {
    // Simple simulated AI logic
    if (/hello|hi|hey/i.test(text)) return "Hello! How can I help you today?";
    if (/help|explain/i.test(text)) return "Sure! Let's break it down together. What part is tricky?";
    if (/quiz|answer/i.test(text)) return "Try your best! If you get stuck, I can give you a hint.";
    return "That's a great question! Let's think about it together.";
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 max-w-sm mx-auto flex flex-col h-96">
      <div className="mb-2 font-bold text-blue-700">AI Teacher Bot</div>
      <div className="flex-1 overflow-y-auto mb-2 bg-gray-50 p-2 rounded">
        {messages.map((m, i) => (
          <div key={i} className={m.from === 'bot' ? 'text-blue-700 mb-1' : 'text-gray-800 mb-1 text-right'}>
            <span className="inline-block px-2 py-1 rounded bg-blue-100 mr-2">{m.text}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex">
        <input
          className="border p-2 rounded flex-1 mr-2"
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          autoComplete="off"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-3 py-1 rounded">Send</button>
      </div>
    </div>
  );
}
