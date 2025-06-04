import React, { useEffect } from 'react';

export default function ConfettiPopup({ show, message = 'Congratulations!', onDone }) {
  useEffect(() => {
    if (show) {
      // Play sound effect
      const audio = new Audio('/audio/confetti-pop.mp3');
      audio.play();
      // Auto-close after 2.5s
      const timer = setTimeout(() => {
        if (onDone) onDone();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onDone]);

  if (!show) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      style={{ animation: 'fadeIn 0.3s' }}
    >
      <div className="relative flex flex-col items-center bg-white rounded-3xl shadow-3xl border-4 border-smartSchool-yellow px-12 py-10 animate-bounce-in" style={{ boxShadow: '0 8px 40px 0 rgba(250,204,21,0.18), 0 2px 8px 0 rgba(0,0,0,0.10)' }}>
        <span className="text-6xl mb-3 drop-shadow-lg animate-pop" aria-hidden>🎉</span>
        <div className="text-2xl font-extrabold text-smartSchool-yellow drop-shadow-glow mb-2">{message}</div>
        <div className="text-base font-semibold text-blue-700 animate-bounce-slow mb-2">XP earned! Keep going!</div>
        {/* Enhanced confetti burst with more particles and animation */}
        <svg width="240" height="110" className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 animate-confetti-burst" aria-hidden>
          <g>
            <circle cx="20" cy="20" r="4" fill="#facc15" style={{ transform: 'rotate(-10deg) scale(1.1)' }} />
            <circle cx="60" cy="10" r="3" fill="#2563eb" style={{ transform: 'rotate(8deg) scale(1.2)' }} />
            <circle cx="100" cy="25" r="5" fill="#ef4444" style={{ transform: 'rotate(-6deg) scale(1.05)' }} />
            <circle cx="40" cy="40" r="2" fill="#22d3ee" style={{ transform: 'rotate(12deg) scale(1.3)' }} />
            <circle cx="80" cy="35" r="3" fill="#a3e635" style={{ transform: 'rotate(-15deg) scale(1.1)' }} />
            <circle cx="120" cy="15" r="4" fill="#f472b6" style={{ transform: 'rotate(5deg) scale(1.2)' }} />
            <circle cx="160" cy="30" r="3" fill="#facc15" style={{ transform: 'rotate(-8deg) scale(1.15)' }} />
            <circle cx="200" cy="20" r="5" fill="#2563eb" style={{ transform: 'rotate(10deg) scale(1.1)' }} />
            <circle cx="180" cy="50" r="2" fill="#ef4444" style={{ transform: 'rotate(-12deg) scale(1.25)' }} />
            <circle cx="140" cy="60" r="3" fill="#a3e635" style={{ transform: 'rotate(7deg) scale(1.1)' }} />
            <circle cx="60" cy="70" r="3" fill="#f472b6" style={{ transform: 'rotate(-5deg) scale(1.2)' }} />
            <circle cx="100" cy="80" r="4" fill="#22d3ee" style={{ transform: 'rotate(13deg) scale(1.15)' }} />
            <circle cx="180" cy="80" r="3" fill="#facc15" style={{ transform: 'rotate(-7deg) scale(1.1)' }} />
            {/* Extra confetti for more burst */}
            <circle cx="30" cy="90" r="2" fill="#facc15" style={{ transform: 'rotate(18deg) scale(1.3)' }} />
            <circle cx="210" cy="60" r="3" fill="#2563eb" style={{ transform: 'rotate(-18deg) scale(1.2)' }} />
            <circle cx="150" cy="90" r="2" fill="#ef4444" style={{ transform: 'rotate(15deg) scale(1.1)' }} />
          </g>
        </svg>
        {/* CSS for confetti animation and enhancements */}
        <style>{`@keyframes confetti-burst {
            0% { opacity: 0; transform: scale(0.7) translateY(-20px); }
            30% { opacity: 1; transform: scale(1.1) translateY(0); }
            100% { opacity: 0; transform: scale(0.9) translateY(40px); }
          }
          .animate-confetti-burst { animation: confetti-burst 2s cubic-bezier(.23,1.01,.32,1) forwards; }
          .drop-shadow-glow {
            text-shadow: 0 0 8px #facc15, 0 0 16px #facc15, 0 2px 4px #fff;
          }
          .animate-bounce-slow {
            animation: bounceSlow 1.6s infinite alternate cubic-bezier(.5,1.5,.5,1);
          }
          @keyframes bounceSlow {
            0% { transform: translateY(0); }
            100% { transform: translateY(-8px); }
          }
          .shadow-3xl {
            box-shadow: 0 8px 40px 0 rgba(250,204,21,0.18), 0 2px 8px 0 rgba(0,0,0,0.10);
          }
          .animate-pop {
            animation: popIn 0.5s cubic-bezier(.23,1.01,.32,1);
          }
          @keyframes popIn {
            0% { transform: scale(0.7); opacity: 0; }
            80% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }`}</style>
      </div>
    </div>
  );
}
