import React, { useState } from 'react';
import ConfettiPopup from './ConfettiPopup';

/**
 * LessonPlayer component renders a lesson JSON object interactively.
 * @param {Object} props
 * @param {Object} props.lesson - The lesson JSON object.
 * @param {Function} [props.onComplete] - Callback when lesson is completed.
 */
export default function LessonPlayer({ lesson, onComplete }) {
  const [practiceAnswers, setPracticeAnswers] = useState(Array(lesson.practice?.length || 0).fill(''));
  const [feedback, setFeedback] = useState(Array(lesson.practice?.length || 0).fill(null));
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!lesson) return <div>Loading lesson...</div>;

  const handleInputChange = (idx, value) => {
    const updated = [...practiceAnswers];
    updated[idx] = value;
    setPracticeAnswers(updated);
  };

  const checkAnswers = () => {
    const newFeedback = lesson.practice.map((q, i) => {
      const correct = String(q.answer).toLowerCase().trim() === String(practiceAnswers[i]).toLowerCase().trim();
      return correct ? '✅ Correct!' : `❌ Try again. Hint: ${q.hint}`;
    });
    setFeedback(newFeedback);
    if (newFeedback.every(f => f.startsWith('✅'))) {
      setCompleted(true);
      setShowConfetti(true);
      onComplete && onComplete();
    }
  };

  return (
    <div style={{maxWidth: 600, margin: '0 auto', fontFamily: 'Open Sans, sans-serif', position: 'relative'}}>
      <ConfettiPopup show={showConfetti} message="Awesome! Lesson Complete!" onDone={() => setShowConfetti(false)} />
      <h2 className="text-2xl font-bold animate-bounce">Lesson</h2>
      <p className="mb-4 animate-fade-in">{lesson.intro}</p>
      <ol>
        {lesson.steps?.map((step, i) => (
          <li key={i} style={{marginBottom: 16}} className="animate-slide-in">
            <div>{step.instruction}</div>
            {step.visual && <img src={step.visual} alt="Visual" style={{maxWidth: 300, display: 'block', marginTop: 8}} className="rounded-xl shadow-lg animate-pop-in" />}
          </li>
        ))}
      </ol>
      <h3 className="text-lg font-semibold mt-6 animate-pulse">Practice</h3>
      <ul style={{listStyle: 'none', padding: 0}}>
        {lesson.practice?.map((q, i) => (
          <li key={i} style={{marginBottom: 16}} className="animate-fade-in">
            <div>{q.question}</div>
            <input
              type="text"
              value={practiceAnswers[i]}
              onChange={e => handleInputChange(i, e.target.value)}
              disabled={completed}
              style={{marginRight: 8}}
              className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
            {feedback[i] && <span className={feedback[i].startsWith('✅') ? 'text-green-600 font-bold' : 'text-red-500 animate-shake'}>{feedback[i]}</span>}
          </li>
        ))}
      </ul>
      {!completed && (
        <button onClick={checkAnswers} style={{marginTop: 16}} className="bg-smartSchool-blue text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-all animate-pop-in">Check Answers</button>
      )}
      {completed && <div style={{marginTop: 16, color: 'green'}} className="font-bold"><strong>Lesson Complete!</strong></div>}
      <div style={{marginTop: 24}}>
        <strong>Progress:</strong> Completion: {lesson.progress?.completion ?? 0}%, Retries: {lesson.progress?.retryCount ?? 0}
      </div>
    </div>
  );
}
