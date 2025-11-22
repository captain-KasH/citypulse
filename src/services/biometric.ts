import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export interface BiometricResult {
  success: boolean;
  error?: string;
  biometryType?: BiometryTypes;
}

export const biometricService = {
  /**
   * Check if biometric authentication is available
   */
  async isBiometricAvailable(): Promise<BiometricResult> {
    try {
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      return {
        success: available,
        biometryType,
        error: available ? undefined : 'Biometric authentication not available'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to check biometric availability'
      };
    }
  },

  /**
   * Authenticate using biometrics
   */
  async authenticate(promptMessage: string = 'Authenticate to continue'): Promise<BiometricResult> {
    try {
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Cancel'
      });
      
      return {
        success,
        error: success ? undefined : 'Authentication failed or cancelled'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Biometric authentication error'
      };
    }
  }
};