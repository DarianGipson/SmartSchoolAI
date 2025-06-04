import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProgressTracker from '@/components/ui/ProgressTracker';
import Quiz from '@/components/ui/Quiz';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import OnboardingLearningStyle from '@/components/OnboardingLearningStyle';
import { updateStudentProfile } from '@/lib/updateStudentProfile';

Chart.register(ArcElement, Tooltip, Legend);

const UserHomePage = () => {
  const { user, students, addStudent, updateStudent, deleteStudent } = useAuth();
  const [newStudent, setNewStudent] = React.useState({ name: '', grade: '' });
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [formError, setFormError] = React.useState('');
  const [quizStudentId, setQuizStudentId] = React.useState(null);
  const [quizLoading, setQuizLoading] = React.useState(false);

  // Helper for avatar upload (mock)
  const handleAvatarUpload = (e, studentId, fromModal = false) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (fromModal && selectedStudent) {
        setSelectedStudent(s => ({ ...s, avatarUrl: url }));
      } else {
        updateStudent({ ...students.find(s => s.id === studentId), avatarUrl: url });
      }
    }
  };

  // Update button: open modal to edit student
  const handleUpdate = (student) => {
    setSelectedStudent({ ...student, editMode: true });
  };

  // Save changes from modal
  const handleSave = async (updatedStudent) => {
    // Ensure we only update if something changed
    const prev = students.find(s => s.id === updatedStudent.id);
    if (!prev || (prev.name === updatedStudent.name && prev.grade === updatedStudent.grade && prev.avatarUrl === updatedStudent.avatarUrl)) {
      setSelectedStudent(null);
      return;
    }
    try {
      await updateStudent(updatedStudent);
    } catch (e) {
      alert('Failed to update student.');
    }
    setSelectedStudent(null);
  };

  // Delete button: confirm before deleting
  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId);
        if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent(null);
        }
      } catch (e) {
        alert('Failed to delete student.');
      }
    }
  };

  // View button: open modal in view mode
  const handleView = (student) => {
    setSelectedStudent({ ...student, editMode: false });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-4">Welcome Back, {user?.name}!</h1>
      <p className="text-center text-lg">This is your personalized dashboard where you can access all your resources and tools.</p>

      {/* Auth-only navigation buttons */}
      {user && (
        <div className="flex gap-6 justify-center my-8">
          <button className="bg-blue-500 text-white font-bold px-8 py-4 rounded-lg text-lg shadow hover:bg-blue-600 transition">Tools</button>
          <button className="bg-yellow-400 text-black font-bold px-8 py-4 rounded-lg text-lg shadow hover:bg-yellow-500 transition">Curriculum</button>
          <button className="bg-red-500 text-white font-bold px-8 py-4 rounded-lg text-lg shadow hover:bg-red-600 transition">Progress</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {/* Students List */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Your Students</h2>
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <span className="text-6xl mb-2" role="img" aria-label="No students">👨‍🎓</span>
              <p className="text-gray-500 italic">No students added yet. Use the form to add your first student!</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {students.map((student) => (
                <li key={student.id} className="mb-2 p-2 bg-gray-50 rounded flex flex-col gap-1 min-h-[220px] transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Avatar: use initials or placeholder */}
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-700 relative overflow-hidden">
                        {student.avatarUrl ? (
                          <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                        )}
                        <label className="absolute bottom-0 right-0 bg-white bg-opacity-80 rounded-full p-0.5 cursor-pointer text-xs">
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleAvatarUpload(e, student.id)} aria-label="Upload Avatar" />
                          <span role="img" aria-label="upload">📷</span>
                        </label>
                      </div>
                      <span className="font-bold text-lg text-smartSchool-blue cursor-pointer" onClick={() => setSelectedStudent(student)}>{student.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">Grade: <span className="font-semibold">{student.grade}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Progress: {student.progress ? `${student.progress}%` : 'N/A'}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Last Activity: {student.lastActivity ? student.lastActivity : 'N/A'}</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">Current Subject: {student.currentSubject ? student.currentSubject : 'N/A'}</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">Mastery Level: {student.masteryLevel ?? 'N/A'}</span>
                    <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs">Badges: {student.badges ? student.badges.join(', ') : 'None'}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">Streak: {student.streak ?? 0} days</span>
                  </div>
                  <div className="relative w-24 h-24 mx-auto mt-2">
                    <Doughnut
                      data={{
                        labels: ['Progress', 'Remaining'],
                        datasets: [
                          {
                            data: [student.progress || 0, 100 - (student.progress || 0)],
                            backgroundColor: ['#34d399', '#e5e7eb'],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        cutout: '70%',
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: true },
                        },
                        maintainAspectRatio: false,
                        responsive: true,
                      }}
                    />
                    <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center pointer-events-none">
                      <span className="text-lg font-semibold text-green-700">{student.progress ? `${student.progress}%` : '0%'}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                    <div className="h-2 bg-green-400 rounded-full" style={{width: student.progress ? `${student.progress}%` : '0%'}}></div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 active:bg-green-700 transition" onClick={() => handleUpdate(student)}>Update</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition" onClick={() => handleDelete(student.id)}>Delete</button>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition" onClick={() => handleView(student)}>View</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Student Section */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold">Add a Student</h2>
          <form
            className="flex flex-col gap-2"
            onSubmit={e => {
              e.preventDefault();
              if (!newStudent.name || !newStudent.grade) {
                setFormError('Please enter both name and grade.');
                return;
              }
              addStudent({ ...newStudent });
              setNewStudent({ name: '', grade: '' });
              setFormError('');
            }}
          >
            <input
              className="border rounded px-2 py-1"
              placeholder="Student Name"
              value={newStudent.name}
              onChange={e => setNewStudent(s => ({ ...s, name: e.target.value }))}
              required
              aria-label="Student Name"
            />
            <input
              className="border rounded px-2 py-1"
              placeholder="Grade (e.g. Grade 1)"
              value={newStudent.grade}
              onChange={e => setNewStudent(s => ({ ...s, grade: e.target.value }))}
              required
              aria-label="Student Grade"
            />
            {formError && <span className="text-red-500 text-xs">{formError}</span>}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition">Add Student</button>
          </form>
        </div>

        {/* Manage Students Section */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold">Manage Students</h2>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => students[0] && updateStudent({ id: students[0].id, name: 'Updated Name', grade: 'Grade 2' })}
          >
            Update First Student
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => students[0] && deleteStudent(students[0].id)}
          >
            Delete First Student
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="p-4 border rounded shadow">
          <h2 className="text-xl font-semibold">Progress Tracker</h2>
          <ProgressTracker />
        </div>

        {/* Student Details Modal/Section */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fadeIn overflow-hidden">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setSelectedStudent(null)} aria-label="Close Modal">&times;</button>
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-700 overflow-hidden relative group">
                  {selectedStudent.avatarUrl ? (
                    <img src={selectedStudent.avatarUrl} alt={selectedStudent.name} className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    selectedStudent.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  )}
                  {selectedStudent.editMode && (
                    <label className="absolute bottom-0 right-0 bg-white bg-opacity-80 rounded-full p-1 cursor-pointer text-xs shadow group-hover:bg-opacity-100 transition" title="Change photo">
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleAvatarUpload(e, selectedStudent.id, true)} aria-label="Upload Avatar" />
                      <span role="img" aria-label="upload">📷</span>
                    </label>
                  )}
                </div>
                {selectedStudent.editMode ? (
                  <>
                    <input
                      className="border rounded px-2 py-1 w-full mt-2"
                      value={selectedStudent.name}
                      onChange={e => setSelectedStudent(s => ({ ...s, name: e.target.value }))}
                      aria-label="Edit Student Name"
                    />
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={selectedStudent.grade}
                      onChange={e => setSelectedStudent(s => ({ ...s, grade: e.target.value }))}
                      aria-label="Edit Student Grade"
                    />
                    <button className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600 active:bg-green-700 transition" onClick={() => handleSave(selectedStudent)}>Save</button>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                    <p className="text-gray-600">Grade: {selectedStudent.grade}</p>
                    <p className="text-gray-600">Progress: {selectedStudent.progress ? `${selectedStudent.progress}%` : 'N/A'}</p>
                    <p className="text-gray-600">Last Activity: {selectedStudent.lastActivity || 'N/A'}</p>
                    <p className="text-gray-600">Current Subject: {selectedStudent.currentSubject || 'N/A'}</p>
                    <p className="text-gray-600">Mastery Level: {selectedStudent.masteryLevel ?? 'N/A'}</p>
                    <p className="text-gray-600">Badges: {selectedStudent.badges ? selectedStudent.badges.join(', ') : 'None'}</p>
                    <p className="text-gray-600">Streak: {selectedStudent.streak ?? 0} days</p>
                    {/* Learning Style Quiz for this student */}
                    <div className="mt-4 w-full">
                      <h4 className="text-lg font-semibold mb-2">Learning Style Quiz</h4>
                      {quizStudentId === selectedStudent.id ? (
                        <OnboardingLearningStyle
                          grade={selectedStudent.grade}
                          onComplete={async (style) => {
                            setQuizLoading(true);
                            try {
                              await updateStudentProfile({
                                student_id: selectedStudent.id,
                                subject: 'general',
                                feedback: { style_pref: style }
                              });
                              setSelectedStudent(s => s ? { ...s, learningStyle: style } : s);
                            } catch (e) {
                              alert('Failed to update learning style.');
                            }
                            setQuizStudentId(null);
                            setQuizLoading(false);
                          }}
                        />
                      ) : (
                        <>
                          <p className="mb-2">Current: <span className="capitalize font-semibold">{selectedStudent.learningStyle || 'Not set'}</span></p>
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            onClick={() => setQuizStudentId(selectedStudent.id)}
                            disabled={quizLoading}
                          >
                            {quizLoading ? 'Saving...' : 'Take/Retake Quiz'}
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* More Content Section: Recommendations, Achievements, and Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 dashboard-bottom-section">
        {/* Recommendations */}
        <div className="p-4 border rounded shadow flex flex-col justify-between min-h-[180px] bg-white">
          <h2 className="text-xl font-semibold mb-2">Recommended for You</h2>
          <ul className="list-disc ml-5 text-gray-700 text-sm flex-1">
            <li>Try a new subject: <span className="font-semibold">Science Experiments</span></li>
            <li>Review your <span className="font-semibold">Math</span> progress for this week</li>
            <li>Check out the <span className="font-semibold">Art Challenge</span> of the month</li>
            <li>Practice with a <span className="font-semibold">Quiz</span> to boost your streak</li>
          </ul>
        </div>
        {/* Achievements */}
        <div className="p-4 border rounded shadow flex flex-col justify-between min-h-[180px] bg-white">
          <h2 className="text-xl font-semibold mb-2">Recent Achievements</h2>
          <ul className="text-sm text-gray-700 flex-1">
            <li>🏅 <span className="font-semibold">Math Whiz</span> badge earned</li>
            <li>🔥 <span className="font-semibold">7-day streak</span> reached</li>
            <li>📚 Completed <span className="font-semibold">Reading Level 2</span></li>
            <li>🎨 Submitted an <span className="font-semibold">Art Project</span></li>
          </ul>
        </div>
        {/* Quick Links */}
        <div className="p-4 border rounded shadow flex flex-col justify-between min-h-[180px] bg-white">
          <h2 className="text-xl font-semibold mb-2">Quick Links</h2>
          <div className="flex flex-col gap-2 flex-1">
            <a href="#" className="text-blue-600 hover:underline">Go to Assignments</a>
            <a href="#" className="text-blue-600 hover:underline">View All Badges</a>
            <a href="#" className="text-blue-600 hover:underline">Start a New Lesson</a>
            <a href="#" className="text-blue-600 hover:underline">Contact Your Tutor</a>
          </div>
        </div>
      </div>
      {/* Even spacing for bottom section */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease;
        }
        .min-h-\[220px\] { min-height: 220px; }
        .transition-all { transition: all 0.2s; }
        .duration-200 { transition-duration: 200ms; }
        img.object-cover { transition: opacity 0.2s; }
        @media (min-width: 768px) {
          .dashboard-bottom-section > div {
            min-height: 220px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background: #fff;
          }
        }
      `}</style>
    </div>
  );
};

export default UserHomePage;