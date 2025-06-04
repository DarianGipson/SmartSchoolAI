import React, { useState } from 'react';

export default function ExternalResources({ resources, onOpen }) {
  const [loading, setLoading] = useState(''); // holds the current resource url being opened
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const handleOpen = async (resource) => {
    setLoading(resource.url);
    setError(null);
    setSuccess('');
    try {
      await Promise.resolve(onOpen(resource));
      setSuccess(resource.url);
    } catch (e) {
      setError('Failed to open resource. Please try again.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-blue/40 p-8 max-w-lg mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-xl font-bold text-smartSchool-blue mb-4 font-poppins drop-shadow">External Resources</h4>
      <ul className="w-full mb-4">
        {resources.map((r, i) => (
          <li key={i} className="mb-4 flex flex-col gap-1 border-b pb-3 last:border-b-0 last:pb-0 bg-blue-50/30 rounded-xl p-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2">
              {/* Custom SVG icons for resource types */}
              <span className="text-2xl">
                {r.type === 'video' && (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="inline-block align-middle"><rect x="2" y="2" width="18" height="18" rx="4" fill="#2563eb"/><polygon points="9,7 16,11 9,15" fill="#fff"/></svg>
                )}
                {r.type === 'article' && (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="inline-block align-middle"><rect x="2" y="2" width="18" height="18" rx="4" fill="#0ea5e9"/><rect x="6" y="6" width="10" height="2" fill="#fff"/><rect x="6" y="10" width="7" height="2" fill="#bae6fd"/><rect x="6" y="14" width="5" height="2" fill="#bae6fd"/></svg>
                )}
                {r.type === 'interactive' && (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="inline-block align-middle"><rect x="2" y="2" width="18" height="18" rx="4" fill="#22c55e"/><circle cx="11" cy="11" r="4" fill="#fff"/><rect x="10" y="6" width="2" height="10" fill="#bbf7d0"/><rect x="6" y="10" width="10" height="2" fill="#bbf7d0"/></svg>
                )}
                {r.type === 'official' && (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="inline-block align-middle"><rect x="2" y="2" width="18" height="18" rx="4" fill="#f59e42"/><rect x="7" y="7" width="8" height="8" fill="#fff"/><rect x="9" y="9" width="4" height="4" fill="#fde68a"/></svg>
                )}
                {!['video','article','interactive','official'].includes(r.type) && (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="inline-block align-middle"><rect x="2" y="2" width="18" height="18" rx="4" fill="#64748b"/><circle cx="11" cy="11" r="5" fill="#fff"/></svg>
                )}
              </span>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-lg text-smartSchool-blue underline hover:text-smartSchool-yellow font-semibold transition-colors">
                {r.title}
              </a>
              <button
                onClick={() => handleOpen(r)}
                disabled={loading === r.url}
                aria-label={`Open resource: ${r.title}`}
                className={`ml-auto px-4 py-1.5 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/60 bg-smartSchool-blue text-white hover:bg-blue-700 active:scale-95 ${loading === r.url ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading === r.url ? 'Opening...' : success === r.url ? 'Opened!' : 'Open'}
              </button>
            </div>
            {r.description && (
              <div className="ml-8 text-gray-700 text-sm italic">{r.description}</div>
            )}
            {r.tags && r.tags.length > 0 && (
              <div className="ml-8 flex flex-wrap gap-2 mt-1">
                {r.tags.map((tag, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">{tag}</span>
                ))}
              </div>
            )}
            {r.rating && (
              <div className="ml-8 flex items-center gap-1 mt-1 text-yellow-500 text-xs">
                {'★'.repeat(Math.round(r.rating))}{'☆'.repeat(5 - Math.round(r.rating))}
                <span className="ml-1 text-gray-500">({r.rating.toFixed(1)}/5)</span>
              </div>
            )}
            {r.author && (
              <div className="ml-8 text-xs text-gray-500 mt-1">By: {r.author}</div>
            )}
            {r.updated && (
              <div className="ml-8 text-xs text-gray-400">Updated: {r.updated}</div>
            )}
            {/* Deep resource preview for video, interactive, or article */}
            {r.type === 'video' && r.preview && (
              <div className="ml-8 mt-2">
                <iframe
                  src={r.preview}
                  title={r.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg w-full max-w-md aspect-video border border-blue-200 shadow"
                ></iframe>
              </div>
            )}
            {r.type === 'interactive' && r.preview && (
              <div className="ml-8 mt-2">
                <iframe
                  src={r.preview}
                  title={r.title}
                  className="rounded-lg w-full max-w-md aspect-video border border-blue-200 shadow"
                ></iframe>
              </div>
            )}
            {r.type === 'article' && r.preview && (
              <div className="ml-8 mt-2 bg-white border border-blue-100 rounded p-2 text-xs text-gray-700 shadow-inner">
                <div className="font-bold mb-1">Preview:</div>
                <div>{r.preview}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {error && (<div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>)}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">Explore trusted, AI-curated resources to boost your learning!<br/>Videos, interactives, articles, and more—handpicked for you.</div>
    </div>
  );
}
