import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';

export const initializeFirebase = async () => {
  try {
    // Check if Firebase is already initialized
    if (firebase.apps.length === 0) {
      console.log('No Firebase apps found, waiting for initialization...');
      return;
    }
    
    // Test Firestore connection
    const firestore = firebase.firestore();
    await firestore.enableNetwork();
    console.log('Firebase and Firestore initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
};

export default firebase;