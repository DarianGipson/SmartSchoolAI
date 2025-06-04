import React, { useState } from 'react';
import ParentDashboard from './ParentDashboard';
import GamificationPanel from './GamificationPanel';
import Certificate from './Certificate';
import TutorChat from './TutorChat';

/**
 * AllInOneSchoolDashboard - Combines all advanced features for parents and students.
 * @param {Object} props
 * @param {Object} props.profile - The student profile object.
 * @param {Array} props.recommendations - Array of recommended next topics.
 * @param {Function} props.onSendMessage - Function to send a message to the AI tutor.
 * @param {Array} props.messages - Array of chat messages.
 */
export default function AllInOneSchoolDashboard({ profile, recommendations, onSendMessage, messages }) {
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateType, setCertificateType] = useState('progress');

  return (
    <div style={{padding: 24}}>
      <ParentDashboard profile={profile} recommendations={recommendations} />
      <GamificationPanel profile={profile} />
      <TutorChat profile={profile} onSendMessage={onSendMessage} messages={messages} />
      <div style={{marginTop: 32}}>
        <button onClick={() => { setShowCertificate(true); setCertificateType('progress'); }} style={{marginRight: 8}}>
          Show Progress Certificate
        </button>
        <button onClick={() => { setShowCertificate(true); setCertificateType('graduation'); }}>
          Show Graduation Certificate
        </button>
      </div>
      {showCertificate && (
        <Certificate profile={profile} type={certificateType} />
      )}
    </div>
  );
}
