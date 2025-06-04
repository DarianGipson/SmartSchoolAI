import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming Select is created
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, User, Trash2, Edit3, Users, BookOpen, BarChart3, Download } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Info } from 'lucide-react';
import Modal from '@/components/Modal';
import API_BASE from '../lib/apiBase';

const gradeLevels = ["Pre-K", "K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const ParentDashboardPage = () => {
  const { user, addStudent, getStudents, updateStudent, deleteStudent } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState([]);
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null); // null or student object
  
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [studentEmojiPin, setStudentEmojiPin] = useState(''); // For simplicity, text input for now
  const [analytics, setAnalytics] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (user && user.role === 'parent') {
      setStudents(getStudents());
    }
  }, [user, getStudents]);

  // Fetch analytics for each student
  useEffect(() => {
    async function fetchAnalytics() {
      const results = {};
      for (const student of students) {
        try {
          const res = await fetch(`${API_BASE}/api/dashboard-analytics?userId=${student.id}`);
          if (res.ok) {
            results[student.id] = await res.json();
          }
        } catch (e) {
          results[student.id] = { error: 'Failed to load analytics' };
        }
      }
      setAnalytics(results);
    }
    if (students.length > 0) fetchAnalytics();
  }, [students]);

  const handleAddOrUpdateStudent = (e) => {
    e.preventDefault();
    if (!studentName || !studentGrade) { // Emoji PIN can be optional or generated
      toast({ variant: "destructive", title: "Missing Fields", description: "Please provide student name and grade." });
      return;
    }

    const studentData = { 
      name: studentName, 
      gradeLevel: studentGrade, 
      emojiPin: studentEmojiPin || generateEmojiPin() // Generate if empty
    };

    let success;
    if (editingStudent) {
      success = updateStudent({ ...editingStudent, ...studentData });
      if (success) toast({ title: "Student Updated!", description: `${studentName} has been updated.` });
    } else {
      success = addStudent(studentData);
      if (success) toast({ title: "Student Added!", description: `${studentName} has been added to your family.` });
    }
    
    if (success) {
      setStudents(getStudents());
      resetForm();
      setShowConfetti(true); // trigger confetti
    } else {
      toast({ variant: "destructive", title: "Error", description: "Could not save student. Please try again." });
    }
  };

  const resetForm = () => {
    setStudentName('');
    setStudentGrade('');
    setStudentEmojiPin('');
    setShowAddStudentForm(false);
    setEditingStudent(null);
  };
  
  const generateEmojiPin = () => {
    const emojis = ['🍎', '🍌', '🍇', '🍓', '😊', '🥳', '🚀', '⭐']; // Simple set
    let pin = '';
    for (let i = 0; i < 4; i++) {
      pin += emojis[Math.floor(Math.random() * emojis.length)];
    }
    return pin;
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentName(student.name);
    setStudentGrade(student.gradeLevel);
    setStudentEmojiPin(student.emojiPin);
    setShowAddStudentForm(true);
  };

  const handleDeleteStudent = (studentId) => {
    const success = deleteStudent(studentId);
    if (success) {
      toast({ title: "Student Removed", description: "The student has been removed from your account." });
      setStudents(getStudents());
    } else {
      toast({ variant: "destructive", title: "Error", description: "Could not remove student." });
    }
  };

  const handleViewDetails = (student, topic) => {
    // Find analytics for this topic
    const analyticsData = analytics[student.id]?.interventionSummary?.find(row => row.topic === topic);
    const history = analytics[student.id]?.raw?.mastery_history?.[topic] || [];
    setModalTitle(`${student.name} – ${topic} Details`);
    setModalContent(
      <div>
        <p><strong>Mastery:</strong> {analyticsData?.mastery ?? 'N/A'}</p>
        <p><strong>Velocity:</strong> {analyticsData?.velocity?.toFixed ? analyticsData.velocity.toFixed(2) : analyticsData?.velocity ?? 'N/A'}</p>
        <p><strong>Intervention:</strong> {analyticsData?.intervention ?? 'N/A'}</p>
        <div className="mt-4">
          <strong>Recent Progress:</strong>
          {history.length > 0 ? (
            <ul className="list-disc ml-6 mt-1">
              {history.slice(-5).map((h, idx) => (
                <li key={idx}>
                  Score: {h.score}, Date: {new Date(h.timestamp).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent progress data.</p>
          )}
        </div>
        <div className="mt-4">
          <strong>Suggested Actions:</strong>
          <ul className="list-disc ml-6">
            {analyticsData?.intervention === 'remediation' && <li>Review previous lessons and practice more on this topic.</li>}
            {analyticsData?.intervention === 'enrichment' && <li>Try advanced or enrichment activities for this topic!</li>}
            {analyticsData?.intervention === 'regular' && <li>Continue steady practice and move to the next topic soon.</li>}
          </ul>
        </div>
      </div>
    );
    setModalOpen(true);
  };

  const handleDownloadAllReports = () => {
    // Download all analytics as JSON for all students
    const data = students.map(student => ({
      name: student.name,
      grade: student.gradeLevel,
      analytics: analytics[student.id] || {}
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartSchool-Reports-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Add: animated, parent-friendly summary at the top
  const renderSummary = () => {
    if (!students.length) return null;
    let totalRemediation = 0, totalEnrichment = 0, totalRegular = 0;
    students.forEach(student => {
      const summary = analytics[student.id]?.interventionSummary || [];
      summary.forEach(row => {
        if (row.intervention === 'remediation') totalRemediation++;
        else if (row.intervention === 'enrichment') totalEnrichment++;
        else totalRegular++;
      });
    });
    return (
      <motion.div className="flex flex-wrap gap-4 items-center justify-center mb-8 mt-8 animate-fade-in" initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} transition={{duration:0.7}}>
        <motion.div whileHover={{scale:1.05}} className="rounded-xl px-4 py-2 font-extrabold shadow border-2 border-red-300 bg-white text-red-600 text-base" style={{minWidth:'140px'}}>
          <span className="text-lg align-middle font-extrabold mr-1">{totalRemediation}</span> <span className="align-middle font-bold">Remediation Needed</span>
        </motion.div>
        <motion.div whileHover={{scale:1.05}} className="rounded-xl px-4 py-2 font-extrabold shadow border-2 border-green-300 bg-white text-green-700 text-base" style={{minWidth:'140px'}}>
          <span className="text-lg align-middle font-extrabold mr-1">{totalEnrichment}</span> <span className="align-middle font-bold">Enrichment Opportunities</span>
        </motion.div>
        <motion.div whileHover={{scale:1.05}} className="rounded-xl px-4 py-2 font-extrabold shadow border-2 border-blue-300 bg-white text-blue-700 text-base" style={{minWidth:'120px'}}>
          <span className="text-lg align-middle font-extrabold mr-1">{totalRegular}</span> <span className="align-middle font-bold">On Track</span>
        </motion.div>
      </motion.div>
    );
  };

  // Confetti effect for add/update student
  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  if (!user || user.role !== 'parent') {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p>You must be logged in as a parent to view this page.</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div 
      className="space-y-8 bg-white min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {showConfetti && <div className="fixed inset-0 pointer-events-none z-50 animate-fade-in">
        {/* Simple confetti effect */}
        <div className="absolute w-full h-full flex flex-wrap justify-center items-start">
          {[...Array(30)].map((_,i) => (
            <span key={i} style={{fontSize:'2rem', position:'absolute', left:`${Math.random()*100}%`, top:`${Math.random()*80}%`, transition:'all 2s', opacity:0.8}}>
              {['🎉','🎊','✨','🥳','🌟','🍀','🍎','⭐'][i%8]}
            </span>
          ))}
        </div>
      </div>}
      {renderSummary()}

      <motion.section variants={itemVariants}>
        <h1 className="text-4xl font-bold text-smartSchool-blue mb-2">Parent Dashboard</h1>
        <p className="text-lg text-gray-600">Manage your students, view progress, and access learning resources.</p>
      </motion.section>

      {/* Add/Edit Student Form */}
      <motion.div variants={itemVariants}>
        <Button 
          onClick={() => { setShowAddStudentForm(!showAddStudentForm); setEditingStudent(null); if(showAddStudentForm) resetForm(); }} 
          className="mb-6 bg-smartSchool-yellow hover:bg-smartSchool-yellow/90 text-smartSchool-blue font-semibold text-lg py-3 px-6 rounded-xl"
        >
          <PlusCircle size={22} className="mr-2" /> {showAddStudentForm ? (editingStudent ? 'Cancel Edit' : 'Cancel Adding') : 'Add New Student'}
        </Button>

        {showAddStudentForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <Card className="mb-8 shadow-lg rounded-2xl border-smartSchool-yellow/50">
              <CardHeader>
                <CardTitle className="text-2xl text-smartSchool-yellow">{editingStudent ? 'Edit Student Details' : 'Add a New Student'}</CardTitle>
                <CardDescription>{editingStudent ? `Update information for ${editingStudent.name}.` : 'Enter the details for your new student.'}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddOrUpdateStudent} className="space-y-4">
                  <div>
                    <Label htmlFor="studentName" className="text-base">Student's Full Name</Label>
                    <Input id="studentName" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="e.g., Jamie Doe" className="text-lg p-3 rounded-lg" />
                  </div>
                  <div>
                    <Label htmlFor="studentGrade" className="text-base">Grade Level</Label>
                    <Select value={studentGrade} onValueChange={setStudentGrade}>
                      <SelectTrigger className="w-full text-lg p-3 rounded-lg">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="studentEmojiPin" className="text-base">Emoji PIN (4 Emojis - e.g., 🍎🍌🍇🍓)</Label>
                    <Input id="studentEmojiPin" value={studentEmojiPin} onChange={(e) => setStudentEmojiPin(e.target.value)} placeholder="Optional, or will be auto-generated" className="text-lg p-3 rounded-lg" />
                  </div>
                  <Button type="submit" className="bg-smartSchool-blue hover:bg-smartSchool-blue/90 text-white font-semibold py-3 text-lg rounded-xl w-full">
                    {editingStudent ? 'Save Changes' : 'Add Student'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Student List */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center space-x-3 mb-4">
          <Users size={30} className="text-smartSchool-red" />
          <h2 className="text-3xl font-semibold">Your Students</h2>
        </div>
        {students.length === 0 && !showAddStudentForm ? (
          <p className="text-gray-600">You haven't added any students yet. Click "Add New Student" to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map(student => (
              <motion.div key={student.id} variants={itemVariants}>
                <Card className="shadow-lg rounded-2xl hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl text-smartSchool-blue">{student.name}</CardTitle>
                        <CardDescription>Grade: {student.gradeLevel} | PIN: {student.emojiPin}</CardDescription>
                      </div>
                       <User size={36} className="text-smartSchool-yellow" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 mb-4">View progress, assign lessons, and more.</p>
                    {/* Placeholder for progress */}
                    <div className="h-2 bg-gray-200 rounded-full mb-2">
                      <div className="h-2 bg-green-500 rounded-full w-3/4"></div>
                    </div>
                    <p className="text-xs text-gray-500">Overall Progress: 75%</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => handleEditStudent(student)} className="rounded-lg border-smartSchool-blue text-smartSchool-blue hover:bg-smartSchool-blue/10">
                      <Edit3 size={18} className="mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteStudent(student.id)} className="rounded-lg bg-smartSchool-red hover:bg-smartSchool-red/90">
                      <Trash2 size={18} className="mr-2" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Student Analytics */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 size={30} className="text-smartSchool-red" />
          <h2 className="text-3xl font-semibold">Student Analytics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Accordion type="multiple" className="w-full">
            {students.map(student => (
              <AccordionItem key={student.id} value={student.id} className="mb-4">
                <AccordionTrigger className="rounded-lg bg-gray-50 hover:bg-yellow-50 px-4 py-2 text-lg font-semibold flex items-center">
                  <span>{student.name} - Analytics</span>
                </AccordionTrigger>
                <AccordionContent className="bg-white rounded-b-lg shadow-inner">
                  <Card className="shadow-lg rounded-2xl border border-yellow-100">
                    <CardHeader>
                      <CardTitle className="text-xl text-smartSchool-blue flex items-center gap-2">
                        {student.name} <span className="text-base text-gray-400">(Grade {student.gradeLevel})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analytics[student.id] ? (
                        analytics[student.id].error ? (
                          <p className="text-red-500">{analytics[student.id].error}</p>
                        ) : (
                          <>
                            <p><strong>Strengths:</strong> {analytics[student.id].strengths?.join(', ') || 'N/A'}</p>
                            <p><strong>Gaps:</strong> {analytics[student.id].gaps?.join(', ') || 'N/A'}</p>
                            <p><strong>Learning Style:</strong> {analytics[student.id].learningStyle || 'N/A'}</p>
                            {analytics[student.id].interventionSummary && (
                              <div className="mt-3">
                                <strong>Topic Interventions:</strong>
                                <table className="min-w-full text-xs mt-1 border">
                                  <thead>
                                    <tr className="bg-gray-100">
                                      <th className="px-2 py-1 text-left flex items-center gap-1">Topic <Info size={14} title="The subject area or skill." /></th>
                                      <th className="px-2 py-1 text-left flex items-center gap-1">Mastery <Info size={14} title="How well your child knows this topic (0-100)." /></th>
                                      <th className="px-2 py-1 text-left flex items-center gap-1">Velocity <Info size={14} title="How quickly your child is improving (slope)." /></th>
                                      <th className="px-2 py-1 text-left flex items-center gap-1">Intervention <Info size={14} title="Recommended action: Remediation, Enrichment, or Regular." /></th>
                                      <th className="px-2 py-1 text-left">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {analytics[student.id].interventionSummary.map((row) => (
                                      <tr key={row.topic} className={
                                        row.intervention === 'remediation' ? 'bg-red-100' :
                                        row.intervention === 'enrichment' ? 'bg-green-100' : ''
                                      }>
                                        <td className="px-2 py-1 font-medium">{row.topic}</td>
                                        <td className="px-2 py-1">{row.mastery}</td>
                                        <td className="px-2 py-1">{row.velocity?.toFixed ? row.velocity.toFixed(2) : row.velocity}</td>
                                        <td className="px-2 py-1 font-semibold">
                                          {row.intervention === 'remediation' && <span className="text-red-600">Remediation</span>}
                                          {row.intervention === 'enrichment' && <span className="text-green-700">Enrichment</span>}
                                          {row.intervention === 'regular' && <span className="text-gray-700">Regular</span>}
                                        </td>
                                        <td className="px-2 py-1">
                                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(student, row.topic)} className="mr-2">View Details</Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                            {analytics[student.id].interventions?.length > 0 && (
                              <p className="mt-2"><strong>Suggested Interventions:</strong> {analytics[student.id].interventions.map(i => typeof i === 'string' ? i : i.intervention).join(', ')}</p>
                            )}
                          </>
                        )
                      ) : (
                        <p>Loading analytics...</p>
                      )}
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.section>

      {/* Other Parent Features (Placeholders) */}
      <motion.section variants={itemVariants} className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center space-x-3">
            <BookOpen size={28} className="text-smartSchool-blue" />
            <CardTitle className="text-xl">Curriculum Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Browse lessons by subject and grade level. (Coming Soon)</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="rounded-lg w-full">Explore Curriculum</Button>
          </CardFooter>
        </Card>
        <Card className="shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center space-x-3">
            <BarChart3 size={28} className="text-smartSchool-red" />
            <CardTitle className="text-xl">Progress Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">View detailed weekly reports and download records. (Coming Soon)</p>
          </CardContent>
          <CardFooter>
            <Button className="bg-smartSchool-red hover:bg-smartSchool-red/90 text-white rounded-lg w-full">
              <Download size={18} className="mr-2" /> Download Reports
            </Button>
          </CardFooter>
        </Card>
      </motion.section>

      <Button
        className="bg-smartSchool-blue text-white rounded-lg px-6 py-3 mt-6 shadow hover:bg-blue-700 transition-all animate-pop-in"
        onClick={() => handleDownloadAllReports()}
      >
        <Download size={18} className="mr-2" /> Download All Reports
      </Button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
        {modalContent}
      </Modal>
    </motion.div>
  );
};

export default ParentDashboardPage;