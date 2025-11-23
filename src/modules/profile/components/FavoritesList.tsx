import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../../store';
import EventCard from '../../home/components/EventCard';
import { useFavorites } from '../../../hooks/useFavorites';
import { COLORS } from '../../../utils/constants';
import { SCREENS } from '../../../constants/screens';

const FavoritesList: React.FC = () => {
  const navigation = useNavigation();
  const { events, upcomingEvents, favorites } = useSelector((state: RootState) => state.event);
  const { user } = useSelector((state: RootState) => state.auth);
  const { language } = useSelector((state: RootState) => state.app);
  const { loadUserFavorites } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  const userFavorites = user ? favorites[user.id] || [] : [];
  const allEvents = [...events, ...upcomingEvents];
  const favoriteEvents = allEvents.filter(event => userFavorites.includes(event.id));

  const handleEventPress = (eventId: string) => {
    navigation.navigate(SCREENS.EVENT_DETAIL, { eventId } as never);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadUserFavorites();
    } finally {
      setRefreshing(false);
    }
  };

  if (favoriteEvents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {language === 'en' 
            ? 'No favorite events yet' 
            : 'لا توجد أحداث مفضلة بعد'}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favoriteEvents}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EventCard
          event={item}
          onPress={() => handleEventPress(item.id)}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.PRIMARY]}
          tintColor={COLORS.PRIMARY}
        />
      }
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
});

export default FavoritesList;