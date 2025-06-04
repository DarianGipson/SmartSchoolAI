// Minimal Firestore test query for debugging
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export async function testFirestoreConnection() {
  try {
    const snapshot = await getDocs(collection(db, 'test'));
    console.log('Firestore test query success:', snapshot.size);
  } catch (error) {
    console.error('Firestore test query error:', error);
  }
}

// Call this function somewhere in your app startup to test
// testFirestoreConnection();
