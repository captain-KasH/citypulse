import { User } from '../../store/slices/authSlice';
import { keychainService } from '../../services/keychain';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends LoginCredentials {
  name: string;
}

// Mock user database
const mockUsers: User[] = [];

export const mockAuthService = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists in mock database
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Store credentials securely
      await keychainService.storeUserCredentials(credentials.email, credentials.password);

      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  },

  async signUp(data: SignUpData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        isGuest: false,
      };

      mockUsers.push(newUser);

      // Store credentials securely
      await keychainService.storeUserCredentials(data.email, data.password);

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Sign up failed' };
    }
  },

  async loginAsGuest(): Promise<{ success: boolean; user?: User }> {
    const guestUser: User = {
      id: 'guest',
      name: 'Guest User',
      email: '',
      isGuest: true,
    };

    return { success: true, user: guestUser };
  },

  async logout(): Promise<boolean> {
    try {
      await keychainService.clearUserCredentials();
      return true;
    } catch (error) {
      return false;
    }
  },
};