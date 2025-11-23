import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../../types/navigation';
import type { NavigationProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../store';
import { COLORS, SIZES } from '../../../utils/constants';
import { PROFILE_SCREENS } from '../../profile/constants/screens';
import { SCREENS } from '../../../constants/screens';

type HeaderNavigationProp = NavigationProp<RootStackParamList>;

const HomeHeader: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HeaderNavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>
            {t('home.greeting', { name: user?.name || t('auth.guest') })}
          </Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.profileIcon, { marginRight: Math.max(0, insets.right) }]}
          onPress={() => navigation.navigate(SCREENS.PROFILE as never)}
        >
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
          ) : (
            <Text style={styles.profileIconText}>
              {user?.isGuest ? '👤' : user?.name?.charAt(0).toUpperCase() || '👤'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SIZES.PADDING,
    paddingVertical: SIZES.PADDING,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.GRAY,
    marginTop: 4,
  },
});

export default HomeHeader;