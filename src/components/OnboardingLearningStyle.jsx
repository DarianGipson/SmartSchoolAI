import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// More detailed, longer, and grade-specific learning style questions
const learningStyleQuestionsByGrade = {
  'PreK': [
    {
      id: 'q1',
      question: 'What do you like most when you play?',
      options: [
        { label: 'Looking at colorful books or pictures', value: 'visual' },
        { label: 'Listening to songs or stories', value: 'auditory' },
        { label: 'Building with blocks or playing with toys', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q2',
      question: 'How do you like to learn new things?',
      options: [
        { label: 'Watching your teacher show you', value: 'visual' },
        { label: 'Hearing your teacher talk or sing', value: 'auditory' },
        { label: 'Touching and trying things yourself', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q3',
      question: 'What is your favorite activity?',
      options: [
        { label: 'Drawing or coloring', value: 'visual' },
        { label: 'Singing or listening to music', value: 'auditory' },
        { label: 'Dancing or playing outside', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q4',
      question: 'How do you like to show what you know?',
      options: [
        { label: 'Pointing to pictures', value: 'visual' },
        { label: 'Telling a story', value: 'auditory' },
        { label: 'Acting it out', value: 'kinesthetic' },
      ],
    },
  ],
  'Kindergarten': [
    {
      id: 'q1',
      question: 'What do you like to do in class?',
      options: [
        { label: 'Look at books or pictures', value: 'visual' },
        { label: 'Listen to stories or music', value: 'auditory' },
        { label: 'Play games or use your hands', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q2',
      question: 'How do you remember things best?',
      options: [
        { label: 'Seeing them', value: 'visual' },
        { label: 'Hearing them', value: 'auditory' },
        { label: 'Doing them', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q3',
      question: 'What is your favorite way to learn?',
      options: [
        { label: 'Watching videos or looking at pictures', value: 'visual' },
        { label: 'Listening to songs or stories', value: 'auditory' },
        { label: 'Building or making things', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q4',
      question: 'How do you like to show what you learned?',
      options: [
        { label: 'Drawing or showing pictures', value: 'visual' },
        { label: 'Telling or singing', value: 'auditory' },
        { label: 'Acting or building', value: 'kinesthetic' },
      ],
    },
  ],
  'Grade 1': [
    {
      id: 'q1',
      question: 'When you read a story, what helps you understand it?',
      options: [
        { label: 'Looking at the pictures', value: 'visual' },
        { label: 'Listening to someone read', value: 'auditory' },
        { label: 'Acting out the story', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q2',
      question: 'How do you like to solve math problems?',
      options: [
        { label: 'Drawing or using objects', value: 'visual' },
        { label: 'Saying the steps out loud', value: 'auditory' },
        { label: 'Using your fingers or moving things', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q3',
      question: 'What do you like to do in science?',
      options: [
        { label: 'Look at pictures or watch experiments', value: 'visual' },
        { label: 'Listen to explanations', value: 'auditory' },
        { label: 'Do experiments yourself', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q4',
      question: 'How do you like to show what you learned?',
      options: [
        { label: 'Draw or make a chart', value: 'visual' },
        { label: 'Tell someone about it', value: 'auditory' },
        { label: 'Build or act it out', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q5',
      question: 'What is your favorite way to learn new words?',
      options: [
        { label: 'See them written', value: 'visual' },
        { label: 'Hear them spoken', value: 'auditory' },
        { label: 'Use them in a game', value: 'kinesthetic' },
      ],
    },
  ],
  'Grade 2': [
    {
      id: 'q1',
      question: 'When you study, what helps you focus best?',
      options: [
        { label: 'Having a quiet space', value: 'auditory' },
        { label: 'Listening to music', value: 'auditory' },
        { label: 'Using noise-canceling headphones', value: 'auditory' },
      ],
    },
    {
      id: 'q2',
      question: 'How do you like to organize your notes?',
      options: [
        { label: 'Using colors and drawings', value: 'visual' },
        { label: 'Writing everything down in order', value: 'visual' },
        { label: 'Recording and listening to them', value: 'auditory' },
      ],
    },
    {
      id: 'q3',
      question: 'What helps you learn about new places or topics?',
      options: [
        { label: 'Looking at maps or pictures', value: 'visual' },
        { label: 'Listening to descriptions or stories', value: 'auditory' },
        { label: 'Exploring or visiting the places', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q4',
      question: 'How do you prefer to practice new skills?',
      options: [
        { label: 'Watching someone do it first', value: 'visual' },
        { label: 'Hearing instructions', value: 'auditory' },
        { label: 'Trying it out yourself', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q5',
      question: 'What is your favorite subject, and why?',
      options: [
        { label: 'Art, because I love to draw and create', value: 'visual' },
        { label: 'Music, because I enjoy singing and listening', value: 'auditory' },
        { label: 'PE, because I like to move and play sports', value: 'kinesthetic' },
      ],
    },
  ],
  'Grade 3': [
    {
      id: 'q1',
      question: 'When learning about history, what helps you remember events best?',
      options: [
        { label: 'Looking at timelines or maps', value: 'visual' },
        { label: 'Listening to stories or lectures', value: 'auditory' },
        { label: 'Reenacting events or using models', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q2',
      question: 'How do you like to explore new topics in science?',
      options: [
        { label: 'Watching videos or demonstrations', value: 'visual' },
        { label: 'Listening to explanations or podcasts', value: 'auditory' },
        { label: 'Conducting experiments or building models', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q3',
      question: 'What is your preferred way to work on math problems?',
      options: [
        { label: 'Seeing examples worked out', value: 'visual' },
        { label: 'Hearing the steps explained', value: 'auditory' },
        { label: 'Using physical objects to solve them', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q4',
      question: 'How do you like to show your understanding of a topic?',
      options: [
        { label: 'Creating a poster or drawing', value: 'visual' },
        { label: 'Giving a speech or presentation', value: 'auditory' },
        { label: 'Performing a skit or building a model', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q5',
      question: 'What helps you stay organized with your schoolwork?',
      options: [
        { label: 'Using a planner or calendar', value: 'visual' },
        { label: 'Setting reminders on a device', value: 'auditory' },
        { label: 'Having a specific place for everything', value: 'kinesthetic' },
      ],
    },
  ],
  'Grade 4': [
    {
      id: 'q1',
      question: 'When reading a book, what helps you understand the characters better?',
      options: [
        { label: 'Looking at the illustrations', value: 'visual' },
        { label: 'Listening to the audiobook', value: 'auditory' },
        { label: 'Acting out the parts', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q2',
      question: 'How do you prefer to learn about different cultures?',
      options: [
        { label: 'Watching documentaries or videos', value: 'visual' },
        { label: 'Listening to music or stories from that culture', value: 'auditory' },
        { label: 'Trying foods or making crafts', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q3',
      question: 'What is your favorite way to practice spelling or vocabulary words?',
      options: [
        { label: 'Writing them out with colors', value: 'visual' },
        { label: 'Saying them out loud or singing', value: 'auditory' },
        { label: 'Using them in a game or activity', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q4',
      question: 'How do you like to receive feedback on your work?',
      options: [
        { label: 'Seeing comments or grades', value: 'visual' },
        { label: 'Hearing feedback in person or via audio', value: 'auditory' },
        { label: 'Receiving a certificate or physical reward', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q5',
      question: 'What helps you most when studying for a test?',
      options: [
        { label: 'Reviewing notes and highlighting key points', value: 'visual' },
        { label: 'Listening to review podcasts or discussions', value: 'auditory' },
        { label: 'Teaching the material to someone else', value: 'kinesthetic' },
      ],
    },
  ],
  'Grade 5': [
    {
      id: 'q1',
      question: 'When you study for a test, what helps you remember best?',
      options: [
        { label: 'Making diagrams or flashcards', value: 'visual' },
        { label: 'Explaining the material to someone', value: 'auditory' },
        { label: 'Doing practice problems or experiments', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q2',
      question: 'How do you like to learn new science concepts?',
      options: [
        { label: 'Watching videos or looking at models', value: 'visual' },
        { label: 'Listening to podcasts or lectures', value: 'auditory' },
        { label: 'Doing hands-on labs', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q3',
      question: 'What is your favorite way to work on group projects?',
      options: [
        { label: 'Making posters or slides', value: 'visual' },
        { label: 'Discussing ideas with the group', value: 'auditory' },
        { label: 'Building or acting out a skit', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q4',
      question: 'How do you like to show what you learned?',
      options: [
        { label: 'Create a visual project', value: 'visual' },
        { label: 'Give a presentation', value: 'auditory' },
        { label: 'Demonstrate or build something', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q5',
      question: 'How do you prefer to review your work?',
      options: [
        { label: 'Look over notes and diagrams', value: 'visual' },
        { label: 'Talk through answers with someone', value: 'auditory' },
        { label: 'Redo the activity or experiment', value: 'kinesthetic' },
      ],
    },
    {
      id: 'q6',
      question: 'What helps you most when you get stuck?',
      options: [
        { label: 'See an example', value: 'visual' },
        { label: 'Hear an explanation', value: 'auditory' },
        { label: 'Try it yourself', value: 'kinesthetic' },
      ],
    },
  ],
  // ...add more for higher grades (Grade 6-12) with more complex, subject-specific, and scenario-based questions...
};

function getQuestionsForGrade(grade) {
  // Try to match by grade, fallback to Grade 1 or Kindergarten
  return learningStyleQuestionsByGrade[grade] || learningStyleQuestionsByGrade['Grade 1'] || learningStyleQuestionsByGrade['Kindergarten'];
}

export default function OnboardingLearningStyle({ onComplete, grade }) {
  const questions = getQuestionsForGrade(grade);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);

  const handleSelect = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate learning style
      const counts = { visual: 0, auditory: 0, kinesthetic: 0 };
      Object.values({ ...answers, [qid]: value }).forEach((v) => counts[v]++);
      const style = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
      setResult(style);
      // Save to localStorage or call API to save to profile
      localStorage.setItem('learningStyle', style);
      if (onComplete) onComplete(style);
    }
  };

  if (result) {
    return (
      <div className="p-6 rounded-lg border bg-white max-w-md mx-auto mt-10 text-center">
        <h2 className="text-xl font-bold mb-4">Your Learning Style: <span className="capitalize">{result}</span></h2>
        <p className="mb-4">We'll personalize your lessons to match your preferred way to learn!</p>
        <Button onClick={() => onComplete && onComplete(result)}>Continue</Button>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div className="p-6 rounded-lg border bg-white max-w-md mx-auto mt-10">
      <h2 className="text-lg font-semibold mb-4">Find Your Learning Style</h2>
      <p className="mb-6">{q.question}</p>
      <div className="space-y-3">
        {q.options.map((opt) => (
          <Button key={opt.value} className="w-full" onClick={() => handleSelect(q.id, opt.value)}>
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
