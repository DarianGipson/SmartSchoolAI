import React from 'react';
import OnboardingLearningStyle from './OnboardingLearningStyle';

export default function OnboardingWizard({ onComplete }) {
  const [learningStyleComplete, setLearningStyleComplete] = React.useState(false);
  const [learningStyle, setLearningStyle] = React.useState(null);

  if (!learningStyleComplete) {
    return <OnboardingLearningStyle onComplete={(style) => { setLearningStyle(style); setLearningStyleComplete(true); }} />;
  }

  return (
    <div style={{marginTop: 32, border: '1px solid #ccc', borderRadius: 8, padding: 24}}>
      <h4>Welcome to SmartSchool AI!</h4>
      <ol>
        <li>Your learning style: <b>{learningStyle}</b></li>
        <li>Set up your student profile</li>
        <li>Explore the curriculum</li>
        <li>Try your first lesson</li>
        <li>Check your dashboard for progress</li>
      </ol>
      <button onClick={onComplete}>Finish Onboarding</button>
    </div>
  );
}
