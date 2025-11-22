import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SkeletonLoader from '../../../components/SkeletonLoader';
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
  if (loading || initialLoading) {
    return (
      <View>
        {[...Array(5)].map((_, index) => (
          <SkeletonLoader key={index} />
        ))}
      </View>
    );
  }
  
  if (searchQuery) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No events found for "{searchQuery}"</Text>
        <Text style={styles.emptySubtext}>Try a different search term</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No upcoming events</Text>
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