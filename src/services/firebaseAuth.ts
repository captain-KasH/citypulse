import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User } from '../modules/auth/redux/authSlice';

// Reference for the implementation https://rnfirebase.io/

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends LoginCredentials {
  name: string;
}

// Configure Google Sign-In
// ToDo:: move to .env
GoogleSignin.configure({
  // webClientId: '609903104796-4a41ff0791d31bd6fae0d9.apps.googleusercontent.com',
  iosClientId: '609903104796-mo2004vpr46d5e699hkrif85ehl76ecn.apps.googleusercontent.com',
});

export const firebaseAuthService = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      
      const firebaseUser = userCredential.user;
      const user: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        isGuest: false,
      };

      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async signUp(data: SignUpData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        data.email,
        data.password
      );
      
      // Update display name
      await userCredential.user.updateProfile({
        displayName: data.name,
      });

      const firebaseUser = userCredential.user;
      const user: User = {
        id: firebaseUser.uid,
        name: data.name,
        email: firebaseUser.email || '',
        isGuest: false,
      };

      return { success: true, user };
    } catch (error: any) {
      console.log('signUp error', error.message);
      return { success: false, error: error.message };
    }
  },

  async loginAsGuest(): Promise<{ success: boolean; user?: User }> {
    try {
      const userCredential = await auth().signInAnonymously();
      const firebaseUser = userCredential.user;
      
      const user: User = {
        id: firebaseUser.uid,
        name: 'Guest User',
        email: '',
        isGuest: true,
      };

      return { success: true, user };
    } catch (error) {
      return { success: false };
    }
  },

  async logout(): Promise<boolean> {
    try {
      await auth().signOut();
      return true;
    } catch (error) {
      return false;
    }
  },

  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  },

  async signInWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data?.idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      const firebaseUser = userCredential.user;
      const user: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        isGuest: false,
      };

      return { success: true, user };
    } catch (error: any) {
      console.log('signInWithGoogle error', error.message);
      return { success: false, error: error.message };
    }
  },

  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return auth().onAuthStateChanged(callback);
  },
};