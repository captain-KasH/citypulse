import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import FavoritesList from '../profile/components/FavoritesList';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../../utils/constants';

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { favorites } = useSelector((state: RootState) => state.event);
  const { user } = useSelector((state: RootState) => state.auth);
  const { language } = useSelector((state: RootState) => state.app);
  const [favoritesCount, setFavoritesCount] = useState(0);
  
  const userFavorites = user ? favorites[user.id] || [] : [];

  useFocusEffect(
    React.useCallback(() => {
      setFavoritesCount(userFavorites.length);
    }, [userFavorites.length])
  );

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'en' ? 'My Favorites' : 'المفضلة'}
        </Text>
      </View>
      
      {user?.isGuest ? (
        <View style={styles.guestContainer}>
          <Text style={styles.guestTitle}>
            {language === 'en' ? 'Login Required' : 'تسجيل الدخول مطلوب'}
          </Text>
          <Text style={styles.guestMessage}>
            {language === 'en' 
              ? 'Create an account to save your favorite events and access them anytime' 
              : 'أنشئ حسابًا لحفظ الأحداث المفضلة والوصول إليها في أي وقت'}
          </Text>
          <View style={styles.guestActions}>
            <Button
              title={language === 'en' ? 'Back to Login' : 'العودة لتسجيل الدخول'}
              onPress={() => dispatch(logout())}
              style={styles.actionButton}
            />
          </View>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.count}>
              {favoritesCount} {language === 'en' ? 'favorite events' : 'أحداث مفضلة'}
            </Text>
            <FavoritesList />
          </View>
        </ScrollView>
      )}
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
  content: {
    padding: SIZES.PADDING,
  },
  count: {
    fontSize: 16,
    color: COLORS.GRAY,
    marginBottom: 16,
    textAlign: 'center',
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
  actionButton: {
    width: '100%',
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
});

export default FavoritesScreen;