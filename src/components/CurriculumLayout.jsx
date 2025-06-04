import React, { useContext } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CurriculumContext } from '@/contexts/CurriculumContext';
import ProgressTracker from '@/components/ui/ProgressTracker';

const CurriculumLayout = () => {
  const { grade, subject, lesson } = useParams();
  const { curriculumData, completedLessons } = useContext(CurriculumContext);

  const crumbs = [
    { label: 'Curriculum', to: '/curriculum' }
  ];
  if (grade) crumbs.push({ label: grade, to: `/curriculum/${encodeURIComponent(grade)}` });
  if (subject) crumbs.push({ label: subject, to: `/curriculum/${encodeURIComponent(grade)}/${encodeURIComponent(subject)}` });
  if (lesson) crumbs.push({ label: lesson, to: `/curriculum/${encodeURIComponent(grade)}/${encodeURIComponent(subject)}/${encodeURIComponent(lesson)}` });

  const totalLessons = curriculumData.reduce(
    (sum, g) => sum + g.subjects.reduce((s2, sub) => s2 + sub.lessons.length, 0),
    0
  );

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Example async handler for navigation or data refresh (customize as needed)
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate async refresh or navigation logic
      await Promise.resolve();
    } catch (e) {
      setError('Failed to refresh curriculum. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Visually hidden live region for accessibility
  const liveRegionStyles = {
    position: 'absolute',
    left: '-9999px',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
  };

  // Fallback if curriculumData is empty or not loaded
  if (!curriculumData || curriculumData.length === 0) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div role="status" aria-live="polite" style={liveRegionStyles}>
          {loading ? 'Loading curriculum...' : error ? error : ''}
        </div>
        <div style={{textAlign: 'center', marginTop: 40}}>
          <h2>Curriculum Not Available</h2>
          <p>Please try refreshing or check back later.</p>
          <button
            onClick={handleRefresh}
            aria-label="Refresh curriculum"
            disabled={loading}
            style={{marginTop: 16, fontSize: '1em'}}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          {error && <div style={{color: 'red', marginTop: 12}}>{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <nav className="text-gray-600 mb-4" aria-label="Breadcrumb">
        {crumbs.map((c, i) => (
          <span key={i}>
            {i > 0 && ' / '}
            <Link to={c.to} className="hover:underline" aria-label={`Go to ${c.label}`}>{c.label}</Link>
          </span>
        ))}
        <button
          onClick={handleRefresh}
          style={{marginLeft: 16, fontSize: '0.95em'} }
          aria-label="Refresh curriculum"
          disabled={loading}
        >
          {loading ? <span aria-live="polite" aria-busy="true">🔄 Refreshing...</span> : 'Refresh'}
        </button>
      </nav>
      <div role="status" aria-live="polite" style={liveRegionStyles}>
        {loading ? 'Refreshing curriculum...' : error ? error : ''}
      </div>
      <ProgressTracker completed={completedLessons.length} total={totalLessons} />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } } }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default CurriculumLayout;
