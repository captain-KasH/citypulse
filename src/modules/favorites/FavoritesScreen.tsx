import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import EventCard from '../home/components/EventCard';
import Button from '../../components/Button';
import { useFavorites } from '../../hooks/useFavorites';
import { COLORS, SIZES } from '../../utils/constants';
import { SCREENS } from '../../constants/screens';

const FavoritesScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { favorites, events, upcomingEvents } = useSelector((state: RootState) => state.event);
  const { user } = useSelector((state: RootState) => state.auth);
  const { loadUserFavorites } = useFavorites();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  
  const favoriteEvents = useMemo(() => {
    if (!user) return [];
    const userFavoriteIds = favorites[user.id] || [];
    const allEvents = [...events, ...upcomingEvents];
    const uniqueEvents = allEvents.filter((event, index, self) => 
      index === self.findIndex(e => e.id === event.id)
    );
    return uniqueEvents.filter(event => userFavoriteIds.includes(event.id));
  }, [user, favorites, events, upcomingEvents]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadUserFavorites();
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserFavorites();
    }, [])
  );

  React.useEffect(() => {
    setFavoritesCount(favoriteEvents.length);
  }, [favoriteEvents.length]);

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.title}>
          {t('favorites.title')}
        </Text>
      </View>
      
      {user?.isGuest ? (
        <View style={styles.guestContainer}>
          <Text style={styles.guestTitle}>
            {t('favorites.loginRequired')}
          </Text>
          <Text style={styles.guestMessage}>
            {t('favorites.loginMessage')}
          </Text>
          <View style={styles.guestActions}>
            <Button
              title={t('favorites.backToLogin')}
              onPress={() => dispatch(logout())}
              style={styles.actionButton}
            />
          </View>
        </View>
      ) : (
        <FlatList
          data={favoriteEvents}
          keyExtractor={(item, index) => item.id+index}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate(SCREENS.EVENT_DETAIL, { eventId: item.id })}
            />
          )}
          ListHeaderComponent={() => (
            <Text style={styles.count}>
              {favoritesCount} {t('favorites.favoriteEvents')}
            </Text>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {t('favorites.noFavorites')}
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.PRIMARY]}
              tintColor={COLORS.PRIMARY}
            />
          }
          ListFooterComponent={<View style={
            {
              marginBottom:30
            }
          }/>}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
  content: {
    padding: SIZES.PADDING,
  },
  count: {
    fontSize: 16,
    color: COLORS.GRAY,
    marginBottom: 16,
    textAlign: 'left',
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
  footerContainer: {
    marginBottom: 30
  }
});

export default FavoritesScreen;