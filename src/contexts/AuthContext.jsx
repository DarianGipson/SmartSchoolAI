import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc 
} from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); 
  const [students, setStudents] = useState([]); 
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        let userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          // Create a default user document if it doesn't exist
          await setDoc(userRef, {
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email,
            role: 'parent', // or 'student', adjust as needed
          });
          userDoc = await getDoc(userRef);
        }
        setUser({ uid: firebaseUser.uid, ...userDoc.data() });
        if (userDoc.data().role === 'parent') {
          loadParentStudents(firebaseUser.uid);
        }
      } else {
        setUser(null);
        setStudents([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Load learning style from localStorage if available
    const storedStyle = localStorage.getItem('learningStyle');
    if (storedStyle && user) {
      setUser((prev) => ({ ...prev, learningStyle: storedStyle }));
      // Optionally, update Firestore profile with learningStyle
      const userRef = doc(db, 'users', user.uid);
      updateDoc(userRef, { learningStyle: storedStyle });
    }
  }, [user]);

  const loadParentStudents = async (parentId) => {
    const q = query(collection(db, 'users'), where('role', '==', 'student'), where('parentId', '==', parentId));
    const snapshot = await getDocs(q);
    const parentStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setStudents(parentStudents);
  };

  const signup = async (name, email, password, role = 'parent') => {
    setAuthError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), { name, email, role });
      return true;
    } catch (e) {
      let message = 'Signup failed.';
      if (e.code === 'auth/email-already-in-use') message = 'Email already in use.';
      else if (e.code === 'auth/invalid-email') message = 'Invalid email address.';
      else if (e.code === 'auth/weak-password') message = 'Password is too weak.';
      setAuthError(message);
      console.error('AuthContext signup error:', e);
      return false;
    }
  };

  const login = async (email, password) => {
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const role = userDoc.exists() ? userDoc.data().role : null;
      // Redirect based on role
      if (role === 'parent') {
        navigate('/parent-dashboard');
      } else if (role === 'student') {
        navigate('/user-home');
      } else if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard'); // fallback for unknown roles
      }
      return true;
    } catch (e) {
      let message = 'Login failed.';
      if (e.code === 'auth/wrong-password') message = 'Incorrect password.';
      else if (e.code === 'auth/user-not-found') message = 'User not found.';
      else if (e.code === 'auth/invalid-email') message = 'Invalid email address.';
      setAuthError(message);
      console.error('AuthContext login error:', e);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setStudents([]);
    navigate('/');
  };

  const addStudent = async (studentData) => {
    if (!user || user.role !== 'parent') return false;
    try {
      // Create in users collection (for legacy/compatibility)
      const newUserRef = doc(collection(db, 'users'));
      await setDoc(newUserRef, { ...studentData, role: 'student', parentId: user.uid });
      // Create in students collection (for lessons/progress compatibility)
      const newStudentRef = doc(db, 'students', newUserRef.id);
      await setDoc(newStudentRef, { ...studentData, parentId: user.uid, userId: newUserRef.id });
      await loadParentStudents(user.uid);
      return true;
    } catch (e) {
      console.error('addStudent error:', e);
      return false;
    }
  };

  const getStudents = () => students;

  const updateStudent = async (updatedStudentData) => {
    if (!user || user.role !== 'parent') return false;
    try {
      await updateDoc(doc(db, 'users', updatedStudentData.id), updatedStudentData);
      await loadParentStudents(user.uid);
      return true;
    } catch (e) {
      return false;
    }
  };

  const deleteStudent = async (studentId) => {
    // Implement as needed (e.g., set disabled flag or delete doc)
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, users, students, signup, login, logout, addStudent, getStudents, updateStudent, deleteStudent, authError, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };