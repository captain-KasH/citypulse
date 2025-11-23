import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { firebaseAuthService } from '../../services/firebaseAuth';
import { loginSuccess } from '../../store/slices/authSlice';
import { biometricService } from '../../services/biometric';
import { keychainService } from '../../services/keychain';
import { COLORS, SIZES } from '../../utils/constants';

const LandingScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { biometricEnabled } = useSelector((state: RootState) => state.app);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  React.useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const result = await biometricService.isBiometricAvailable();
    setBiometricAvailable(result.success);
  };

  const handleBiometricLogin = async () => {
    setBiometricLoading(true);
    const result = await biometricService.authenticate(t('auth.biometricPrompt'));
    if (result.success) {
      // Check auth method
      const authMethod = await keychainService.getAuthMethod();
      
      if (authMethod === 'email') {
        // Try to get stored credentials for email login
        const credentials = await keychainService.getUserCredentials();
        if (credentials) {
          const authResult = await firebaseAuthService.login(credentials);
          if (authResult.success && authResult.user) {
            dispatch(loginSuccess(authResult.user));
          } else {
            Alert.alert(t('auth.loginFailed'), t('auth.storedCredentialsInvalid'));
          }
        } else {
          Alert.alert(t('auth.biometricFailed'), t('auth.noStoredCredentials'));
        }
      } else {
        Alert.alert(t('auth.biometricFailed'), t('auth.noStoredCredentials'));
      }
    } else {
      Alert.alert(t('auth.biometricFailed'), result.error || t('auth.tryAgain'));
    }
    setBiometricLoading(false);
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    const result = await firebaseAuthService.loginAsGuest();
    setGuestLoading(false);
    
    if (result.success && result.user) {
      dispatch(loginSuccess(result.user));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.fillAllFields'));
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert(t('auth.invalidEmail'), t('auth.enterValidEmail'));
      return;
    }

    setLoading(true);
    const result = await firebaseAuthService.login({ email, password });
    setLoading(false);

    if (result.success && result.user) {
      dispatch(loginSuccess(result.user));
    } else {
      Alert.alert(t('auth.loginFailed'), result.error || t('auth.tryAgain'));
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const result = await firebaseAuthService.signInWithGoogle();
    setGoogleLoading(false);

    if (result.success && result.user) {
      dispatch(loginSuccess(result.user));
    } else {
      Alert.alert(t('auth.loginFailed'), result.error || t('auth.tryAgain'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>{t('auth.welcomeTitle')}</Text>
              <Text style={styles.subtitle}>{t('auth.welcomeSubtitle')}</Text>
            </View>

            <View style={styles.formContainer}>
              <Input
                label={t('auth.email')}
                placeholder={t('auth.enterEmail')}
                value={email}
                onChangeText={setEmail}
              />
              
              <Input
                label={t('auth.password')}
                placeholder={t('auth.enterPassword')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Button
                title={t('auth.login')}
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
              />
              
              <Button
                title={t('auth.guestMode')}
                onPress={handleGuestLogin}
                loading={guestLoading}
                variant="secondary"
                style={styles.button}
              />
              
              {biometricAvailable && biometricEnabled && (
                <Button
                  title={t('auth.biometricLogin')}
                  onPress={handleBiometricLogin}
                  loading={biometricLoading}
                  variant="outline"
                  style={styles.button}
                />
              )}
              
              <Button
                title={t('auth.signInGoogle')}
                onPress={handleGoogleSignIn}
                loading={googleLoading}
                variant="outline"
                style={[styles.button, styles.googleButton]}
              />
              
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>{t('auth.noAccount')} </Text>
                <Text 
                  style={styles.signupLink}
                  onPress={() => navigation.navigate('SignUp' as never)}
                >
                  {t('auth.registerHere')}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: SIZES.PADDING * 2,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
  formContainer: {
    gap: 16,
  },
  loginButton: {
    marginTop: 10,
  },
  button: {
    width: '100%',
  },
  googleButton: {
    marginTop: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  signupLink: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
});

export default LandingScreen;