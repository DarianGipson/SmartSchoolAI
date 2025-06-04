import React, { useState } from 'react';
import Calculator from '../components/widgets/Calculator';
import DrawingCanvas from '../components/widgets/DrawingCanvas';
import Dictionary from '../components/widgets/Dictionary';
import Microscope from '../components/widgets/Microscope';
import Scheduler from '../components/widgets/Scheduler';
import AITeacherBot from '../components/widgets/AITeacherBot';

const widgetList = [
  {
    key: 'calculator',
    label: 'Calculator',
    description: 'Smart calculator for math, science, and more.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="animate-bounce-slow">
        <rect x="8" y="8" width="32" height="32" rx="8" fill="#e0e7ff" stroke="#ef4444" strokeWidth="4"/>
        <rect x="14" y="14" width="20" height="8" rx="2" fill="#fff" stroke="#facc15" strokeWidth="2"/>
        <rect x="14" y="24" width="6" height="6" rx="2" fill="#fff" stroke="#ef4444" strokeWidth="2"/>
        <rect x="22" y="24" width="6" height="6" rx="2" fill="#fff" stroke="#2563eb" strokeWidth="2"/>
        <rect x="30" y="24" width="6" height="6" rx="2" fill="#fff" stroke="#facc15" strokeWidth="2"/>
        <rect x="14" y="32" width="14" height="4" rx="2" fill="#facc15" opacity="0.3"/>
      </svg>
    ),
    component: <Calculator advanced graphing unitConversion history memory scientificMode currencyConversion equationSolver theme="dark" voiceInput collaborative />,
  },
  {
    key: 'drawing',
    label: 'Drawing Canvas',
    description: 'Sketch, diagram, and collaborate.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="animate-wiggle">
        <rect x="8" y="8" width="32" height="32" rx="8" fill="#fef9c3" stroke="#ef4444" strokeWidth="4"/>
        <path d="M16 32c8-8 8-8 16 0" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="18" cy="18" r="2.5" fill="#2563eb"/>
        <circle cx="30" cy="18" r="2.5" fill="#ef4444"/>
        <rect x="20" y="28" width="8" height="2" rx="1" fill="#2563eb" opacity="0.3"/>
      </svg>
    ),
    component: <DrawingCanvas collaborative exportable layers aiAssist infiniteCanvas shapeDetection colorPicker undoRedo voiceInput />,
  },
  {
    key: 'dictionary',
    label: 'Dictionary',
    description: 'Definitions, synonyms, games.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="animate-fade-in">
        <rect x="10" y="10" width="28" height="28" rx="6" fill="#e0e7ff" stroke="#ef4444" strokeWidth="4"/>
        <rect x="14" y="14" width="20" height="20" rx="4" fill="#fff" stroke="#ef4444" strokeWidth="2"/>
        <text x="24" y="30" textAnchor="middle" fontSize="14" fill="#2563eb" fontWeight="bold">Aa</text>
      </svg>
    ),
    component: <Dictionary wordOfTheDay games pronunciation voiceInput imageSearch translation thesaurus quizMode />,
  },
  {
    key: 'microscope',
    label: 'Microscope',
    description: 'Virtual science exploration.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="animate-spin-slow">
        <ellipse cx="24" cy="36" rx="12" ry="3" fill="#fde68a" opacity="0.4"/>
        <rect x="20" y="12" width="8" height="18" rx="4" fill="#fff" stroke="#ef4444" strokeWidth="2.5"/>
        <rect x="22" y="10" width="4" height="8" rx="2" fill="#facc15" stroke="#ef4444" strokeWidth="1.5"/>
        <circle cx="24" cy="32" r="4" fill="#ef4444" stroke="#2563eb" strokeWidth="1.5"/>
        <path d="M28 28l6 6" stroke="#2563eb" strokeWidth="2.5"/>
      </svg>
    ),
    component: <Microscope zoom annotate cellStructures aiAnalysis virtualLabs threeDView quizMode collaborative />,
  },
  {
    key: 'scheduler',
    label: 'Scheduler',
    description: 'Plan, track, and get reminders.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="animate-pulse">
        <rect x="10" y="12" width="28" height="24" rx="6" fill="#e0e7ff" stroke="#ef4444" strokeWidth="4"/>
        <rect x="14" y="18" width="20" height="12" rx="2" fill="#fff" stroke="#facc15" strokeWidth="2"/>
        <rect x="18" y="22" width="4" height="4" rx="1.5" fill="#ef4444"/>
        <rect x="26" y="22" width="4" height="4" rx="1.5" fill="#2563eb"/>
        <rect x="22" y="26" width="4" height="4" rx="1.5" fill="#facc15"/>
      </svg>
    ),
    component: <Scheduler reminders aiSuggest calendar recurringEvents pomodoroMode notifications collaborative theme="dark" />,
  },
  {
    key: 'aiteacher',
    label: 'AI Teacher Bot',
    description: 'Instant help and explanations.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="animate-bounce">
        <ellipse cx="24" cy="36" rx="12" ry="3" fill="#fde68a" opacity="0.4"/>
        <circle cx="24" cy="20" r="10" fill="#e0e7ff" stroke="#ef4444" strokeWidth="4"/>
        <ellipse cx="24" cy="20" rx="7" ry="6" fill="#fff" stroke="#facc15" strokeWidth="2"/>
        <ellipse cx="20" cy="18" rx="1.5" ry="2" fill="#2563eb"/>
        <ellipse cx="28" cy="18" rx="1.5" ry="2" fill="#ef4444"/>
        <rect x="21" y="24" width="6" height="2" rx="1" fill="#facc15"/>
        <rect x="22" y="26" width="4" height="1.5" rx="0.75" fill="#ef4444"/>
      </svg>
    ),
    component: <AITeacherBot personalized voiceInput quizGenerator explainConcept chatHistory multiLanguage collaborative theme="dark" />,
  },
];

// Add a Tools page to showcase all widgets
export function ToolsPage() {
  const [active, setActive] = useState(null);

  return (
    <div className="min-h-[80vh] bg-white py-12 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-smartSchool-blue mb-8 font-poppins drop-shadow">Tools & Widgets</h1>
      <div className="flex flex-wrap gap-8 justify-center mb-10 w-full max-w-5xl">
        {widgetList.map(w => (
          <button
            key={w.key}
            onClick={() => setActive(w)}
            className="flex flex-col items-center justify-between bg-white hover:bg-smartSchool-yellow/30 border-2 border-smartSchool-blue/10 rounded-2xl p-6 w-56 h-56 shadow-md hover:shadow-lg transition group focus:outline-none focus:ring-2 focus:ring-smartSchool-blue min-w-[12rem]"
            aria-label={w.label}
          >
            <span className="mb-2 text-5xl group-hover:scale-110 transition-transform drop-shadow-sm">{w.icon}</span>
            <span className="font-semibold text-lg text-gray-800 group-hover:text-smartSchool-blue text-center font-poppins tracking-tight mb-1">{w.label}</span>
            <span className="text-xs text-gray-500 text-center leading-tight">{w.description}</span>
          </button>
        ))}
      </div>
      {active && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-2xl w-full relative border-2 border-smartSchool-blue/20 max-h-[90vh] overflow-y-auto flex flex-col items-center">
            <button onClick={() => setActive(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition-colors" aria-label="Close tool">×</button>
            <div className="flex flex-col items-center mb-4">
              <span className="text-5xl mb-2">{active.icon}</span>
              <h2 className="text-center font-bold text-2xl font-poppins text-smartSchool-blue tracking-tight drop-shadow mb-1">{active.label}</h2>
              <div className="text-sm text-gray-600 text-center mb-2 max-w-md">{active.description}</div>
            </div>
            <div className="w-full flex flex-col items-center">{active.component}</div>
          </div>
        </div>
      )}
    </div>
  );
}