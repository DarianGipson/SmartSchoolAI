import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { generatePersonalizedAssignment as generateStubAssignment } from '@/lib/aiAssignmentEngine.js';
import { updateStudentProfile } from '@/lib/updateStudentProfile';
import { buildLessonFeedback } from '@/lib/aiAssignmentFeedback';
import API_BASE from '../../lib/apiBase';

async function fetchAIAssignment(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/generate-assignment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('AI backend error');
    return await res.json();
  } catch (e) {
    // fallback to stub if backend fails
    return await generateStubAssignment(payload);
  }
}

const AssignmentEngine = ({ lessonId, lessonData }) => {
  const { user } = useAuth();
  const [assignment, setAssignment] = useState(null);
  const [responses, setResponses] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchAssignment = async () => {
      setLoading(true);
      const studentProfile = user ? { name: user.name, grade: user.grade, progress: {}, learningStyle: user.learningStyle || localStorage.getItem('learningStyle') } : {};
      const aiAssignment = await fetchAIAssignment({
        userId: user.uid,
        lessonId,
        lessonData,
        learningStyle: studentProfile.learningStyle,
        studentProfile
      });
      setAssignment(aiAssignment);
      setLoading(false);
    };
    if (user && lessonId && lessonData) fetchAssignment();
  }, [user, lessonId, lessonData]);

  const handleResponse = (qId, value) => {
    setResponses((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    const studentProfile = user ? { name: user.name, grade: user.grade, progress: {}, learningStyle: user.learningStyle || localStorage.getItem('learningStyle') } : {};
    const aiFeedback = await fetchAIAssignment({
      userId: user.uid,
      lessonId,
      lessonData,
      responses,
      learningStyle: studentProfile.learningStyle,
      studentProfile
    });
    setFeedback(aiFeedback.feedback || {});
    await setDoc(doc(db, 'progress', `${user.uid}_${lessonId}`), {
      userId: user.uid,
      lessonId,
      responses,
      feedback: aiFeedback.feedback,
      score: aiFeedback.score,
      completedAt: new Date().toISOString()
    });
    // --- Feedback loop: update student profile ---
    const endTime = Date.now();
    const feedbackObj = buildLessonFeedback({
      assignment,
      responses,
      aiFeedback,
      startTime,
      endTime
    });
    await updateStudentProfile({
      student_id: user.uid,
      subject: lessonData.subject,
      feedback: feedbackObj
    });
  };

  if (loading) return <div>Loading your personalized assignment...</div>;
  if (!assignment) return <div>No assignment available.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-smartSchool-blue">Your AI-Personalized Assignment</h2>
      {assignment.questions.map((q) => (
        <div key={q.id} className="mb-4">
          <div className="font-semibold mb-2">{q.prompt}</div>
          {q.type === 'multiple-choice' && (
            <div className="space-y-2">
              {q.choices.map((choice, idx) => (
                <label key={idx} className="block">
                  <input type="radio" name={q.id} value={choice} checked={responses[q.id] === choice} onChange={() => handleResponse(q.id, choice)} /> {choice}
                </label>
              ))}
            </div>
          )}
          {q.type === 'short-answer' && (
            <input className="border rounded p-2 w-full" value={responses[q.id] || ''} onChange={e => handleResponse(q.id, e.target.value)} />
          )}
          {feedback[q.id] && <div className="text-green-600 mt-1">{feedback[q.id]}</div>}
        </div>
      ))}
      <button className="bg-smartSchool-yellow text-smartSchool-blue font-bold py-2 px-6 rounded-xl" onClick={handleSubmit}>Submit Assignment</button>
    </div>
  );
};

export default AssignmentEngine;
