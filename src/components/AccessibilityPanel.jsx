import React from 'react';

export default function AccessibilityPanel({ altText, captions, translations, onToggle }) {
  return (
    <div style={{marginTop: 32}}>
      <h4>Advanced Accessibility</h4>
      <label>
        <input type="checkbox" checked={altText} onChange={e => onToggle('altText', e.target.checked)} /> Auto Alt Text
      </label>
      <label style={{marginLeft: 16}}>
        <input type="checkbox" checked={captions} onChange={e => onToggle('captions', e.target.checked)} /> Captions
      </label>
      <label style={{marginLeft: 16}}>
        <input type="checkbox" checked={translations} onChange={e => onToggle('translations', e.target.checked)} /> Translations
      </label>
    </div>
  );
}
