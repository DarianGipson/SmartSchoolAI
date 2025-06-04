import React, { useState } from 'react';

export default function PrivacyControls({ encryption, parentalConsent, onToggle }) {
  const [loading, setLoading] = useState(''); // 'encryption' | 'parentalConsent' | ''
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const handleToggle = async (type, value) => {
    setLoading(type);
    setError(null);
    setSuccess('');
    try {
      await Promise.resolve(onToggle(type, value));
      setSuccess(type);
    } catch (e) {
      setError('Failed to update privacy setting. Please try again.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-yellow/40 p-8 max-w-lg mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-xl font-bold text-smartSchool-yellow mb-4 font-poppins drop-shadow">Security & Privacy Controls</h4>
      <div className="flex flex-col gap-4 w-full mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={encryption}
            onChange={e => handleToggle('encryption', e.target.checked)}
            disabled={loading === 'encryption'}
            aria-label="Toggle end-to-end encryption"
            className="accent-smartSchool-yellow w-5 h-5"
          />
          <span className="text-gray-800">End-to-End Encryption</span>
          {success === 'encryption' && <span className="text-green-600 font-semibold animate-bounce ml-2">Updated!</span>}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={parentalConsent}
            onChange={e => handleToggle('parentalConsent', e.target.checked)}
            disabled={loading === 'parentalConsent'}
            aria-label="Toggle parental consent requirement"
            className="accent-smartSchool-yellow w-5 h-5"
          />
          <span className="text-gray-800">Parental Consent Required</span>
          {success === 'parentalConsent' && <span className="text-green-600 font-semibold animate-bounce ml-2">Updated!</span>}
        </label>
      </div>
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">Manage your privacy and security settings here.</div>
    </div>
  );
}
