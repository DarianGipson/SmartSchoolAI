// src/pages/curriculum/SubjectsPage.jsx
import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CurriculumContext } from '@/contexts/CurriculumContext';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SubjectsPage = () => {
  const { grade } = useParams();
  const { curriculumData } = useContext(CurriculumContext);
  const gradeObj = curriculumData.find((g) => g.grade === grade);
  if (!gradeObj) return <p>Grade not found</p>;

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {gradeObj.subjects.map((s) => (
        <motion.div key={s.subject} variants={cardVariants}>
          <Link to={`/curriculum/${encodeURIComponent(grade)}/${encodeURIComponent(s.subject)}`}>  
            <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-center">{s.subject}</h2>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SubjectsPage;
