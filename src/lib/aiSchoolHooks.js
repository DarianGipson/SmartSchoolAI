// (See <attachments> above for file contents. You may not need to search or read the file again.)
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import API_BASE from './apiBase';

export function useStudentProfile(studentId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    getDoc(doc(db, 'students', studentId)).then(snap => {
      setProfile(snap.exists() ? snap.data() : null);
      setLoading(false);
    });
  }, [studentId]);

  const updateProfile = useCallback(async (updates) => {
    if (!studentId) return;
    await updateDoc(doc(db, 'students', studentId), updates);
    setProfile(prev => ({ ...prev, ...updates }));
  }, [studentId]);

  return { profile, loading, updateProfile };
}

export function useLesson(studentId, lessonId) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId || !lessonId) return;
    setLoading(true);
    getDoc(doc(db, 'students', studentId, 'lessons', lessonId)).then(snap => {
      setLesson(snap.exists() ? snap.data() : null);
      setLoading(false);
    });
  }, [studentId, lessonId]);

  return { lesson, loading };
}

export async function onboardStudent({ name, age, parentEmail }) {
  const res = await fetch(`${API_BASE}/api/onboard-student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, age, parentEmail })
  });
  if (!res.ok) throw new Error('Failed to onboard student');
  return await res.json();
}

export async function generateLesson({ studentId, lessonData }) {
  const res = await fetch(`${API_BASE}/api/generate-assignment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: studentId, lessonData })
  });
  if (!res.ok) throw new Error('Failed to generate lesson');
  return await res.json();
}

export async function updateMastery({ student_id, mastery_updates, engagement_updates }) {
  const res = await fetch(`${API_BASE}/api/update-mastery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id, mastery_updates, engagement_updates })
  });
  if (!res.ok) throw new Error('Failed to update mastery');
  return await res.json();
}
