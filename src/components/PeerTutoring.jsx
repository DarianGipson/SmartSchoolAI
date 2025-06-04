import React, { useState } from 'react';

export default function PeerTutoring({ requests, onRequestHelp, onOfferHelp }) {
  const [loading, setLoading] = useState(''); // 'request' | 'offer' | ''
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null); // index of selected request
  const [localRequests, setLocalRequests] = useState(requests);

  const handleRequestHelp = async (e) => {
    e?.preventDefault();
    setLoading('request');
    setError(null);
    setSuccess('');
    try {
      if (!requestTopic.trim()) {
        setError('Please specify a subject or topic.');
        setLoading('');
        return;
      }
      const newRequest = {
        student: 'You',
        topic: requestTopic,
        message: requestMessage,
        time: new Date().toISOString(),
      };
      await Promise.resolve(onRequestHelp(newRequest));
      setSuccess('request');
      setLocalRequests([newRequest, ...localRequests]);
      setRequestTopic('');
      setRequestMessage('');
      setShowRequestForm(false);
    } catch (e) {
      setError('Failed to request help. Please try again.');
    } finally {
      setLoading('');
    }
  };

  const handleOfferHelp = async (req, idx) => {
    setLoading('offer');
    setError(null);
    setSuccess('');
    try {
      await Promise.resolve(onOfferHelp(req));
      setSuccess('offer');
      setSelectedRequest(idx);
    } catch (e) {
      setError('Failed to offer help. Please try again.');
    } finally {
      setLoading('');
    }
  };

  // Summary
  const summary = localRequests.length > 0 ? `${localRequests.length} active help request${localRequests.length > 1 ? 's' : ''}.` : 'No active help requests.';

  return (
    <div className="bg-white rounded-2xl shadow-2xl border-2 border-smartSchool-blue/40 p-8 max-w-lg mx-auto animate-fade-in flex flex-col items-center">
      <h4 className="text-xl font-bold text-smartSchool-blue mb-4 font-poppins drop-shadow">Peer Tutoring</h4>
      <div className="w-full text-gray-600 text-sm mb-2">{summary}</div>
      {showRequestForm ? (
        <form onSubmit={handleRequestHelp} className="w-full flex flex-col gap-2 mb-4 animate-fade-in">
          <input
            type="text"
            placeholder="Subject or Topic (e.g. Algebra, Essay)"
            className="px-3 py-2 rounded border border-gray-300"
            value={requestTopic}
            onChange={e => setRequestTopic(e.target.value)}
            disabled={loading === 'request'}
            required
          />
          <textarea
            placeholder="Describe what you need help with (optional)"
            className="px-3 py-2 rounded border border-gray-300"
            value={requestMessage}
            onChange={e => setRequestMessage(e.target.value)}
            disabled={loading === 'request'}
          />
          <button
            type="submit"
            disabled={loading === 'request'}
            className={`px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 bg-smartSchool-blue text-white hover:bg-blue-700 active:scale-95 ${loading === 'request' ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading === 'request' ? 'Requesting...' : 'Submit Request'}
          </button>
          <button type="button" className="text-sm text-gray-500 underline" onClick={() => setShowRequestForm(false)} disabled={loading === 'request'}>Cancel</button>
        </form>
      ) : (
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => { setShowRequestForm(true); setSuccess(''); setError(null); }}
            disabled={loading === 'request'}
            aria-label="Request peer tutoring help"
            className={`px-5 py-2 rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/60 bg-smartSchool-blue text-white hover:bg-blue-700 active:scale-95 ${loading === 'request' ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading === 'request' ? 'Requesting...' : success === 'request' ? 'Requested!' : 'Request Help'}
          </button>
        </div>
      )}
      <ul className="w-full mb-4">
        {localRequests.map((r, i) => (
          <li key={i} className="mb-2 text-gray-800 animate-fade-in-slow border-b border-gray-100 pb-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">{r.student}</span> needs help with <span className="font-semibold">{r.topic}</span>
                {r.time && <span className="text-xs text-gray-400 ml-2">({new Date(r.time).toLocaleString()})</span>}
              </div>
              <button
                onClick={() => handleOfferHelp(r, i)}
                disabled={loading === 'offer' || selectedRequest === i}
                className={`ml-2 px-3 py-1 rounded bg-smartSchool-yellow text-white text-xs font-semibold hover:bg-yellow-400 transition ${loading === 'offer' || selectedRequest === i ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {selectedRequest === i && success === 'offer' ? 'Offered!' : loading === 'offer' ? 'Offering...' : 'Offer Help'}
              </button>
            </div>
            {r.message && <div className="text-sm text-gray-600 mt-1">"{r.message}"</div>}
          </li>
        ))}
      </ul>
      {error && <div className="text-red-500 font-semibold animate-shake mt-2">{error}</div>}
      <div className="mt-4 text-gray-500 text-sm text-center animate-pulse">Connect with peers for help or to offer your expertise! Click "Offer Help" to respond to a request.</div>
    </div>
  );
}
