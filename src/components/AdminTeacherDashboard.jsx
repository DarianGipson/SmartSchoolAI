import React from 'react';
import { getProgressSummary } from '../lib/aiLessonEngine';

/**
 * AdminTeacherDashboard - Full dashboard for teachers/admins to monitor all students.
 * @param {Object} props
 * @param {Array} props.students - Array of student profile objects.
 */
export default function AdminTeacherDashboard({ students }) {
  return (
    <div style={{maxWidth: 1000, margin: '0 auto', fontFamily: 'Open Sans, sans-serif'}}>
      <h2>Admin/Teacher Dashboard</h2>
      <table style={{width: '100%', borderCollapse: 'collapse', marginTop: 24}}>
        <thead>
          <tr style={{background: '#f0f0f0'}}>
            <th style={{padding: 8, border: '1px solid #ccc'}}>Student</th>
            <th style={{padding: 8, border: '1px solid #ccc'}}>Grade</th>
            <th style={{padding: 8, border: '1px solid #ccc'}}>Overall Mastery</th>
            <th style={{padding: 8, border: '1px solid #ccc'}}>Strengths</th>
            <th style={{padding: 8, border: '1px solid #ccc'}}>Weaknesses</th>
            <th style={{padding: 8, border: '1px solid #ccc'}}>Lessons Completed</th>
            <th style={{padding: 8, border: '1px solid #ccc'}}>Time Spent (min)</th>
            <th style={{padding: 8, border: '1px solid #ccc'}}>Retries</th>
          </tr>
        </thead>
        <tbody>
          {students.map((profile, idx) => {
            const summary = getProgressSummary(profile);
            return (
              <tr key={profile.id || idx}>
                <td style={{padding: 8, border: '1px solid #ccc'}}>{profile.id}</td>
                <td style={{padding: 8, border: '1px solid #ccc'}}>{profile.grade}</td>
                <td style={{padding: 8, border: '1px solid #ccc'}}>{summary.overallMastery}%</td>
                <td style={{padding: 8, border: '1px solid #ccc'}}>{summary.strengths.join(', ') || '—'}</td>
                <td style={{padding: 8, border: '1px solid #ccc'}}>{summary.weaknesses.join(', ') || '—'}</td>
                <td style={{padding: 8, border: '1px solid #ccc'}}>{summary.lessonsCompleted}</td>
                <td style={{padding: 8, border: '1px solid #ccc'}}>{summary.totalTimeSpent}</td>
                <td style={{padding: 8, border: '1px solid #ccc'}}>{summary.retries}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
