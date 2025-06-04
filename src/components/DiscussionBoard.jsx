import React, { useState } from 'react';

function getInitials(name) {
  if (!name) return 'A';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

const TAGS = [
  { label: 'Question', color: 'bg-smartSchool-blue/30 text-smartSchool-blue' },
  { label: 'Help', color: 'bg-smartSchool-yellow/40 text-yellow-800' },
  { label: 'Fun', color: 'bg-pink-100 text-pink-600' },
  { label: 'Challenge', color: 'bg-green-100 text-green-700' },
  { label: 'Share', color: 'bg-purple-100 text-purple-700' },
];

function Confetti({ show }) {
  // Simple emoji confetti for demo
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center animate-fade-in">
      <div className="text-7xl animate-bounce">🎉✨🎊</div>
    </div>
  );
}

export default function DiscussionBoard({ threads, onPost }) {
  const [newThread, setNewThread] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  // New: responses state, keyed by thread index
  const [responses, setResponses] = useState({});
  const [responseInputs, setResponseInputs] = useState({});
  const [showResponses, setShowResponses] = useState({});
  const [responseAuthors, setResponseAuthors] = useState({});
  const [threadTags, setThreadTags] = useState({});
  const [pinned, setPinned] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);

  // Leaderboard: count responses per author
  const leaderboard = Object.values(responses).flat().reduce((acc, r) => {
    if (!r || !r.author) return acc;
    acc[r.author] = (acc[r.author] || 0) + 1;
    return acc;
  }, {});
  const topResponders = Object.entries(leaderboard).sort((a,b) => b[1]-a[1]).slice(0,3);

  const handlePost = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await Promise.resolve(onPost({ author: author || 'Anonymous', text: newThread }));
      setSuccess(true);
      setNewThread('');
      setAuthor('');
    } catch (e) {
      setError('Failed to post thread. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // New: handle response submission
  const handleTurnIn = (idx) => {
    const input = responseInputs[idx]?.trim();
    const author = responseAuthors[idx]?.trim() || 'Anonymous';
    if (!input) return;
    setResponses(r => {
      const newResps = { ...r, [idx]: [...(r[idx] || []), { author, text: input }] };
      // Confetti for first response to any thread
      if ((newResps[idx]?.length || 0) === 1) setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1800);
      return newResps;
    });
    setResponseInputs(i => ({ ...i, [idx]: '' }));
    setResponseAuthors(a => ({ ...a, [idx]: '' }));
  };

  const handleLike = (idx, ridx) => {
    setLikeCounts(lc => {
      const key = `${idx}-${ridx}`;
      return { ...lc, [key]: (lc[key] || 0) + 1 };
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-smartSchool-blue/30 p-6 max-w-2xl mx-auto animate-fade-in flex flex-col items-center relative min-h-[80vh]">
      <Confetti show={showConfetti} />
      <h4 className="text-2xl font-bold text-smartSchool-blue mb-2 font-poppins drop-shadow tracking-tight">Discussion Board</h4>
      {/* Leaderboard */}
      <div className="w-full flex flex-col items-center mb-2">
        <div className="text-base font-bold text-smartSchool-blue mb-0.5">Top Responders</div>
        <div className="flex gap-2 flex-wrap justify-center">
          {topResponders.length === 0 ? <span className="text-gray-400 text-xs">No responses yet</span> : topResponders.map(([name, count], i) => (
            <div key={name} className={`flex flex-col items-center px-2 py-1 rounded-lg shadow bg-smartSchool-yellow/30 border border-smartSchool-yellow/40 ${i===0?'scale-105':''}`}>
              <span className="text-lg font-bold text-smartSchool-blue">{getInitials(name)}</span>
              <span className="font-semibold text-smartSchool-blue/90 text-xs">{name}</span>
              <span className="text-[10px] text-gray-600">{count} responses</span>
            </div>
          ))}
        </div>
      </div>
      <button
        className="mb-3 px-3 py-1.5 rounded bg-smartSchool-blue/90 hover:bg-smartSchool-blue text-white font-semibold shadow transition focus:outline-none focus:ring-2 focus:ring-smartSchool-yellow/60 text-sm"
        onClick={() => setNewThread('AI Suggestion: What is something new you learned this week?')}
        aria-label="Get AI thread suggestion"
      >
        💡 AI Suggest a Topic
      </button>
      {threads.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center py-8 text-center text-gray-400 text-base font-poppins animate-fade-in-slow">
          <span className="text-3xl mb-1">🗨️</span>
          <span>No threads yet. Be the first to start a discussion!</span>
        </div>
      )}
      <div className="w-full flex-1 overflow-y-auto max-h-[40vh] min-h-[120px] mb-4 pr-1">
        <ul className="w-full">
          {[...threads.entries()].sort((a,b)=>{
            // Pinned threads first
            if (pinned[a[0]] && !pinned[b[0]]) return -1;
            if (!pinned[a[0]] && pinned[b[0]]) return 1;
            return 0;
          }).map(([i, t]) => (
            <li key={i} className={`py-2 px-1 rounded-xl mb-2 shadow group flex flex-col gap-1 transition-all duration-200 bg-white hover:scale-[1.01] hover:shadow-lg relative`} tabIndex={0} aria-label={`Thread by ${t.author}`}> 
              {/* Pin button */}
              <button
                className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow border ${pinned[i] ? 'bg-smartSchool-yellow/90 text-smartSchool-blue border-smartSchool-yellow/60' : 'bg-white/80 text-gray-400 border-gray-200 hover:bg-smartSchool-yellow/40 hover:text-smartSchool-blue'}`}
                onClick={() => setPinned(p => ({ ...p, [i]: !p[i] }))}
                aria-label={pinned[i] ? 'Unpin thread' : 'Pin thread'}
                type="button"
              >
                {pinned[i] ? '📌 Pinned' : '📌 Pin'}
              </button>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-7 rounded-full bg-smartSchool-blue/20 flex items-center justify-center text-xs font-bold text-smartSchool-blue border-2 border-smartSchool-blue/30 shadow-sm">
                  {getInitials(t.author)}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-smartSchool-blue font-semibold text-xs group-hover:underline">{t.author}</span>
                  <span className="text-gray-700 text-xs font-poppins break-words whitespace-pre-line">{t.text}</span>
                  {/* Tags */}
                  <div className="flex gap-1 mt-0.5 flex-wrap">
                    {TAGS.map((tag, tagIdx) => (
                      <button
                        key={tag.label}
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${tag.color} border-gray-200 hover:scale-105 transition ${threadTags[i]===tag.label?'ring-2 ring-smartSchool-blue/40':''}`}
                        onClick={() => setThreadTags(tt => ({ ...tt, [i]: tt[i]===tag.label?null:tag.label }))}
                        aria-label={`Tag as ${tag.label}`}
                      >
                        {tag.label}
                      </button>
                    ))}
                    {threadTags[i] && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-smartSchool-blue/20 text-smartSchool-blue text-[10px] font-bold">{threadTags[i]}</span>}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 ml-1">{t.createdAt ? new Date(t.createdAt).toLocaleString() : <span className="inline-block bg-smartSchool-yellow/80 text-smartSchool-blue px-1.5 py-0.5 rounded font-bold ml-1">NEW</span>}</span>
              </div>
              {/* Turn In and View Responses section */}
              <div className="flex flex-col gap-1 bg-white/80 rounded-lg p-2 border border-smartSchool-blue/10">
                <div className="flex gap-1 items-end w-full flex-wrap">
                  <input
                    value={responseAuthors[i] || ''}
                    onChange={e => setResponseAuthors(a => ({ ...a, [i]: e.target.value }))}
                    placeholder="Your name (optional)"
                    className="w-24 px-1 py-0.5 rounded border border-smartSchool-blue/20 text-xs focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/20 shadow min-w-0"
                    maxLength={24}
                    aria-label="Response author name"
                  />
                  <input
                    value={responseInputs[i] || ''}
                    onChange={e => setResponseInputs(inp => ({ ...inp, [i]: e.target.value }))}
                    placeholder="Write your response..."
                    className="flex-1 px-2 py-1 rounded border border-smartSchool-blue/30 text-xs focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/30 shadow min-w-0"
                    maxLength={120}
                    aria-label="Response text"
                  />
                  <button
                    onClick={() => handleTurnIn(i)}
                    className="px-2 py-1 rounded bg-smartSchool-yellow/90 hover:bg-smartSchool-yellow font-semibold text-gray-800 text-xs shadow-sm transition disabled:opacity-50 border border-smartSchool-yellow/40 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/30"
                    disabled={!responseInputs[i] || !responseInputs[i].trim()}
                    aria-label="Turn in response"
                  >
                    Turn In
                  </button>
                  <button
                    onClick={() => setShowResponses(s => ({ ...s, [i]: !s[i] }))}
                    className="px-2 py-1 rounded bg-smartSchool-blue/10 hover:bg-smartSchool-blue/20 text-smartSchool-blue text-xs font-semibold transition border border-smartSchool-blue/10 focus:outline-none focus:ring-2 focus:ring-smartSchool-yellow/30"
                    aria-label={showResponses[i] ? 'Hide responses' : 'Show responses'}
                  >
                    {showResponses[i] ? 'Hide' : 'See'} Responses <span className="ml-1">{(responses[i]?.length || 0)}</span>
                  </button>
                </div>
                {showResponses[i] && (
                  <div className="mt-2">
                    <div className="mb-1 text-smartSchool-blue font-bold text-xs border-b border-smartSchool-blue/20 pb-0.5">Responses</div>
                    <div className="bg-white border border-smartSchool-blue/10 rounded p-2 text-xs max-h-32 overflow-y-auto">
                      {(responses[i] && responses[i].length > 0) ? (
                        <ul className="space-y-1">
                          {responses[i].map((resp, ridx) => (
                            <li key={ridx} className="flex items-center gap-1 text-gray-700 bg-smartSchool-blue/5 rounded px-1.5 py-0.5 shadow-sm group/resp">
                              <span className="w-5 h-5 rounded-full bg-smartSchool-yellow/60 flex items-center justify-center text-[10px] font-bold text-smartSchool-blue border border-smartSchool-yellow/30">{getInitials(resp.author)}</span>
                              <span className="font-semibold text-smartSchool-blue/90 text-xs">{resp.author}:</span>
                              <span className="break-words whitespace-pre-line">{resp.text}</span>
                              <button
                                className="ml-auto px-1 py-0.5 rounded bg-smartSchool-blue/10 hover:bg-smartSchool-blue/30 text-smartSchool-blue text-[10px] font-bold transition focus:outline-none focus:ring-2 focus:ring-smartSchool-yellow/30"
                                aria-label="Like response"
                                tabIndex={0}
                                title="Like this response"
                                onClick={() => handleLike(i, ridx)}
                              >
                                👍 <span className="ml-0.5">{likeCounts[`${i}-${ridx}`] || 0}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">No responses yet.</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex w-full gap-2 mb-2 items-end sticky bottom-0 bg-white pt-2 pb-2 z-10 border-t border-gray-100">
        <input
          value={author}
          onChange={e => { setAuthor(e.target.value); setSuccess(false); setError(null); }}
          placeholder="Your name (optional)"
          aria-label="Your name"
          disabled={loading}
          className="flex-1 px-2 py-1 rounded border-2 border-smartSchool-blue/30 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/40 text-xs shadow min-w-0"
        />
        <input
          value={newThread}
          onChange={e => { setNewThread(e.target.value); setSuccess(false); setError(null); }}
          placeholder="Start a new thread... (e.g. 'What is a black hole?')"
          aria-label="New thread text"
          disabled={loading}
          className="flex-[2] px-2 py-1 rounded border-2 border-smartSchool-blue/30 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/40 text-xs shadow min-w-0"
          maxLength={120}
        />
        <button
          onClick={handlePost}
          disabled={loading || !newThread.trim()}
          aria-label="Post new thread"
          className={`flex-shrink-0 px-3 py-1.5 h-full rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-smartSchool-blue/60 bg-smartSchool-blue text-white hover:bg-blue-700 active:scale-95 whitespace-nowrap text-xs ${loading || !newThread.trim() ? 'opacity-60 cursor-not-allowed' : ''}`}
          style={{ minWidth: 70, marginLeft: 2 }}
        >
          {loading ? 'Posting...' : 'Start New Thread'}
        </button>
      </div>
      {/* Interactive enhancements below */}
      <div className="w-full flex flex-col gap-1 mb-1">
        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span>Characters: {newThread.length}/120</span>
          <button
            type="button"
            className="px-1.5 py-0.5 rounded bg-smartSchool-yellow/60 hover:bg-smartSchool-yellow text-xs font-semibold text-gray-800 shadow-sm transition"
            onClick={() => setNewThread(newThread + ' 😊')}
            disabled={loading || newThread.length >= 120}
            aria-label="Add emoji"
          >
            + Emoji
          </button>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-600 flex-wrap">
          <span className="font-semibold">Need inspiration?</span>
          <button
            type="button"
            className="underline text-smartSchool-blue hover:text-blue-700"
            onClick={() => setNewThread('What is the coolest science fact you know?')}
            disabled={loading}
          >
            Try a fun prompt
          </button>
          <button
            type="button"
            className="underline text-smartSchool-blue hover:text-blue-700"
            onClick={() => setNewThread('Can someone explain how fractions work?')}
            disabled={loading}
          >
            Ask about math
          </button>
        </div>
      </div>
      {success && <span className="text-green-600 font-semibold animate-bounce mt-1 text-xs">Posted!</span>}
      {error && <div className="text-red-500 font-semibold animate-shake mt-1 text-xs">{error}</div>}
      <div className="mt-2 text-gray-500 text-xs text-center">Share your thoughts and questions with the community!</div>
    </div>
  );
}
