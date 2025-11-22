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
      await Keychain.resetInternetCredentials(STORAGE_KEYS.USER_DATA);
      return true;
    } catch (error) {
      console.error('Error clearing credentials:', error);
      return false;
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
};