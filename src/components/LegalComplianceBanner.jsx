import React from 'react';

const LegalComplianceBanner = () => (
  <div style={{ background: '#fef3c7', color: '#92400e', padding: '10px', textAlign: 'center', fontSize: '0.95rem', borderBottom: '1px solid #fde68a' }}>
    <strong>Notice:</strong> SmartSchool AI uses artificial intelligence to generate educational content. All user interactions are logged for safety and compliance. The platform complies with COPPA, FERPA, and GDPR. For details, see our <a href="/PrivacyPolicy.txt" target="_blank" rel="noopener noreferrer" style={{ color: '#92400e', textDecoration: 'underline' }}>Privacy Policy</a> and <a href="/Disclaimer.txt" target="_blank" rel="noopener noreferrer" style={{ color: '#92400e', textDecoration: 'underline' }}>Disclaimer</a>.
  </div>
);

export default LegalComplianceBanner;
