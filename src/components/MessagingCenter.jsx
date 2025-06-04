import React, { useState } from 'react';

export default function MessagingCenter({ messages, onSend }) {
  const [input, setInput] = useState('');
  return (
    <div style={{border: '1px solid #eee', borderRadius: 8, padding: 16, marginTop: 32, maxWidth: 500}}>
      <h4>Messages</h4>
      <div style={{height: 150, overflowY: 'auto', background: '#f9f9f9', marginBottom: 8, padding: 8}}>
        {messages.map((msg, i) => (
          <div key={i} style={{marginBottom: 4}}>
            <strong>{msg.from}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a message..."
        style={{width: '70%', marginRight: 8}}
      />
      <button onClick={() => { onSend(input); setInput(''); }}>Send</button>
    </div>
  );
}
