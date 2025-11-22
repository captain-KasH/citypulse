import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import EventCardSkeleton from '../../../components/EventCardSkeleton';
import { COLORS } from '../../../utils/constants';

interface EventListEmptyProps {
  loading: boolean;
  initialLoading: boolean;
  searchQuery: string;
}

const EventListEmpty: React.FC<EventListEmptyProps> = ({
  loading,
  initialLoading,
  searchQuery,
}) => {
  const { t } = useTranslation();
  if (loading || initialLoading) {
    return (
      <View>
        {[...Array(5)].map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </View>
    );
  }
  
  if (searchQuery) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('home.noEventsForQuery', { query: searchQuery })}</Text>
        <Text style={styles.emptySubtext}>{t('home.tryDifferentSearch')}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{t('home.noUpcomingEvents')}</Text>
    </View>
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
});

export default EventListEmpty;