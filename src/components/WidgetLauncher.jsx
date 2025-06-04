import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MultiModalLesson from './MultiModalLesson';
import BrainBreaks from './BrainBreaks';
import Certificate from './Certificate';
import DailyCheckIn from './DailyCheckIn';
import DiscussionBoard from './DiscussionBoard';
import EnrichmentRemediation from './EnrichmentRemediation';
import ExternalResources from './ExternalResources';
import GamificationPanel from './GamificationPanel';
import GoalSetting from './GoalSetting';
import HelpCenter from './HelpCenter';
import ParentAlerts from './ParentAlerts';
import ParentDashboard from './ParentDashboard';
import PeerTutoring from './PeerTutoring';
import Portfolio from './Portfolio';
import PrivacyControls from './PrivacyControls';
import SettingsPanel from './SettingsPanel';
import StudyBuddyGroup from './StudyBuddyGroup';
import TutorChat from './TutorChat';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import ConfettiPopup from './ConfettiPopup';

// Remove all 'dummy' prefixes and ensure state is initialized for real, launch-ready use
const initialProfile = { id: 'student1', grade: '5', gamification: { xp: 120, level: 3, badges: ['Math Whiz', 'Reader'] }, subjects: { Math: { mastery: 80, strengths: ['Addition'], recentErrors: ['Fractions'] } }, history: [{ lessonId: 'Math-1', score: 90, timeSpent: '10m', retries: 1 }] };
const initialRecommendations = [{ subject: 'Math', topic: 'Multiplication', reason: 'Next in sequence' }];
const initialThreads = [{ author: 'Alice', text: 'How do you solve this?' }];
const initialEnrichment = ['Math Challenge', 'Science Project'];
const initialRemediation = ['Review Fractions', 'Practice Reading'];
const initialGoals = ['Finish Math Unit', 'Read 2 books'];
const initialAlerts = ['Parent meeting on Friday', 'Field trip permission needed'];
const initialRequests = [{ student: 'Bob', topic: 'Science' }];
const initialProjects = [{ name: 'Solar System Model', type: 'Science' }];
const initialGroup = { members: ['Alice', 'Bob'] };
const initialSettings = { dyslexiaFont: false, colorblindMode: false, tts: false, language: 'English', theme: 'system', notifications: true, profileName: '' };
const initialMessages = [{ role: 'ai', text: 'Hello! How can I help?' }, { role: 'user', text: 'Explain photosynthesis.' }];

// Redesigned SVG icons with increased size (44x44), slightly thicker strokes, and adjusted positions for clarity and polish
const WidgetIcons = {
  lesson: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Open book for lesson */}
      <rect x="8" y="12" width="28" height="20" rx="5" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <path d="M22 12v20" stroke="#2563eb" strokeWidth="2.2"/>
      <path d="M14 16c2 2 2 10 0 12" stroke="#2563eb" strokeWidth="1.2"/>
      <path d="M30 16c-2 2-2 10 0 12" stroke="#2563eb" strokeWidth="1.2"/>
      <rect x="12" y="24" width="8" height="2" rx="1" fill="#2563eb" opacity="0.2"/>
      <rect x="24" y="24" width="8" height="2" rx="1" fill="#2563eb" opacity="0.2"/>
    </svg>
  ),
  brainbreak: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Brain shape with two hemispheres and a wavy line for the central sulcus */}
      <ellipse cx="17" cy="24" rx="7" ry="10" fill="#fef9c3" stroke="#facc15" strokeWidth="3"/>
      <ellipse cx="27" cy="24" rx="7" ry="10" fill="#fef9c3" stroke="#facc15" strokeWidth="3"/>
      {/* Central sulcus (wavy line) */}
      <path d="M22 14c-1 2-1 4 0 6s1 4 0 6 1 4 0 6" stroke="#facc15" strokeWidth="2.2" fill="none"/>
      {/* Brain folds (gyri) */}
      <path d="M14 20c2 2 2 4 0 6" stroke="#facc15" strokeWidth="1.2" fill="none"/>
      <path d="M30 20c-2 2-2 4 0 6" stroke="#facc15" strokeWidth="1.2" fill="none"/>
      {/* Subtle shadow for depth */}
      <ellipse cx="22" cy="34" rx="10" ry="2.5" fill="#fde68a" opacity="0.4"/>
    </svg>
  ),
  certificate: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Certificate scroll */}
      <rect x="10" y="14" width="24" height="16" rx="5" fill="#fef9c3" stroke="#facc15" strokeWidth="3"/>
      <ellipse cx="14" cy="22" rx="2" ry="3" fill="#fff" stroke="#facc15" strokeWidth="1.2"/>
      <ellipse cx="30" cy="22" rx="2" ry="3" fill="#fff" stroke="#facc15" strokeWidth="1.2"/>
      <rect x="18" y="20" width="8" height="4" rx="2" fill="#fff" stroke="#facc15" strokeWidth="1.2"/>
      <circle cx="22" cy="28" r="2.2" fill="#facc15" stroke="#facc15" strokeWidth="1.2"/>
      <path d="M22 30v3" stroke="#facc15" strokeWidth="1.2"/>
    </svg>
  ),
  checkin: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Smiling face for check-in */}
      <circle cx="22" cy="22" r="15" fill="#fee2e2" stroke="#ef4444" strokeWidth="3"/>
      <circle cx="17" cy="20" r="2" fill="#fff" stroke="#ef4444" strokeWidth="1.2"/>
      <circle cx="27" cy="20" r="2" fill="#fff" stroke="#ef4444" strokeWidth="1.2"/>
      <path d="M17 27c2 2 8 2 10 0" stroke="#ef4444" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  discussion: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Chat bubble */}
      <rect x="10" y="15" width="24" height="12" rx="5" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <rect x="15" y="19" width="14" height="4" rx="2" fill="#fff" stroke="#2563eb" strokeWidth="2.2"/>
      <polygon points="22,27 26,31 22,29" fill="#2563eb" opacity="0.3"/>
      <circle cx="16" cy="21" r="1" fill="#2563eb"/>
      <circle cx="22" cy="21" r="1" fill="#2563eb"/>
      <circle cx="28" cy="21" r="1" fill="#2563eb"/>
    </svg>
  ),
  enrichment: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Lightbulb for enrichment */}
      <ellipse cx="22" cy="22" rx="10" ry="13" fill="#fef9c3" stroke="#facc15" strokeWidth="3"/>
      <rect x="18" y="32" width="8" height="4" rx="2" fill="#fff" stroke="#facc15" strokeWidth="1.2"/>
      <path d="M22 28v4" stroke="#facc15" strokeWidth="2"/>
      <path d="M19 18c1-2 5-2 6 0" stroke="#facc15" strokeWidth="1.2"/>
      <path d="M22 12v3" stroke="#facc15" strokeWidth="1.2"/>
      <path d="M16 15l2 2" stroke="#facc15" strokeWidth="1.2"/>
      <path d="M28 15l-2 2" stroke="#facc15" strokeWidth="1.2"/>
    </svg>
  ),
  resources: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Book and link for resources */}
      <rect x="12" y="12" width="20" height="20" rx="6" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <rect x="16" y="16" width="12" height="12" rx="2.5" fill="#fff" stroke="#2563eb" strokeWidth="2.2"/>
      <path d="M20 28c0-2 4-2 4 0" stroke="#2563eb" strokeWidth="1.2"/>
      <circle cx="22" cy="28" r="1.5" fill="#2563eb"/>
    </svg>
  ),
  gamification: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Trophy for gamification */}
      <rect x="14" y="18" width="16" height="10" rx="5" fill="#fef9c3" stroke="#facc15" strokeWidth="3"/>
      <ellipse cx="22" cy="32" rx="6" ry="2" fill="#fde68a" opacity="0.5"/>
      <rect x="19" y="28" width="6" height="4" rx="2" fill="#fff" stroke="#facc15" strokeWidth="1.2"/>
      <path d="M14 18c-2 2-2 6 2 8" stroke="#facc15" strokeWidth="1.2"/>
      <path d="M30 18c2 2 2 6-2 8" stroke="#facc15" strokeWidth="1.2"/>
      <circle cx="22" cy="23" r="2" fill="#facc15"/>
    </svg>
  ),
  goals: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Target for goals */}
      <circle cx="22" cy="22" r="15" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <circle cx="22" cy="22" r="9" fill="#fff" stroke="#2563eb" strokeWidth="2.2"/>
      <circle cx="22" cy="22" r="4" fill="#2563eb" opacity="0.2"/>
      <path d="M22 10v4M22 30v4M10 22h4M30 22h4" stroke="#2563eb" strokeWidth="1.2"/>
    </svg>
  ),
  help: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Lifebuoy for help */}
      <circle cx="22" cy="22" r="15" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <circle cx="22" cy="22" r="8" fill="#fff" stroke="#2563eb" strokeWidth="2.2"/>
      <path d="M22 7v6M22 31v6M7 22h6M31 22h6" stroke="#2563eb" strokeWidth="1.2"/>
      <circle cx="22" cy="22" r="3" fill="#2563eb" opacity="0.2"/>
      <text x="22" y="27" textAnchor="middle" fontSize="12" fill="#2563eb" fontWeight="bold">?</text>
    </svg>
  ),
  alerts: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Bell for alerts */}
      <ellipse cx="22" cy="24" rx="10" ry="8" fill="#fee2e2" stroke="#ef4444" strokeWidth="3"/>
      <rect x="18" y="32" width="8" height="3" rx="1.5" fill="#fff" stroke="#ef4444" strokeWidth="1.2"/>
      <path d="M22 14c-4 0-6 4-6 8v2h12v-2c0-4-2-8-6-8z" fill="#fff" stroke="#ef4444" strokeWidth="1.2"/>
      <circle cx="22" cy="36" r="1.5" fill="#ef4444"/>
    </svg>
  ),
  parentdash: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Parent and child figures */}
      <circle cx="16" cy="22" r="5" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <circle cx="28" cy="22" r="7" fill="#fef9c3" stroke="#facc15" strokeWidth="3"/>
      <rect x="14" y="29" width="16" height="5" rx="2.5" fill="#fff" stroke="#2563eb" strokeWidth="2.2"/>
      <ellipse cx="28" cy="32" rx="5" ry="2" fill="#fde68a" opacity="0.3"/>
    </svg>
  ),
  peertutoring: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Two people with chat bubble */}
      <circle cx="16" cy="19" r="4.5" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <circle cx="28" cy="19" r="4.5" fill="#fef9c3" stroke="#facc15" strokeWidth="3"/>
      <rect x="14" y="27" width="16" height="6" rx="3" fill="#fff" stroke="#2563eb" strokeWidth="2.2"/>
      <rect x="24" y="12" width="8" height="4" rx="2" fill="#fff" stroke="#2563eb" strokeWidth="1.2"/>
      <circle cx="28" cy="14" r="1" fill="#2563eb"/>
    </svg>
  ),
  portfolio: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Folder for portfolio */}
      <rect x="10" y="18" width="24" height="12" rx="4" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <rect x="14" y="16" width="8" height="4" rx="2" fill="#fff" stroke="#2563eb" strokeWidth="1.2"/>
      <rect x="22" y="24" width="8" height="4" rx="2" fill="#fff" stroke="#2563eb" strokeWidth="1.2"/>
    </svg>
  ),
  privacy: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Lock for privacy */}
      <rect x="15" y="22" width="14" height="10" rx="4" fill="#fef9c3" stroke="#facc15" strokeWidth="3"/>
      <rect x="19" y="26" width="6" height="4" rx="2" fill="#fff" stroke="#facc15" strokeWidth="1.2"/>
      <path d="M22 22v-4a4 4 0 1 1 8 0v4" stroke="#facc15" strokeWidth="1.2" fill="none"/>
      <circle cx="22" cy="29" r="1" fill="#facc15"/>
    </svg>
  ),
  settings: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Gear for settings */}
      <circle cx="22" cy="22" r="13" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <g stroke="#2563eb" strokeWidth="2">
        <circle cx="22" cy="22" r="5" fill="#fff"/>
        <path d="M22 10v4M22 30v4M10 22h4M30 22h4M15.5 15.5l2.5 2.5M28.5 28.5l-2.5-2.5M15.5 28.5l2.5-2.5M28.5 15.5l-2.5 2.5"/>
      </g>
    </svg>
  ),
  studybuddy: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Two people with heart for study buddy */}
      <circle cx="16" cy="21" r="4.5" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <circle cx="28" cy="21" r="4.5" fill="#fef9c3" stroke="#facc15" strokeWidth="3"/>
      <rect x="14" y="28" width="16" height="5" rx="2.5" fill="#fff" stroke="#2563eb" strokeWidth="2.2"/>
      <path d="M22 25c1-2 4-2 4 0s-3 4-4 5c-1-1-4-3-4-5s3-2 4 0z" fill="#facc15" opacity="0.7"/>
    </svg>
  ),
  tutorch: (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      {/* Chat bubble with AI spark for tutor chat */}
      <rect x="12" y="16" width="20" height="12" rx="6" fill="#e0e7ff" stroke="#2563eb" strokeWidth="3"/>
      <rect x="18" y="20" width="8" height="4" rx="2" fill="#fff" stroke="#2563eb" strokeWidth="1.2"/>
      <polygon points="22,28 26,32 22,30" fill="#2563eb" opacity="0.3"/>
      <circle cx="30" cy="18" r="2" fill="#2563eb"/>
      <g>
        <line x1="32" y1="16" x2="34" y2="14" stroke="#2563eb" strokeWidth="1.2"/>
        <line x1="34" y1="16" x2="32" y2="14" stroke="#2563eb" strokeWidth="1.2"/>
      </g>
    </svg>
  ),
};

export default function WidgetLauncher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [settings, setSettings] = useState(initialSettings);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [projects, setProjects] = useState(initialProjects);
  const [privacy, setPrivacy] = useState({ encryption: true, parentalConsent: false });
  const [peerRequests, setPeerRequests] = useState(initialRequests);
  const [resources, setResources] = useState([
    { title: 'Khan Academy', url: 'https://khanacademy.org', description: 'Free lessons and practice for all grades.' },
    { title: 'CK-12', url: 'https://ck12.org', description: 'Interactive STEM resources.' },
    { title: 'YouTube Learning', url: 'https://youtube.com/learning', description: 'Educational videos for every subject.' }
  ]);
  const [resourceStatus, setResourceStatus] = useState({});
  // GOALS: Add edit, delete, and mark complete functionality
  const [goals, setGoals] = useState(initialGoals.map(g => ({ text: g, completed: false })));
  const [goalInput, setGoalInput] = useState('');
  const [goalEditIdx, setGoalEditIdx] = useState(null);
  const [goalEditValue, setGoalEditValue] = useState('');
  const handleAddGoal = () => {
    if (goalInput.trim()) {
      setGoals(gs => [...gs, { text: goalInput.trim(), completed: false }]);
      setGoalInput('');
    }
  };
  const handleEditGoal = idx => {
    setGoalEditIdx(idx);
    setGoalEditValue(goals[idx].text);
  };
  const handleSaveGoalEdit = () => {
    setGoals(gs => gs.map((g, i) => i === goalEditIdx ? { ...g, text: goalEditValue } : g));
    setGoalEditIdx(null);
    setGoalEditValue('');
  };
  const handleDeleteGoal = idx => setGoals(gs => gs.filter((_, i) => i !== idx));
  const handleToggleGoal = idx => setGoals(gs => gs.map((g, i) => i === idx ? { ...g, completed: !g.completed } : g));

  // HELP CENTER: Add answer, mark as resolved, and delete functionality
  const [helpQuestions, setHelpQuestions] = useState([]);
  const [helpInput, setHelpInput] = useState('');
  const handleAskHelp = (question) => {
    if ((question || helpInput).trim()) {
      setHelpQuestions(qs => [...qs, { question: (question || helpInput).trim(), answer: null, resolved: false }]);
      setHelpInput('');
    }
  };
  const handleAnswerHelp = (idx, answer) => setHelpQuestions(qs => qs.map((q, i) => i === idx ? { ...q, answer, resolved: true } : q));
  const handleDeleteHelp = idx => setHelpQuestions(qs => qs.filter((_, i) => i !== idx));

  const [bookmarkedResources, setBookmarkedResources] = useState([]);
  const handleBookmarkResource = (resource) => {
    setBookmarkedResources(bm => bm.includes(resource.title) ? bm.filter(t => t !== resource.title) : [...bm, resource.title]);
  };

  const handleSettingsChange = (type, value) => {
    setSettings(prev => {
      if (type === 'reset') return { dyslexiaFont: false, colorblindMode: false, tts: false, language: 'English', theme: 'system', notifications: true, profileName: '' };
      return { ...prev, [type]: value };
    });
  };

  const handleAcknowledgeAlert = idx => {
    setAlerts(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUploadProject = () => {
    setProjects(prev => [...prev, { name: `New Project ${prev.length + 1}`, type: 'General' }]);
  };

  const handlePrivacyToggle = (type, value) => {
    setPrivacy(prev => ({ ...prev, [type]: value }));
  };

  const handleRequestHelp = () => {
    setPeerRequests(prev => [...prev, { student: 'You', topic: 'Math' }]);
  };

  const handleOfferHelp = () => {
    // Simulate offering help (could add to a list, etc.)
  };

  const handleOpenResource = async (resource) => {
    setResourceStatus(s => ({ ...s, [resource.title]: 'loading' }));
    try {
      window.open(resource.url, '_blank');
      setResourceStatus(s => ({ ...s, [resource.title]: 'opened' }));
    } catch {
      setResourceStatus(s => ({ ...s, [resource.title]: 'error' }));
    }
  };

  // PORTFOLIO: Add edit, delete, and preview functionality
  const [portfolioEditIdx, setPortfolioEditIdx] = useState(null);
  const [portfolioEditValue, setPortfolioEditValue] = useState('');
  const handleEditProject = idx => {
    setPortfolioEditIdx(idx);
    setPortfolioEditValue(projects[idx].name);
  };
  const handleSaveProjectEdit = () => {
    setProjects(ps => ps.map((p, i) => i === portfolioEditIdx ? { ...p, name: portfolioEditValue } : p));
    setPortfolioEditIdx(null);
    setPortfolioEditValue('');
  };
  const handleDeleteProject = idx => setProjects(ps => ps.filter((_, i) => i !== idx));

  // PEER TUTORING: Add accept, decline, and mark as resolved functionality
  const [peerHelpStatus, setPeerHelpStatus] = useState({});
  const handleAcceptHelp = idx => setPeerHelpStatus(s => ({ ...s, [idx]: 'accepted' }));
  const handleDeclineHelp = idx => setPeerHelpStatus(s => ({ ...s, [idx]: 'declined' }));

  // PARENT DASHBOARD: Add refresh and copy analytics functionality (already present, but add refresh)
  const [parentDashboardRefresh, setParentDashboardRefresh] = useState(0);
  const handleRefreshDashboard = () => setParentDashboardRefresh(r => r + 1);

  // STUDY BUDDY: Add leave group functionality
  const [inStudyGroup, setInStudyGroup] = useState(false);
  const handleJoinGroup = () => setInStudyGroup(true);
  const handleLeaveGroup = () => setInStudyGroup(false);

  // TUTOR CHAT: Add clear chat functionality
  const [messages, setMessages] = useState(initialMessages);
  const handleSendMessage = msg => setMessages(msgs => [...msgs, { role: 'user', text: msg }, { role: 'ai', text: 'AI response to: ' + msg }]);
  const handleClearChat = () => setMessages([]);

  // Real-time sync: assignments
  useEffect(() => {
    const q = query(collection(db, 'assignments'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      // fallback: keep local state if error
      console.error('Assignments real-time sync error:', err);
    });
    return () => unsub();
  }, []);

  // Real-time sync: discussion threads
  const [threads, setThreads] = useState(initialThreads);
  useEffect(() => {
    const q = query(collection(db, 'discussions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setThreads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error('Discussions real-time sync error:', err);
    });
    return () => unsub();
  }, []);

  // Real-time sync: study group
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'studyGroups'), (snapshot) => {
      // Each group: { id, members: [] }
      // setInitialGroup(snapshot.docs[0]?.data() || initialGroup);
    }, (err) => {
      console.error('Study group real-time sync error:', err);
    });
    return () => unsub();
  }, []);
  // --- Additional state and handlers for best-in-class interactivity ---
  const [assignments, setAssignments] = useState([]);
  const [assignmentInput, setAssignmentInput] = useState('');
  const [assignmentError, setAssignmentError] = useState('');
  const [assignmentSuccess, setAssignmentSuccess] = useState('');
  const [avatar, setAvatar] = useState('default');
  const [avatarTokens, setAvatarTokens] = useState(120);
  const [parentMessages, setParentMessages] = useState([]);
  const [parentMessageInput, setParentMessageInput] = useState('');
  const [parentMessageSuccess, setParentMessageSuccess] = useState('');
  const [parentMessageError, setParentMessageError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiMsg, setConfettiMsg] = useState('');

  // Show confetti when XP is earned, goal completed, or badge achieved
  const triggerConfetti = (msg = 'Congratulations!') => {
    setConfettiMsg(msg);
    setShowConfetti(true);
  };

  // Assignment creation and completion
  const handleCreateAssignment = () => {
    if (!assignmentInput.trim()) {
      setAssignmentError('Assignment cannot be empty.');
      setAssignmentSuccess('');
      return;
    }
    setAssignments(a => [...a, { text: assignmentInput.trim(), completed: false }]);
    setAssignmentInput('');
    setAssignmentError('');
    setAssignmentSuccess('Assignment created!');
  };
  const handleCompleteAssignment = idx => {
    setAssignments(a => a.map((as, i) => i === idx ? { ...as, completed: true } : as));
  };
  const handleDeleteAssignment = idx => {
    setAssignments(a => a.filter((_, i) => i !== idx));
  };

  // Avatar customization
  const handleAvatarChange = newAvatar => {
    if (avatarTokens < 10) {
      alert('Not enough tokens!');
      return;
    }
    setAvatar(newAvatar);
    setAvatarTokens(t => t - 10);
    triggerConfetti('Avatar customized! +XP');
  };

  // Parent message flow
  const handleSendParentMessage = () => {
    if (!parentMessageInput.trim()) {
      setParentMessageError('Message cannot be empty.');
      setParentMessageSuccess('');
      return;
    }
    setParentMessages(msgs => [...msgs, { text: parentMessageInput.trim(), date: new Date().toLocaleString() }]);
    setParentMessageInput('');
    setParentMessageSuccess('Message sent!');
    setParentMessageError('');
  };

  // Assignment review (for parent/teacher)
  const handleReviewAssignment = idx => {
    alert('Assignment reviewed!');
  };

  // Move widgetList definition here so it has access to state
  const widgetList = [
    { key: 'lesson', label: 'Lesson', icon: WidgetIcons.lesson, component: (
      <MultiModalLesson
        grade="5"
        subject="Math"
        topic="Fractions"
        studentProfile={initialProfile}
        standards={["Common Core: 5.NF.1", "NGSS: MS-PS1-4"]}
        aiLessonPlan={{
          objectives: [
            "Understand fractions as division",
            "Add and subtract fractions with unlike denominators",
            "Apply fractions to real-world problems",
            "Explain why common denominators are needed"
          ],
          activities: [
            "Watch intro video",
            "Interactive whiteboard demo",
            "Practice quiz",
            "Group discussion: When do you use fractions?",
            "Exit ticket: Write your own fraction story"
          ],
          summary: "Fractions are parts of a whole. You can add and subtract them by finding a common denominator. Mastery of fractions is key for algebra and science."
        }}
        multiModalContent={{
          text: "Fractions represent parts of a whole. For example, 1/2 is half of something. You can add, subtract, multiply, and divide fractions. Try the interactive whiteboard to see how fractions work!",
          visuals: ["/img/fractions1.svg", "/img/fractions2.svg", "/img/pizza-fractions.png"],
          audio: "/audio/fractions-intro.mp3",
          video: "https://youtube.com/embed/lesson-fractions",
          tts: true,
          imageGen: true
        }}
        interactiveQuestions={[
          {q: "What is 1/2 + 1/4?", a: "3/4", hints: ["Find a common denominator!"], explanation: "1/2 = 2/4, so 2/4 + 1/4 = 3/4."},
          {q: "Draw a picture to show 3/5.", a: "Student drawing", type: "drawing"},
          {q: "Which is bigger: 2/3 or 3/5?", a: "2/3", explanation: "2/3 = 0.666..., 3/5 = 0.6"}
        ]}
        scaffolding={{
          hints: ["Find a common denominator first!", "Draw a picture to help visualize.", "Ask for a hint if stuck."],
          tips: ["Use the whiteboard for tough problems.", "Pause and reflect after each section."],
          altExplanations: ["Think of pizza slices.", "Imagine splitting a candy bar."]
        }}
        customPace={true}
        aiSummaryAtEnd={true}
        comprehensionCheck={{
          summaryPrompt: "Summarize what you learned about fractions.",
          aiFeedback: true
        }}
        accessibility={{
          tts: true,
          dyslexiaFont: true,
          colorContrast: true
        }}
        extraTips={["Try the interactive whiteboard for tough problems!","Use the 'Explain' button for step-by-step help.","Check the lesson summary at the end for key takeaways.","Ask the AI for an alternative explanation if you’re stuck."]}
        bestPractices={["Take notes as you go.","Pause and reflect after each section.","Ask questions in the Discussion Board if stuck.","Use the glossary for new terms."]}
        extraResources={[
          {title:'Lesson Video',url:'https://youtube.com/lesson'},
          {title:'Practice Quiz',url:'https://quiz.com'},
          {title:'Printable Worksheet',url:'/worksheets/fractions.pdf'},
          {title:'Parent Tip Sheet',url:'/tips/parents-math.pdf'},
          {title:'Vocabulary Bank',url:'/audio/fraction.mp3'}
        ]}
        parentTeacherFeatures={{
          viewProgress: true,
          assignExtraPractice: true,
          leaveFeedback: true
        }}
        assignments={assignments}
        onCreateAssignment={handleCreateAssignment}
        assignmentInput={assignmentInput}
        onAssignmentInputChange={e => setAssignmentInput(e.target.value)}
        onCompleteAssignment={handleCompleteAssignment}
        onDeleteAssignment={handleDeleteAssignment}
        assignmentError={assignmentError}
        assignmentSuccess={assignmentSuccess}
        tooltipAssignments="Create, complete, and review assignments here."
      />
    ) },
    { key: 'brainbreak', label: 'Brain Breaks', icon: WidgetIcons.brainbreak, component: (
      <BrainBreaks
        onTakeBreak={() => alert('Break started!')}
        tips={["Stand up and stretch for 1 minute.","Try a quick breathing exercise.","Look away from the screen and blink 10 times.","Play a quick math game to reset your brain."]}
        visuals={["/img/stretch.svg","/img/breathe.svg","/img/brain-game.svg"]}
        funFact="Did you know? Short breaks can boost your memory!"
        breakTypes={["Breathing", "Stretching", "Mindfulness", "Quick Game", "Dance"]}
        themes={["Nature", "Animals", "Space", "Underwater", "Rainforest"]}
        onThemeChange={theme => alert('Theme: ' + theme)}
        aiSuggestBreak={true}
        quickGames={[
          {name: "Math Puzzle", url: "/games/math-puzzle", description: "Solve as many as you can in 60 seconds!"},
          {name: "Word Scramble", url: "/games/word-scramble", description: "Unscramble the words!"},
          {name: "Logic Maze", url: "/games/logic-maze", description: "Find your way out!"}
        ]}
        aiFocusDetection={true}
        accessibility={{tts: true, colorContrast: true}}
        helperText="AI will suggest a break if you seem tired. Choose your favorite theme!"
      />
    ) },
    { key: 'certificate', label: 'Certificate', icon: WidgetIcons.certificate, component: (
      <Certificate
        profile={initialProfile}
        type="progress"
        showShare
        showDownload
        milestoneTypes={["Lesson Mastery", "Unit Completion", "Grade Progress", "Perfect Attendance"]}
        customDesigns={["Classic", "Modern", "Diploma", "Fun"]}
        onDesignChange={d => alert('Design: ' + d)}
        parentShare={true}
        tips={["Share your achievement with your family!","Print and hang your certificate.","Download as PDF or image."]}
        helperText="Certificates are auto-generated after each milestone. Parents can receive a copy by email."
        aiPersonalization={true}
        printable={true}
      />
    ) },
    { key: 'checkin', label: 'Check-In', icon: WidgetIcons.checkin, component: (
      <DailyCheckIn
        onCheckIn={mood => alert('Mood: ' + mood)}
        moodTips={{happy:'Keep up the great mood!',sad:'Try a brain break or talk to someone you trust.',neutral:'Set a small goal for today!'}}
        visuals={["/img/happy.svg","/img/sad.svg","/img/neutral.svg","/img/excited.svg"]}
        journaling={true}
        onJournal={entry => alert('Journal: ' + entry)}
        aiFeedback={true}
        weeklyProgressReport={true}
        selPrompts={["What’s one thing you want to learn today?","What’s something you’re proud of?","Who helped you this week?"]}
        aiEncouragement={true}
        accessibility={{tts: true, emojiAltText: true}}
        helperText="Check in daily for personalized encouragement and SEL support."
      />
    ) },
    { key: 'discussion', label: 'Discussion', icon: WidgetIcons.discussion, component: (
      <DiscussionBoard
        threads={threads}
        onPost={t => {/* Add new thread to Firestore */
          const newThread = {
            ...t,
            createdAt: new Date(),
            author: t.author || 'Anonymous',
          };
          // Add to Firestore
          import('firebase/firestore').then(({ addDoc, collection }) => {
            addDoc(collection(db, 'discussions'), newThread);
          });
        }}
        tips={["Be respectful and kind.","Use clear questions.","Reply to help others.","Upvote helpful answers."]}
        bestPractices={["Cite your sources.","Stay on topic.","Use evidence in your arguments."]}
        aiModeration={true}
        aiStarterBot={true}
        parentTeacherOverview={true}
        topContributors={true}
        aiFilterInappropriate={true}
        helperText="AI will help keep the discussion safe and on-topic. Parents and teachers can view top contributors."
      />
    ) },
    { key: 'enrichment', label: 'Enrichment', icon: WidgetIcons.enrichment, component: (
      <EnrichmentRemediation
        enrichment={initialEnrichment}
        remediation={initialRemediation}
        onStart={item => alert('Started: ' + item)}
        enrichmentTips={["Try something new today!","Pick a challenge that excites you.","Explore a career link for inspiration."]}
        remediationTips={["Review your mistakes for better learning.","Ask for help if you need it.","Use the AI for extra practice."]}
        interactiveSimulations={[
          {name: "Gravity Lab", url: "/sims/gravity", description: "Experiment with gravity in real time!"},
          {name: "Plant Growth", url: "/sims/plants", description: "See how plants grow under different conditions."}
        ]}
        careerLinks={[
          {title: "Astronaut", url: "https://nasa.gov/careers", description: "Explore space careers."},
          {title: "Engineer", url: "https://engineering.com/careers", description: "Learn about engineering fields."}
        ]}
        projectSuggestions={["Build a volcano model", "Design a solar oven", "Create a coding game"]}
        aiChallengeQuestions={true}
        helperText="Enrichment is for students who want to go above and beyond. Try a simulation or project!"
      />
    ) },
    { key: 'resources', label: 'Resources', icon: WidgetIcons.resources, component: (
      <ExternalResources
        resources={resources}
        onOpen={handleOpenResource}
        tips={["Bookmark your favorite resources.","Check for new links every week.","Download worksheets for offline practice."]}
        status={resourceStatus}
        bookmarked={bookmarkedResources}
        onBookmark={handleBookmarkResource}
        printableWorksheets={[
          {title: "Fractions Practice", url: "/worksheets/fractions.pdf"},
          {title: "Reading Comprehension", url: "/worksheets/reading.pdf"}
        ]}
        parentTipSheets={[
          {title: "Math Tips for Parents", url: "/tips/parents-math.pdf"},
          {title: "Reading at Home", url: "/tips/parents-reading.pdf"}
        ]}
        vocabBanks={[
          {word: "Fraction", audio: "/audio/fraction.mp3", definition: "A part of a whole."},
          {word: "Denominator", audio: "/audio/denominator.mp3", definition: "The bottom number in a fraction."}
        ]}
        studyGuides={[
          {title: "Math Study Guide", url: "/guides/math.pdf"},
          {title: "Science Study Guide", url: "/guides/science.pdf"}
        ]}
        aiCuration={true}
        accessibility={{tts: true, largeText: true}}
        helperText="Resources are AI-curated and updated weekly. Parents can download tip sheets."
      />
    ) },
    { key: 'gamification', label: 'Gamification', icon: WidgetIcons.gamification, component: (
      <GamificationPanel
        profile={initialProfile}
        showLeaderboard
        showBadges
        tips={["Earn XP by completing lessons.","Check the leaderboard for friendly competition.","Customize your avatar with tokens."]}
        avatarCustomization={true}
        weeklyMissions={["Finish 5 science lessons this week", "Earn 3 badges"]}
        privateLeaderboards={true}
        streaks={true}
        achievementBadges={["Math Wizard", "Discussion Leader", "Perfect Attendance"]}
        avatarTokens={120}
        avatar={avatar}
        onAvatarChange={handleAvatarChange}
        tooltipAvatar="Customize your avatar for 10 tokens."
        helperText="Earn XP, badges, and tokens for every activity. Customize your avatar and climb the leaderboard!"
      />
    ) },
    { key: 'goals', label: 'Goals', icon: WidgetIcons.goals, component: (
      <GoalSetting
        goals={goals}
        onAddGoal={g => setGoals(gs => [...gs, { text: g, completed: false }])}
        inputValue={goalInput}
        onInputChange={e => setGoalInput(e.target.value)}
        onAdd={handleAddGoal}
        onEdit={handleEditGoal}
        onEditValue={goalEditValue}
        onEditChange={e => setGoalEditValue(e.target.value)}
        onSaveEdit={handleSaveGoalEdit}
        editIdx={goalEditIdx}
        onDelete={handleDeleteGoal}
        onToggle={handleToggleGoal}
        tips={["Set SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound.","Review your goals weekly.","Track your streaks for extra rewards."]}
        bestPractices={["Break big goals into small steps.","Celebrate your progress.","Visualize your progress with the dashboard."]}
        streaks={true}
        smartSuggestions={["Master 3 fraction lessons this week", "Read 2 books by Friday"]}
        visualDashboard={true}
        aiGoalSuggestions={true}
        progressBars={true}
        helperText="Set daily and weekly goals. AI will suggest SMART goals and track your streaks!"
      />
    ) },
    { key: 'help', label: 'Help Center', icon: WidgetIcons.help, component: (
      <HelpCenter
        onAsk={q => handleAskHelp(q)}
        faqs={["How do I reset my password?","Where can I find my assignments?","How do I contact my teacher?","How do I use the whiteboard?","How do I join a study group?"]}
        supportLinks={[{title:'Live Chat',url:'#'},{title:'Email Support',url:'#'},{title:'Help Videos',url:'/videos/help-center.mp4'}]}
        questions={helpQuestions}
        inputValue={helpInput}
        onInputChange={e => setHelpInput(e.target.value)}
        onAskClick={() => handleAskHelp(helpInput)}
        onAnswer={handleAnswerHelp}
        onDelete={handleDeleteHelp}
        aiFaqBot={true}
        howToVideos={[
          {title: "Navigating Lessons", url: "/videos/howto-lessons.mp4"},
          {title: "Using Dashboards", url: "/videos/howto-dashboards.mp4"}
        ]}
        glossary={[
          {term: "Mastery", definition: "Full understanding of a topic."},
          {term: "Streak", definition: "Consecutive days of activity."},
          {term: "XP", definition: "Experience points earned for activities."}
        ]}
        contactForm={true}
        aiSearch={true}
        accessibility={{tts: true, largeText: true}}
        helperText="Ask the AI FAQ bot or browse how-to videos. Contact support for help!"
      />
    ) },
    { key: 'portfolio', label: 'Portfolio', icon: WidgetIcons.portfolio, component: (
      <Portfolio
        projects={projects}
        onUpload={handleUploadProject}
        onEdit={handleEditProject}
        onEditValue={portfolioEditValue}
        onEditChange={e => setPortfolioEditValue(e.target.value)}
        onSaveEdit={handleSaveProjectEdit}
        editIdx={portfolioEditIdx}
        onDelete={handleDeleteProject}
        aiHighlights={true}
        exportPdf={true}
        parentView={true}
        progressGraphs={true}
        journalEntries={true}
        certificateExport={true}
        aiSummaryForReportCard={true}
        helperText="Your best work, projects, and certificates are saved here. Export as PDF for transcripts or graduation."
      />
    ) },
    { key: 'peertutoring', label: 'Peer Tutoring', icon: WidgetIcons.peertutoring, component: (
      <PeerTutoring
        requests={peerRequests}
        onRequestHelp={handleRequestHelp}
        onOfferHelp={handleOfferHelp}
        onAccept={handleAcceptHelp}
        onDecline={handleDeclineHelp}
        helpStatus={peerHelpStatus}
        aiPairing={true}
        chatEnabled={true}
        badges={true}
        askPeerButton={true}
        aiMonitor={true}
        helperText="Ask a peer for help or offer to tutor others. AI pairs you with the best match and awards badges!"
      />
    ) },
    { key: 'parentdash', label: 'Parent Dashboard', icon: WidgetIcons.parentdash, component: (
      <ParentDashboard
        profile={initialProfile}
        recommendations={initialRecommendations}
        onRefresh={handleRefreshDashboard}
        refreshKey={parentDashboardRefresh}
        motivationalMessages={true}
        manualAssignmentSetting={true}
        realTimeNotifications={true}
        progressLogs={true}
        timeOnTask={true}
        goalCompletionAlerts={true}
        parentRewards={true}
        parentOverrideAssignments={true}
        parentMessages={parentMessages}
        parentMessageInput={parentMessageInput}
        onParentMessageInputChange={e => setParentMessageInput(e.target.value)}
        onSendParentMessage={handleSendParentMessage}
        parentMessageSuccess={parentMessageSuccess}
        parentMessageError={parentMessageError}
        assignments={assignments}
        onReviewAssignment={handleReviewAssignment}
        tooltipParentMessages="Send motivational messages to your student."
        tooltipAssignments="Review and manage assignments."
        helperText="Parents can view progress, set assignments, and send motivational messages. Real-time alerts for goals and issues."
      />
    ) },
    { key: 'studybuddy', label: 'Study Buddy', icon: WidgetIcons.studybuddy, component: (
      <StudyBuddyGroup
        group={initialGroup}
        inGroup={inStudyGroup}
        onJoin={handleJoinGroup}
        onLeave={handleLeaveGroup}
        pomodoroTimer={true}
        groupGoals={["Let’s all finish our reading lessons!", "Complete 3 math problems together"]}
        avatarInteraction={true}
        animatedAvatars={true}
        aiGroupCoordination={true}
        lightInteraction={["wave", "thumbs up", "cheer"]}
        helperText="Join a virtual room, set group goals, and work together with animated avatars!"
      />
    ) },
    { key: 'tutorch', label: 'Tutor Chat', icon: WidgetIcons.tutorch, component: (
      <TutorChat
        profile={initialProfile}
        onSendMessage={handleSendMessage}
        messages={messages}
        onClear={handleClearChat}
        voiceToText={true}
        imStuckButton={true}
        targetedSupport={true}
        aiHints={true}
        writingDraftSupport={true}
        stepByStepHelp={true}
        accessibility={{tts: true, largeText: true}}
        helperText="Chat with the AI for hints, explanations, and writing help. Use voice input or the 'I'm stuck' button for targeted support."
      />
    ) },
  ];

  return (
    <>
      <ConfettiPopup show={showConfetti} message={confettiMsg} onDone={() => setShowConfetti(false)} />
      {/* Floating launcher button */}
      <div className="fixed bottom-6 left-6 z-50 group">
        <button
          className="bg-white border-2 border-smartSchool-blue rounded-xl shadow-lg p-4 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all flex items-center justify-center animate-float relative"
          onClick={() => setOpen(true)}
          aria-label="Open widgets"
        >
          {/* Multi-color app menu icon (3x3 grid of primary brand colors) */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="drop-shadow-sm">
            <circle cx="7" cy="7" r="3" fill="#007BFF" /> {/* smartSchool-blue */}
            <circle cx="16" cy="7" r="3" fill="#FFDC00" /> {/* smartSchool-yellow */}
            <circle cx="25" cy="7" r="3" fill="#FF4136" /> {/* smartSchool-red */}
            <circle cx="7" cy="16" r="3" fill="#007BFF" />
            <circle cx="16" cy="16" r="3" fill="#FFDC00" />
            <circle cx="25" cy="16" r="3" fill="#FF4136" />
            <circle cx="7" cy="25" r="3" fill="#007BFF" />
            <circle cx="16" cy="25" r="3" fill="#FFDC00" />
            <circle cx="25" cy="25" r="3" fill="#FF4136" />
          </svg>
        </button>
        <div className="absolute left-16 bottom-1/2 translate-y-1/2 bg-white text-gray-700 px-4 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          Open widgets & tools
        </div>
      </div>
      {/* Modal for widget grid */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 sm:pt-32 backdrop-blur-md bg-transparent">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-3xl w-full relative border-2 border-smartSchool-blue/20">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition-colors" aria-label="Close widget menu"><X /></button>
            <h2 className="text-center mb-8 font-bold text-2xl font-poppins text-smartSchool-blue tracking-tight drop-shadow">App Widgets</h2>
            <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 justify-start">
              {widgetList.map(w => (
                <button key={w.key} onClick={() => setActive(w)}
                  className="flex flex-col items-center justify-center bg-white hover:bg-smartSchool-yellow/30 border-2 border-smartSchool-blue/10 rounded-xl p-4 w-32 h-32 shadow-md hover:shadow-lg transition group focus:outline-none focus:ring-2 focus:ring-smartSchool-blue min-w-[8rem] hover:animate-pop-on-hover cursor-pointer"
                  aria-label={w.label}
                >
                  <span className="mb-2 text-3xl group-hover:scale-110 transition-transform drop-shadow-sm group-hover:animate-wiggle">{w.icon}</span>
                  <span className="font-semibold text-sm text-gray-800 group-hover:text-smartSchool-blue text-center font-poppins tracking-tight">{w.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Modal for active widget */}
      {active && (
        <div className="fixed inset-0 bg-white z-[300] flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-3xl w-full relative border-2 border-smartSchool-blue/20 max-h-[90vh] overflow-y-auto flex flex-col items-center">
            <button onClick={() => setActive(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition-colors" aria-label="Close widget"><X /></button>
            <h2 className="text-center mb-8 font-bold text-xl font-poppins text-smartSchool-blue tracking-tight drop-shadow">{active.label}</h2>
            <div className="w-full flex flex-col items-center">{active.component}</div>
          </div>
        </div>
      )}
    </>
  );
}
