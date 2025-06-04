import React, { createContext, useState, useEffect, useContext } from 'react';
import staticCurriculumData from '@/data/curriculum'; // Renamed for clarity
import { AuthContext } from './AuthContext'; // Import AuthContext

export const CurriculumContext = createContext();

export const CurriculumProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // Get the current user
  const [userProgress, setUserProgress] = useState({ completedLessons: [] });

  // Load user-specific progress when user changes
  useEffect(() => {
    if (user && user.id) {
      try {
        const storedProgress = localStorage.getItem(`userProgress_${user.id}`);
        if (storedProgress) {
          setUserProgress(JSON.parse(storedProgress));
        } else {
          // Initialize with empty progress for a new user or if no storage found
          setUserProgress({ completedLessons: [] });
        }
      } catch (error) {
        console.error("Failed to load user progress:", error);
        setUserProgress({ completedLessons: [] }); // Reset on error
      }
    } else {
      // No user logged in, reset progress or handle as needed
      setUserProgress({ completedLessons: [] });
    }
  }, [user]);

  // Save user-specific progress whenever it changes
  useEffect(() => {
    if (user && user.id && userProgress) {
      try {
        localStorage.setItem(`userProgress_${user.id}`, JSON.stringify(userProgress));
      } catch (error) {
        console.error("Failed to save user progress:", error);
      }
    }
  }, [user, userProgress]);

  const markLessonComplete = (lessonId) => {
    setUserProgress(prevProgress => {
      if (!prevProgress.completedLessons.includes(lessonId)) {
        return {
          ...prevProgress,
          completedLessons: [...prevProgress.completedLessons, lessonId]
        };
      }
      return prevProgress;
    });
  };
  
  const isLessonCompleted = (lessonId) => {
    return userProgress.completedLessons.includes(lessonId);
  };

  // The curriculumData itself remains static for now
  // For a truly individual curriculum structure, curriculumData would also need to be user-specific
  return (
    <CurriculumContext.Provider value={{ curriculumData: staticCurriculumData, userProgress, markLessonComplete, isLessonCompleted, completedLessons: userProgress.completedLessons }}>
      {children}
    </CurriculumContext.Provider>
  );
};
