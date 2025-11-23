import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../auth/redux/authSlice';
import { setBiometricEnabled } from '../app/redux/appSlice';
import { firebaseAuthService } from '../../services/firebaseAuth';
import { biometricService } from '../../services/biometric';
import { keychainService } from '../../services/keychain';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import LanguageToggle from '../../components/LanguageToggle';
import { COLORS, SIZES } from '../../utils/constants';

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { language, biometricEnabled } = useSelector((state: RootState) => state.app);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const result = await biometricService.isBiometricAvailable();
    setBiometricAvailable(result.success);
  };

  const handleLogout = async () => {
    Alert.alert(
      t('auth.logout'),
      t('profile.logoutConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: async () => {
            await firebaseAuthService.logout();
            dispatch(logout());
          },
        },
      ]
    );
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (user?.isGuest || !biometricAvailable) return;
    
    if (value) {
      // Enable biometric - require authentication first
      const result = await biometricService.authenticate(t('profile.enableBiometricPrompt'));
      if (result.success) {
        // Enable biometric for all authenticated users
        dispatch(setBiometricEnabled(true));
        Alert.alert(t('profile.biometricEnabled'), t('profile.biometricEnabledMessage'));
      } else {
        Alert.alert(t('auth.biometricFailed'), result.error || t('auth.tryAgain'));
      }
    } else {
      // Disable biometric
      Alert.alert(
        t('profile.disableBiometric'),
        t('profile.disableBiometricConfirm'),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
          },
          {
            text: t('profile.disable'),
            style: 'destructive',
            onPress: () => {
              dispatch(setBiometricEnabled(false));
              Alert.alert(t('profile.biometricDisabled'), t('profile.biometricDisabledMessage'));
            },
          },
        ]
      );
    }
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('profile.title')}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.profileIcon}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileIconText}>
                {user?.isGuest ? '👤' : user?.name?.charAt(0).toUpperCase() || '👤'}
              </Text>
            )}
          </View>
          <Text style={styles.userName}>
            {user?.isGuest ? t('profile.guestUser') : user?.name}
          </Text>
          <Text style={styles.userEmail}>
            {user?.isGuest ? t('profile.notLoggedIn') : user?.email}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('profile.settings')}
          </Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>
              {t('profile.language')}
            </Text>
            <LanguageToggle displayCurrent />
          </View>
          
          <View style={[styles.settingItem, (!biometricAvailable || user?.isGuest) && styles.disabledItem]}>
            <View style={styles.settingLabelContainer}>
              <Text style={[styles.settingLabel, (!biometricAvailable || user?.isGuest) && styles.disabledText]}>
                {t('profile.biometricLogin')}
              </Text>
              {!biometricAvailable && (
                <Text style={[styles.settingSubtext, styles.warningText]}>
                  {t('profile.notSupported')}
                </Text>
              )}
              {user?.isGuest && biometricAvailable && (
                <Text style={[styles.settingSubtext, styles.warningText]}>
                  {t('profile.loginRequired')}
                </Text>
              )}
            </View>
            <Switch
              value={biometricEnabled && biometricAvailable}
              onValueChange={handleBiometricToggle}
              disabled={!biometricAvailable || user?.isGuest}
              trackColor={{ false: COLORS.LIGHT_GRAY, true: COLORS.PRIMARY }}
              thumbColor={COLORS.WHITE}
            />
          </View>
        </View>

      </ScrollView>
      
      <View style={styles.logoutContainer}>
        <Button
          title={t('auth.logout')}
          onPress={handleLogout}
          variant="outline"
          style={[styles.actionButton, styles.logoutButton]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SIZES.PADDING,
    paddingVertical: SIZES.PADDING,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  userInfo: {
    paddingHorizontal: SIZES.PADDING,
    marginBottom: 32,
    alignItems: 'center',
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileIconText: {
    fontSize: 32,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: SIZES.PADDING,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.BLACK,
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingSubtext: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 2,
  },
  warningText: {
    color: COLORS.ERROR,
  },

  disabledItem: {
    opacity: 0.5,
  },
  disabledText: {
    color: COLORS.GRAY,
  },
  disabledToggle: {
    backgroundColor: COLORS.LIGHT_GRAY,
    opacity: 0.5,
  },
  logoutContainer: {
    paddingHorizontal: SIZES.PADDING,
    paddingBottom: 32,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
  },
  actionButton: {
    width: '100%',
  },
  logoutButton: {
    borderColor: COLORS.ERROR,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SIZES.PADDING * 2,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    textAlign: 'center',
    marginBottom: 16,
  },
  guestMessage: {
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
    marginBottom: 40,
  },
  guestActions: {
    gap: 16,
  },
});

export default ProfileScreen;