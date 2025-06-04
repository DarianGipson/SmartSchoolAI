import React from 'react';

/**
 * Certificate component displays a graduation or progress certificate for the student.
 * @param {Object} props
 * @param {Object} props.profile - The student profile object.
 * @param {string} [props.type] - 'progress' or 'graduation'
 */
export default function Certificate({ profile, type = 'progress' }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const date = new Date().toLocaleDateString();

  // Download as image (using html2canvas if available)
  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const el = document.getElementById('certificate-content');
      if (window.html2canvas && el) {
        const canvas = await window.html2canvas(el);
        const link = document.createElement('a');
        link.download = `${profile.id || 'certificate'}.png`;
        link.href = canvas.toDataURL();
        link.click();
      } else {
        setError('Download not supported in this browser.');
      }
    } catch (e) {
      setError('Failed to download certificate.');
    } finally {
      setLoading(false);
    }
  };

  // Copy certificate text to clipboard
  const handleCopy = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const text = `${type === 'graduation' ? 'Graduation Certificate' : 'Progress Certificate'}\nThis certifies that ${profile.id}\nhas successfully ${type === 'graduation' ? 'completed all requirements for graduation' : 'made significant progress in their studies'}.\nDate: ${date}\nSmartSchool AI`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (e) {
      setError('Failed to copy certificate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-yellow/40 p-8 max-w-lg mx-auto animate-fade-in flex flex-col items-center relative">
      <div id="certificate-content" aria-label="Certificate content" tabIndex={0} className="w-full text-center">
        <h2 className="text-2xl font-bold text-smartSchool-yellow font-poppins drop-shadow mb-2 animate-tada">{type === 'graduation' ? 'Graduation Certificate' : 'Progress Certificate'}</h2>
        <p className="text-lg text-gray-700">This certifies that</p>
        <h1 className="my-4 text-3xl font-extrabold text-smartSchool-blue font-poppins animate-fade-in-slow">{profile.id}</h1>
        <p className="text-lg text-gray-700">has successfully {type === 'graduation' ? 'completed all requirements for graduation' : 'made significant progress in their studies'}.</p>
        <p className="text-gray-500 mt-2">Date: {date}</p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handleDownload}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-smartSchool-blue text-white font-semibold shadow hover:bg-blue-700 transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/60"
          >
            {loading ? 'Downloading...' : 'Download as Image'}
          </button>
          <button
            onClick={handleCopy}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-smartSchool-yellow text-white font-semibold shadow hover:bg-yellow-400 transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-smartSchool-yellow/60"
          >
            {loading ? 'Copying...' : copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
        {error && <div className="text-red-500 font-semibold mt-4 animate-shake">{error}</div>}
      </div>
      <div className="absolute bottom-2 right-4 text-xs text-gray-400 font-poppins">SmartSchool AI</div>
    </div>
  );
}
