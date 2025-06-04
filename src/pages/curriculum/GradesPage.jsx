// src/pages/curriculum/GradesPage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CurriculumContext } from '@/contexts/CurriculumContext';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const GradesPage = () => {
  const { curriculumData } = useContext(CurriculumContext);

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {curriculumData.map((g) => (
        <motion.div key={g.grade} variants={cardVariants}>
          <Link to={`/curriculum/${encodeURIComponent(g.grade)}`}>  
            <div className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition">
              <h2 className="text-xl font-semibold text-center">{g.grade}</h2>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default GradesPage;
