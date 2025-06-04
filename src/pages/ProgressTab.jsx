import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import ProgressTracker from '../components/ui/ProgressTracker';
import { CurriculumContext } from '../contexts/CurriculumContext';
import { AuthContext } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { BarChart3, Award, Flame, CalendarCheck, BookOpenText, Download, MessageCircle, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import jsPDF from 'jspdf';
import API_BASE from '../lib/apiBase';

const fetchStudentProgress = async (userId) => {
  const res = await fetch(`${API_BASE}/api/progress?userId=${userId}`);
  if (!res.ok) return null;
  return await res.json();
};

const COLORS = ['#2563eb', '#ef4444', '#facc15', '#10b981', '#a21caf', '#f59e42', '#6366f1', '#eab308'];

const ProgressTab = () => {
  const { user } = useContext(AuthContext);
  const { curriculumData } = useContext(CurriculumContext);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      fetchStudentProgress(user.id).then(data => {
        setProgress(data.progress || {});
        setLoading(false);
      });
    }
  }, [user]);

  const handleExportCSV = () => {
    let csv = 'Subject,Completed,Total\n';
    subjectProgress.forEach(subj => {
      csv += `${subj.name},${subj.completed},${subj.total}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'progress.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Progress Report', 10, 10);
    subjectProgress.forEach((subj, idx) => {
      doc.text(`${subj.name}: ${subj.completed}/${subj.total}`, 10, 20 + idx * 10);
    });
    doc.save('progress.pdf');
  };

  if (loading) return <div className="text-center py-8">Loading progress...</div>;

  // Calculate subject-wise progress
  const subjects = curriculumData ? Object.keys(curriculumData) : [];
  const completedLessons = progress.completedLessons || [];
  const totalLessons = subjects.reduce((sum, subj) => sum + (curriculumData[subj]?.length || 0), 0);

  // Subject progress breakdown
  const subjectProgress = subjects.map(subj => {
    const lessons = curriculumData[subj] || [];
    const completed = lessons.filter(lesson => completedLessons.includes(lesson.id)).length;
    return { name: subj, completed, total: lessons.length };
  });

  // Data for charts
  const barData = subjectProgress.map((subj) => ({
    name: subj.name,
    Completed: subj.completed,
    Remaining: subj.total - subj.completed,
  }));
  const pieData = [
    { name: 'Completed', value: completedLessons.length },
    { name: 'Remaining', value: totalLessons - completedLessons.length },
  ];

  // Streaks, badges, recent activity (mocked for now)
  const streak = progress.streak || 0;
  const badges = progress.badges || ['Starter', 'Achiever'];
  const recent = progress.recentActivity || [];

  return (
    <motion.div className="w-full max-w-3xl mx-auto py-8 space-y-8">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="flex flex-row items-center space-x-3">
          <BarChart3 size={28} className="text-smartSchool-blue" />
          <CardTitle className="text-2xl">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <button onClick={handleExportCSV} className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
              <Download size={18} className="mr-1" /> Export CSV
            </button>
            <button onClick={handleExportPDF} className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
              <Download size={18} className="mr-1" /> Export PDF
            </button>
          </div>
          <ProgressTracker completed={completedLessons.length} total={totalLessons} />
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="bg-blue-50 rounded-xl px-4 py-2 flex items-center space-x-2">
              <Flame className="text-orange-500" size={20} />
              <span className="font-semibold">Streak:</span>
              <span>{streak} days</span>
            </div>
            <div className="bg-yellow-50 rounded-xl px-4 py-2 flex items-center space-x-2">
              <Award className="text-yellow-500" size={20} />
              <span className="font-semibold">Badges:</span>
              <span>{badges.join(', ')}</span>
            </div>
            <div className="bg-red-50 rounded-xl px-4 py-2 flex items-center space-x-2">
              <Bell className="text-red-500" size={20} />
              <span className="font-semibold">Notifications:</span>
              <span>{progress.notifications?.length || 0}</span>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-8 mt-8 items-center justify-center">
            <div className="w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full max-w-md">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Completed" stackId="a" fill="#2563eb" />
                  <Bar dataKey="Remaining" stackId="a" fill="#facc15" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="flex flex-row items-center space-x-3">
          <BookOpenText size={28} className="text-smartSchool-red" />
          <CardTitle className="text-2xl">Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjectProgress.map(subj => (
              <div key={subj.name} className="mb-2">
                <div className="font-semibold text-smartSchool-blue mb-1">{subj.name}</div>
                <ProgressTracker completed={subj.completed} total={subj.total} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="flex flex-row items-center space-x-3">
          <MessageCircle size={28} className="text-smartSchool-blue" />
          <CardTitle className="text-2xl">Milestones & Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
            {(progress.milestones || []).map((m, idx) => (
              <li key={idx}><span className="font-semibold">{m.title}:</span> {m.description} <span className="text-xs text-gray-400">({m.date})</span></li>
            ))}
          </ul>
          <div className="mb-2">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Parent/Teacher Comment:</label>
            <textarea id="comment" className="w-full border rounded p-2" rows={2} placeholder="Leave encouragement or feedback..." />
            <button className="mt-2 px-3 py-1 bg-smartSchool-blue text-white rounded hover:bg-blue-700 transition">Submit</button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="flex flex-row items-center space-x-3">
          <CalendarCheck size={28} className="text-green-600" />
          <CardTitle className="text-2xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="text-gray-500">No recent activity yet.</div>
          ) : (
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {recent.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressTab;
