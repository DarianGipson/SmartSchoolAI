import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ParentDashboardPage from '@/pages/ParentDashboardPage';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, AuthContext } from '@/contexts/AuthContext';
import { CurriculumProvider } from '@/contexts/CurriculumContext';
import CurriculumLayout from '@/components/CurriculumLayout';
import GradesPage from '@/pages/curriculum/GradesPage';
import SubjectsPage from '@/pages/curriculum/SubjectsPage';
import LessonsPage from '@/pages/curriculum/LessonsPage';
import LessonPage from '@/pages/curriculum/LessonPage';
import UserHomePage from '@/pages/UserHomePage';
import { ToolsPage } from './pages/ToolsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProgressTab from '@/pages/ProgressTab';

function RequireAuth({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const { user, loading } = useContext(AuthContext);
  const isAuthenticated = !!user;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <CurriculumProvider>
        <Layout>
          <Routes>
            {!isAuthenticated && (
              <>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </>
            )}
            {/* All authenticated routes are now protected by RequireAuth */}
            <Route
              path="/dashboard"
              element={<RequireAuth><DashboardPage /></RequireAuth>}
            />
            <Route
              path="/parent-dashboard"
              element={<RequireAuth><ParentDashboardPage /></RequireAuth>}
            />
            <Route
              path="/user-home"
              element={<RequireAuth><UserHomePage /></RequireAuth>}
            />
            <Route
              path="/curriculum"
              element={<RequireAuth><CurriculumLayout /></RequireAuth>}
            >
              <Route index element={<GradesPage />} />
              <Route path=":grade" element={<SubjectsPage />} />
              <Route path=":grade/:subject" element={<LessonsPage />} />
              <Route path=":grade/:subject/:lessonId" element={<LessonPage />} />
            </Route>
            <Route
              path="/tools"
              element={<RequireAuth><ToolsPage /></RequireAuth>}
            />
            <Route
              path="/admin"
              element={<RequireAuth><AdminDashboardPage /></RequireAuth>}
            />
            <Route
              path="/progress"
              element={<RequireAuth><ProgressTab /></RequireAuth>}
            />
            {/* <Route
              path="/all-widgets"
              element={<RequireAuth><AllWidgetsPage /></RequireAuth>}
            /> */}
            {/* Fallback: redirect all other routes to login if not authenticated */}
            {!isAuthenticated && <Route path="*" element={<Navigate to="/login" replace />} />}
          </Routes>
        </Layout>
      </CurriculumProvider>
    </AuthProvider>
  );
}

export default App;