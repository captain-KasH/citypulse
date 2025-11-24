import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User } from '../modules/auth/redux/authSlice';
import { keychainService } from './keychain';

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

// https://console.firebase.google.com/u/0/project/citypulse-a2b25/settings/general/ios:ae.com.abcd.citypulse
GoogleSignin.configure({
  webClientId: '609903104796-ivu5kigg70imoscuoog4dd4fs0a1fu3v.apps.googleusercontent.com',
  iosClientId: '609903104796-mo2004vpr46d5e699hkrif85ehl76ecn.apps.googleusercontent.com',
  offlineAccess: true,
 });

export const firebaseAuthService = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      
      // Store credentials and auth method for biometric login
      await keychainService.storeUserCredentials(credentials.email, credentials.password);
      await keychainService.storeAuthMethod('email');
      
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
      console.error('signUp error', error.message);
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

  async logout(clearCredentials: boolean = false): Promise<boolean> {
    try {
      const authMethod = await keychainService.getAuthMethod();
      
      // For Google users with biometric enabled, don't sign out from Google
      if (authMethod === 'google') {
        const biometricFlag = await keychainService.getGoogleBiometricFlag();
        if (!biometricFlag) {
          await GoogleSignin.signOut();
        }
      }
      
      // Sign out from Firebase
      await auth().signOut();
      
      // Only clear stored credentials if explicitly requested
      if (clearCredentials) {
        await keychainService.clearUserCredentials();
      }
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
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
      const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data?.idToken || null);
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      const firebaseUser = userCredential.user;
      const user: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        isGuest: false,
        photoURL: firebaseUser.photoURL || undefined,
      };

      // Store auth method and biometric flag for Google login
      await keychainService.storeAuthMethod('google');
      await keychainService.storeGoogleBiometricFlag(true);
      return { success: true, user };
    } catch (error: any) {
      console.error('signInWithGoogle error', error);
      return { success: false, error: 'Google Sign-In failed' };
    }
  },



  async biometricGoogleSignIn(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // First check if there's a current Firebase user
      const currentUser = auth().currentUser;
      if (currentUser) {
        const user: User = {
          id: currentUser.uid,
          name: currentUser.displayName || 'User',
          email: currentUser.email || '',
          isGuest: false,
          photoURL: currentUser.photoURL || undefined,
        };
        return { success: true, user };
      }

      // If no current user, try silent Google Sign-In
      const signInResult = await GoogleSignin.signInSilently();
      const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data?.idToken || null);
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      const firebaseUser = userCredential.user;
      const user: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        isGuest: false,
        photoURL: firebaseUser.photoURL || undefined,
      };

      return { success: true, user };
    } catch (error: any) {
      console.log('Biometric Google Sign-In failed:', error.message);
      return { success: false, error: 'Biometric authentication failed' };
    }
  },

  onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return auth().onAuthStateChanged(callback);
  },
};