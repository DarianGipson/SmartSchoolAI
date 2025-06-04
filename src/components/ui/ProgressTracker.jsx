import React from 'react';
import { motion } from 'framer-motion';

const ProgressTracker = ({ completed, total }) => {
  const percent = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div className="mb-4">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="bg-smartSchool-blue h-3"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {completed}/{total} lessons completed
      </p>
    </div>
  );
};

export default ProgressTracker;
