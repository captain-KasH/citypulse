import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../auth/redux/authSlice';
import { setLanguage } from '../app/redux/appSlice';
import { mockAuthService } from '../auth/mockAuth';
import Button from '../../components/Button';
import { COLORS, SIZES } from '../../utils/constants';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { favorites } = useSelector((state: RootState) => state.event);
  const { language } = useSelector((state: RootState) => state.app);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      language === 'en' ? 'Logout' : 'تسجيل الخروج',
      language === 'en' ? 'Are you sure you want to logout?' : 'هل أنت متأكد من تسجيل الخروج؟',
      [
        {
          text: language === 'en' ? 'Cancel' : 'إلغاء',
          style: 'cancel',
        },
        {
          text: language === 'en' ? 'Logout' : 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            await mockAuthService.logout();
            dispatch(logout());
          },
        },
      ]
    );
  };

  const handleBiometricToggle = (value: boolean) => {
    if (user?.isGuest) return;
    setBiometricEnabled(value);
    // Placeholder for Phase 2
    Alert.alert(
      'Coming Soon',
      'Biometric authentication will be available in Phase 2'
    );
  };



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'en' ? 'Profile' : 'الملف الشخصي'}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>
              {user?.isGuest ? '👤' : user?.name?.charAt(0).toUpperCase() || '👤'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.isGuest ? (language === 'en' ? 'Guest User' : 'مستخدم ضيف') : user?.name}
          </Text>
          <Text style={styles.userEmail}>
            {user?.isGuest ? (language === 'en' ? 'Not logged in' : 'غير مسجل الدخول') : user?.email}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'Settings' : 'الإعدادات'}
          </Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>
              {language === 'en' ? 'Language' : 'اللغة'}
            </Text>
            <TouchableOpacity 
              style={styles.languageToggle}
              onPress={() => dispatch(setLanguage(language === 'en' ? 'ar' : 'en'))}
            >
              <Text style={styles.languageText}>
                {language === 'en' ? 'English' : 'عربي'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.settingItem, user?.isGuest && styles.disabledItem]}>
            <Text style={[styles.settingLabel, user?.isGuest && styles.disabledText]}>
              {language === 'en' ? 'Biometric Login' : 'المصادقة البيومترية'}
            </Text>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              disabled={user?.isGuest}
              trackColor={{ false: COLORS.LIGHT_GRAY, true: COLORS.PRIMARY }}
              thumbColor={COLORS.WHITE}
            />
          </View>
        </View>

      </ScrollView>
      
      <View style={styles.logoutContainer}>
        <Button
          title={language === 'en' ? 'Logout' : 'تسجيل الخروج'}
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
  languageToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 16,
  },
  languageText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
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