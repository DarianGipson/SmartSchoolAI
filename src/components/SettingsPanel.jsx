import React, { useState } from 'react';

export default function SettingsPanel({ settings, onChange }) {
  const [loading, setLoading] = useState(''); // 'dyslexiaFont' | 'colorblindMode' | 'tts' | ''
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  // Add more settings: language, notifications, theme, profile, reset, help
  const [localSettings, setLocalSettings] = useState({
    ...settings,
    language: settings.language || 'English',
    theme: settings.theme || 'system',
    notifications: settings.notifications ?? true,
    profileName: settings.profileName || '',
  });
  const [profileSuccess, setProfileSuccess] = useState(false);

  const handleToggle = async (type) => {
    const updated = { ...localSettings, [type]: !localSettings[type] };
    setLocalSettings(updated);
    setError(null);
    setSuccess('');
    setLoading(type);
    try {
      await Promise.resolve(onChange(type, updated[type]));
      setSuccess(type);
    } catch (e) {
      setError('Failed to update setting. Please try again.');
    } finally {
      setLoading('');
    }
  };
  const handleInput = (type, value) => {
    setLocalSettings({ ...localSettings, [type]: value });
    setProfileSuccess(false);
  };
  const saveProfileName = async () => {
    setLoading('profileName');
    setError(null);
    setSuccess('');
    try {
      await Promise.resolve(onChange('profileName', localSettings.profileName));
      setProfileSuccess(true);
    } catch (e) {
      setError('Failed to update profile name.');
    } finally {
      setLoading('');
    }
  };
  const handleSelect = async (type, value) => {
    setLocalSettings({ ...localSettings, [type]: value });
    setLoading(type);
    setError(null);
    setSuccess('');
    try {
      await Promise.resolve(onChange(type, value));
      setSuccess(type);
    } catch (e) {
      setError('Failed to update setting.');
    } finally {
      setLoading('');
    }
  };
  const handleReset = async () => {
    setLoading('reset');
    setError(null);
    setSuccess('');
    try {
      await Promise.resolve(onChange('reset'));
      setSuccess('reset');
    } catch (e) {
      setError('Failed to reset settings.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-blue/40 p-8 max-w-lg mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-xl font-bold text-smartSchool-blue mb-4 font-poppins drop-shadow">Accessibility & Settings</h4>
      <div className="flex flex-col gap-4 w-full mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!localSettings.dyslexiaFont}
            onChange={() => handleToggle('dyslexiaFont')}
            disabled={loading === 'dyslexiaFont'}
            aria-label="Toggle dyslexia-friendly font"
            className="accent-smartSchool-blue w-5 h-5"
          />
          <span className="text-gray-800">Dyslexia-friendly font</span>
          {success === 'dyslexiaFont' && <span className="text-green-600 font-semibold animate-bounce ml-2">Updated!</span>}
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!localSettings.colorblindMode}
            onChange={() => handleToggle('colorblindMode')}
            disabled={loading === 'colorblindMode'}
            aria-label="Toggle colorblind mode"
            className="accent-smartSchool-blue w-5 h-5"
          />
          <span className="text-gray-800">Colorblind mode</span>
          {success === 'colorblindMode' && <span className="text-green-600 font-semibold animate-bounce ml-2">Updated!</span>}
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!localSettings.tts}
            onChange={() => handleToggle('tts')}
            disabled={loading === 'tts'}
            aria-label="Toggle text-to-speech"
            className="accent-smartSchool-blue w-5 h-5"
          />
          <span className="text-gray-800">Text-to-Speech</span>
          {success === 'tts' && <span className="text-green-600 font-semibold animate-bounce ml-2">Updated!</span>}
        </label>
        <label className="flex items-center gap-2">
          <span className="text-gray-800 w-32">Profile Name</span>
          <input
            type="text"
            value={localSettings.profileName}
            onChange={e => handleInput('profileName', e.target.value)}
            className="border rounded px-2 py-1 flex-1"
            placeholder="Enter your name"
            aria-label="Profile name"
            disabled={loading === 'profileName'}
          />
          <button
            onClick={saveProfileName}
            className="ml-2 px-3 py-1 rounded bg-smartSchool-blue text-white font-semibold hover:bg-blue-700 transition"
            disabled={loading === 'profileName'}
            aria-label="Save profile name"
          >Save</button>
          {profileSuccess && <span className="text-green-600 font-semibold animate-bounce ml-2">Saved!</span>}
        </label>
        <label className="flex items-center gap-2">
          <span className="text-gray-800 w-32">Language</span>
          <select
            value={localSettings.language}
            onChange={e => handleSelect('language', e.target.value)}
            className="border rounded px-2 py-1 flex-1"
            aria-label="Language"
            disabled={loading === 'language'}
          >
            <option>English</option>
            <option>Español</option>
            <option>Français</option>
            <option>中文</option>
            <option>العربية</option>
          </select>
          {success === 'language' && <span className="text-green-600 font-semibold animate-bounce ml-2">Updated!</span>}
        </label>
        <label className="flex items-center gap-2">
          <span className="text-gray-800 w-32">Theme</span>
          <select
            value={localSettings.theme}
            onChange={e => handleSelect('theme', e.target.value)}
            className="border rounded px-2 py-1 flex-1"
            aria-label="Theme"
            disabled={loading === 'theme'}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          {success === 'theme' && <span className="text-green-600 font-semibold animate-bounce ml-2">Updated!</span>}
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!localSettings.notifications}
            onChange={() => handleToggle('notifications')}
            disabled={loading === 'notifications'}
            aria-label="Enable notifications"
            className="accent-smartSchool-blue w-5 h-5"
          />
          <span className="text-gray-800">Enable notifications</span>
          {success === 'notifications' && <span className="text-green-600 font-semibold animate-bounce ml-2">Updated!</span>}
        </label>
        <button
          onClick={handleReset}
          className="mt-2 px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-700 transition self-start"
          disabled={loading === 'reset'}
          aria-label="Reset all settings"
        >Reset All Settings</button>
        {success === 'reset' && <span className="text-green-600 font-semibold animate-bounce ml-2">Reset!</span>}
      </div>
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">Personalize your learning experience and accessibility.<br/>Need help? <a href="#" className="text-smartSchool-blue underline">Visit Help Center</a></div>
    </div>
  );
}
