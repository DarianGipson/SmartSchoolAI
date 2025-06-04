import React from 'react';

export default function TranscriptGenerator({ profile }) {
  return (
    <div style={{marginTop: 32, border: '1px solid #ccc', borderRadius: 8, padding: 24}}>
      <h4>Transcript</h4>
      <div><strong>Student:</strong> {profile.id}</div>
      <div><strong>Grade:</strong> {profile.grade}</div>
      <div><strong>Subjects:</strong></div>
      <ul>
        {Object.entries(profile.subjects).map(([subject, subj], i) => (
          <li key={i}>{subject}: Mastery {subj.mastery || 0}%</li>
        ))}
      </ul>
      <div><strong>Lessons Completed:</strong> {(profile.history || []).length}</div>
    </div>
  );
}
