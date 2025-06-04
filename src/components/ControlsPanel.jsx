import React from 'react';

export default function ControlsPanel({ controls, onSet }) {
  return (
    <div style={{marginTop: 32}}>
      <h4>Parent/Guardian Controls</h4>
      <label>
        Daily Time Limit (min):
        <input type="number" value={controls.timeLimit} onChange={e => onSet('timeLimit', e.target.value)} style={{marginLeft: 8}} />
      </label>
      <label style={{marginLeft: 16}}>
        Required Subjects:
        <input type="text" value={controls.requiredSubjects} onChange={e => onSet('requiredSubjects', e.target.value)} style={{marginLeft: 8}} />
      </label>
    </div>
  );
}
