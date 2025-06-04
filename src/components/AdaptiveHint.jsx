import React, { useState } from 'react';

export default function AdaptiveHint({ errorTopics, onRequestMiniLesson }) {
  if (!errorTopics || errorTopics.length === 0) return null;
  return (
    <div style={{background: '#fffbe6', border: '1px solid #ffe58f', padding: 12, borderRadius: 8, margin: '16px 0'}}>
      <strong>Need help?</strong> It looks like you struggled with: {errorTopics.join(', ')}
      <button style={{marginLeft: 12}} onClick={onRequestMiniLesson}>Get a Mini-Lesson</button>
    </div>
  );
}
