import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLesson } from '@/lib/aiSchoolHooks';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AssignmentEngine from '@/components/widgets/AssignmentEngine';
import MultiModalLesson from '@/components/MultiModalLesson';

const LessonPage = () => {
  const { grade, subject, lessonId } = useParams();
  const { user } = useAuth();
  const { lesson, loading } = useLesson(user?.uid, lessonId);
  const [marking, setMarking] = useState(false);
  const [activeActivity, setActiveActivity] = useState(null);

  const isCompleted = lesson?.completed;

  const handleMarkComplete = async () => {
    if (!user || !lessonId) return;
    setMarking(true);
    await updateDoc(doc(db, 'students', user.uid, 'lessons', lessonId), { completed: true });
    setMarking(false);
  };

  const handleStartActivity = (activity) => setActiveActivity(activity);

  if (loading) return <div>Loading lesson...</div>;
  if (!lesson) return <div className="p-8 text-center text-red-500">Lesson not found</div>;

  // Prepare studentProfile for AI engine (fallbacks for demo)
  const studentProfile = user?.profile || {
    id: user?.uid,
    name: user?.name,
    grade: grade,
    strengths: [],
    weaknesses: [],
    mastery: {},
    mood: 'neutral',
    // ...add more fields as needed
  };

  // Use lesson data for topic if available, fallback to lessonId
  const topic = lesson?.topic || lesson?.title || lessonId;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-10">
        <MultiModalLesson
          studentProfile={studentProfile}
          grade={grade}
          subject={subject}
          topic={topic}
          // TODO: Pass audioUrl, videoUrl, simUrl if available from lesson or AI engine
        />
        {/* Optionally, keep legacy content below for reference or remove if not needed */}
        {/* <div className="flex flex-col sm:flex-row justify-between items-start mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-0">{lesson.title}</h1>
          {isCompleted && (
            <span className="mt-2 sm:mt-0 ml-0 sm:ml-4 px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full self-start">
              Completed
            </span>
          )}
        </div>
        {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-300 shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Learning Objectives</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {lesson.learningObjectives.map((obj, index) => (
                <li key={index} className="text-lg">{obj}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="prose prose-lg max-w-none mb-10 text-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Lesson Content</h2>
          <p className="whitespace-pre-wrap">{lesson.content}</p>
          {lesson.duration && (
            <p className="text-sm text-blue-700 mt-2">Duration: {lesson.duration}</p>
          )}
          {lesson.prerequisites && lesson.prerequisites.length > 0 && (
            <p className="text-sm text-purple-700 mt-1">Prerequisites: {lesson.prerequisites.join(', ')}</p>
          )}
          {lesson.teacherNotes && (
            <p className="text-xs text-gray-500 italic mt-1">Teacher Notes: {lesson.teacherNotes}</p>
          )}
        </div>
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Resources</h3>
            <ul className="list-disc list-inside">
              {lesson.resources.map((res, idx) => (
                <li key={idx}>
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{res.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {lesson.attachments && lesson.attachments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Attachments</h3>
            <ul className="list-disc list-inside">
              {lesson.attachments.map((att, idx) => (
                <li key={idx}>
                  <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{att.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {lesson.videos && lesson.videos.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {lesson.videos.map((video) => (
                <div key={video.id} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">{video.title}</h3>
                  <div className="aspect-video bg-gray-800 rounded-md flex items-center justify-center text-white mb-3">
                    <p className="text-lg">Video: <a href={video.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-300">{video.url}</a></p>
                  </div>
                  {video.description && <p className="text-md text-gray-600">{video.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        {lesson.activities && lesson.activities.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">Activities</h2>
            {lesson.activities.map((activity) => (
              <div key={activity.id} className="bg-yellow-50 p-6 rounded-lg shadow-md mb-6 border border-yellow-300">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">{activity.title}</h3>
                <p className="text-md text-gray-700 mb-1"><span className="font-semibold">Type:</span> {activity.type}</p>
                {activity.description && <p className="text-md text-gray-700 mb-4">{activity.description}</p>}
                <button
                  className="mt-3 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                  onClick={() => handleStartActivity(activity)}
                >
                  Start Activity
                </button>
              </div>
            ))}
            {activeActivity && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-lg w-full relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                    onClick={() => setActiveActivity(null)}
                    aria-label="Close activity"
                  >
                    ×
                  </button>
                  <h3 className="text-2xl font-bold mb-4 text-yellow-700">{activeActivity.title}</h3>
                  <p className="mb-2 text-gray-700"><span className="font-semibold">Type:</span> {activeActivity.type}</p>
                  <p className="mb-4 text-gray-700">{activeActivity.description}</p>
                  <div className="mt-4">
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => setActiveActivity(null)}
                    >
                      Finish Activity
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {lesson.homework && lesson.homework.length > 0 && (
          <div className="mb-10 p-6 bg-indigo-50 rounded-lg border border-indigo-300 shadow-sm">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Homework</h2>
            {lesson.homework.map((hw) => (
              <div key={hw.id} className="text-lg">
                <h3 className="font-semibold text-gray-700">{hw.title}</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{hw.description}</p>
              </div>
            ))}
          </div>
        )}
        {lesson.quiz && lesson.quiz.length > 0 && (
           <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">Quiz</h2>
            {lesson.quiz.map((q, qIndex) => (
              <div key={q.id || qIndex} className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                <p className="text-xl text-gray-800 font-medium mb-4">{q.question}</p>
                <ul className="space-y-3">
                  {q.options.map((option, index) => (
                    <li key={index} 
                        className="block w-full p-4 border border-gray-300 rounded-lg text-left text-gray-700 hover:bg-gray-100 focus:bg-gray-200 transition-colors cursor-pointer"
                        onClick={() => alert(`You selected: ${option}`)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
                {q.feedback && <p className="text-md text-blue-700 mt-4 p-3 bg-blue-50 rounded-md border border-blue-200"><strong>Feedback:</strong> {q.feedback}</p>}
              </div>
            ))}
          </div>
        )}
        <div className="mb-10">
          <AssignmentEngine lessonId={lessonId} lessonData={lesson} />
        </div>
        {!isCompleted && (
          <button 
            onClick={handleMarkComplete} 
            className="w-full mt-6 px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 shadow-md"
            disabled={marking}
          >
            {marking ? 'Marking as Completed...' : 'Mark as Completed'}
          </button>
        )} */}
      </div>
    </div>
  );
};

export default LessonPage;
