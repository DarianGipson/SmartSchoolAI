import React from 'react';

export default function MasteryMap({ masteryData }) {
  // masteryData: { subject: { topic: masteryPercent } }
  return (
    <div style={{marginTop: 32}}>
      <h4>Mastery Map</h4>
      {Object.entries(masteryData).map(([subject, topics]) => (
        <div key={subject} style={{marginBottom: 16}}>
          <strong>{subject}</strong>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4}}>
            {Object.entries(topics).map(([topic, percent], i) => (
              <div key={i} style={{padding: 4, border: '1px solid #ccc', borderRadius: 4, background: `rgba(0,128,0,${percent/100})`}}>
                {topic}: {percent}%
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
