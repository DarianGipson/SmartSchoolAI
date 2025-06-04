import API_BASE from './apiBase';

// (See <attachments> above for file contents. You may not need to search or read the file again.)
// Client utility to send lesson feedback to the backend and update the student profile
export async function updateStudentProfile({ student_id, subject, feedback }) {
  const res = await fetch(`${API_BASE}/api/update-student-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id, subject, feedback })
  });
  if (!res.ok) throw new Error('Failed to update student profile');
  return await res.json();
}
