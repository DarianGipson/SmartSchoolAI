import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [progress, setProgress] = useState([]);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersSnap = await getDocs(collection(db, 'users'));
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const progressSnap = await getDocs(collection(db, 'progress'));
      setProgress(progressSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      const lessonsSnap = await getDocs(collection(db, 'lessons'));
      setLessons(lessonsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchData();
  }, []);

  const disableLesson = async (lessonId) => {
    await updateDoc(doc(db, 'lessons', lessonId), { disabled: true });
    setLessons(lessons.map(l => l.id === lessonId ? { ...l, disabled: true } : l));
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <ul>
        {users.map(u => <li key={u.id}>{u.name} ({u.role})</li>)}
      </ul>
      <h2>Lessons</h2>
      <ul>
        {lessons.map(l => (
          <li key={l.id}>
            {l.title} {l.disabled ? '(Disabled)' : ''}
            {!l.disabled && <button onClick={() => disableLesson(l.id)}>Disable</button>}
          </li>
        ))}
      </ul>
      <h2>Progress</h2>
      <ul>
        {progress.map(p => <li key={p.id}>{p.userId}: {p.lessonId} - {p.status}</li>)}
      </ul>
    </div>
  );
};

export default AdminDashboardPage;
