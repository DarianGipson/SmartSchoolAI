import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { generateLesson } from '@/lib/aiSchoolHooks';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const LessonsPage = () => {
  const { grade, subject } = useParams();
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favoriteLessons');
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Fetch lessons for this student, grade, and subject from Firestore
    const fetchLessons = async () => {
      const lessonsRef = collection(db, 'students', user.uid, 'lessons');
      const snapshot = await getDocs(lessonsRef);
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(lesson => lesson.grade === grade && lesson.subject === subject);
      setLessons(filtered);
      setCompletedLessons(filtered.filter(l => l.completed).map(l => l.id));
      setLoading(false);
    };
    fetchLessons();
  }, [user, grade, subject]);

  const toggleFavorite = (lessonId) => {
    setFavorites((prev) => {
      const updated = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem('favoriteLessons', JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) return <div>Loading lessons...</div>;
  if (!lessons.length) return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="mb-4">No lessons available for this subject.</p>
      <button
        className="bg-smartSchool-blue text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-smartSchool-blue/90 disabled:opacity-60"
        onClick={async () => {
          setGenerating(true);
          setError(null);
          try {
            await generateLesson({
              studentId: user.uid,
              lessonData: { grade, subject }
            });
            window.location.reload();
          } catch (e) {
            setError('Failed to generate lesson.');
          } finally {
            setGenerating(false);
          }
        }}
        disabled={generating}
      >
        {generating ? 'Generating Lesson...' : 'Generate AI Lesson'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {lessons.map((lesson) => {
        const isCompleted = completedLessons.includes(lesson.id);
        return (
          <motion.div key={lesson.id} variants={cardVariants}>
            <div
              className={`p-6 bg-white shadow rounded-lg hover:shadow-lg transition ${isCompleted ? 'bg-green-100 border border-green-500' : 'border border-gray-300'}`}
            >
              <h2 className="text-xl font-semibold text-gray-800">{lesson.title}</h2>
              <p className="text-gray-600">{lesson.content}</p>
              {lesson.duration && (
                <p className="text-sm text-blue-700 mt-1">Duration: {lesson.duration}</p>
              )}
              {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                <p className="text-sm text-purple-700 mt-1">Prerequisites: {lesson.prerequisites.join(', ')}</p>
              )}
              {lesson.teacherNotes && (
                <p className="text-xs text-gray-500 italic mt-1">Teacher Notes: {lesson.teacherNotes}</p>
              )}
              <div className="mt-4 flex items-center gap-3">
                <Link
                  to={`/curriculum/${encodeURIComponent(grade)}/${encodeURIComponent(subject)}/${encodeURIComponent(lesson.id)}`}
                  className={`px-4 py-2 rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isCompleted ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  aria-disabled={isCompleted ? 'true' : 'false'}
                  tabIndex={isCompleted ? -1 : 0}
                  onClick={e => { if (isCompleted) e.preventDefault(); }}
                >
                  {isCompleted ? 'Lesson Completed' : 'Start Lesson'}
                </Link>
                <button
                  className={`ml-2 text-xl ${favorites.includes(lesson.id) ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-500`}
                  title={favorites.includes(lesson.id) ? 'Unfavorite' : 'Favorite'}
                  onClick={() => toggleFavorite(lesson.id)}
                  aria-label="Favorite lesson"
                  type="button"
                >
                  ★
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default LessonsPage;