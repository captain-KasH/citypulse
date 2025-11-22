import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { mockAuthService } from './mockAuth';
import { loginSuccess } from '../../store/slices/authSlice';
import { COLORS, SIZES } from '../../utils/constants';

const LandingScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    const result = await mockAuthService.loginAsGuest();
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
    const result = await mockAuthService.login({ email, password });
    setLoading(false);

    if (result.success && result.user) {
      dispatch(loginSuccess(result.user));
    } else {
      Alert.alert(t('auth.loginFailed'), result.error || t('auth.tryAgain'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
            variant="secondary"
            style={styles.button}
          />
          
          <Button
            title={t('auth.signInGoogle')}
            onPress={() => {/* Placeholder for Phase 2 */}}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.PADDING * 2,
    justifyContent: 'center',
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