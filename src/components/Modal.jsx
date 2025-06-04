import React, { useEffect, useRef } from 'react';

export default function Modal({ open, onClose, title, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // Trap focus
    const focusable = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable && focusable.length) focusable[0].focus();
    // ESC to close
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Optional: close modal on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-pop-in" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="modal-title" className="text-2xl font-bold mb-4 text-smartSchool-blue">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
}
