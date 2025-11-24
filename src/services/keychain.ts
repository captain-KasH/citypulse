import * as Keychain from 'react-native-keychain';
import { STORAGE_KEYS } from '../utils/constants';

export const keychainService = {
  async storeUserCredentials(email: string, password: string): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        STORAGE_KEYS.USER_DATA,
        email,
        password
      );
      return true;
    } catch (error) {
      console.error('Error storing credentials:', error);
      return false;
    }
  },

  async getUserCredentials(): Promise<{ email: string; password: string } | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(STORAGE_KEYS.USER_DATA);
      if (credentials) {
        return {
          email: credentials.username,
          password: credentials.password,
        };
      }
      return null;
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  },

  async clearUserCredentials(): Promise<boolean> {
    try {
      await Keychain.resetInternetCredentials({ server: STORAGE_KEYS.USER_DATA });
      await Keychain.resetInternetCredentials({ server: 'AUTH_METHOD' });
      return true;
    } catch (error) {
      console.error('Error clearing credentials:', error);
      return false;
    }
  },

  async storeAuthMethod(method: 'email' | 'google'): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        'AUTH_METHOD',
        'auth_method',
        method
      );
      return true;
    } catch (error) {
      console.error('Error storing auth method:', error);
      return false;
    }
  },

  async getAuthMethod(): Promise<'email' | 'google' | null> {
    try {
      const credentials = await Keychain.getInternetCredentials('AUTH_METHOD');
      return credentials ? credentials.password as 'email' | 'google' : null;
    } catch (error) {
      return null;
    }
  },

  async storeFavorites(favorites: string[]): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        STORAGE_KEYS.FAVORITES,
        'favorites',
        JSON.stringify(favorites)
      );
      return true;
    } catch (error) {
      console.error('Error storing favorites:', error);
      return false;
    }
  },

  async getFavorites(): Promise<string[]> {
    try {
      const credentials = await Keychain.getInternetCredentials(STORAGE_KEYS.FAVORITES);
      if (credentials) {
        return JSON.parse(credentials.password);
      }
      return [];
    } catch (error) {
      console.error('Error retrieving favorites:', error);
      return [];
    }
  },

  async storeGoogleBiometricFlag(enabled: boolean): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        'GOOGLE_BIOMETRIC_FLAG',
        'google_biometric',
        enabled.toString()
      );
      return true;
    } catch (error) {
      console.error('Error storing Google biometric flag:', error);
      return false;
    }
  },

  async getGoogleBiometricFlag(): Promise<boolean> {
    try {
      const credentials = await Keychain.getInternetCredentials('GOOGLE_BIOMETRIC_FLAG');
      return credentials ? credentials.password === 'true' : false;
    } catch (error) {
      return false;
    }
  },
};