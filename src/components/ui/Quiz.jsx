import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';

const Quiz = ({ quiz }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleChange = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.forEach((q) => {
      if (answers[q.id] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  if (!quiz || quiz.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Quiz</h2>
      {quiz.map((q) => (
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <p className="font-openSans mb-2">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  disabled={submitted}
                  onChange={() => handleChange(q.id, opt)}
                  checked={answers[q.id] === opt}
                  className="form-radio h-4 w-4"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </motion.div>
      ))}
      {!submitted ? (
        <Button onClick={handleSubmit} className="mt-2">
          Submit Quiz
        </Button>
      ) : (
        <p className="mt-4 font-semibold">
          You scored {score}/{quiz.length}
        </p>
      )}
    </div>
  );
};

export default Quiz;
