import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../utils/constants';

interface EventListHeaderProps {
  searchQuery: string;
  eventsCount: number;
  totalResults: number;
}

const EventListHeader: React.FC<EventListHeaderProps> = ({ 
  searchQuery, 
  eventsCount, 
  totalResults 
}) => {
  return (
    <Text style={styles.sectionTitle}>
      {searchQuery 
        ? `Search Results (${eventsCount}${totalResults > 0 ? ` of ${totalResults}` : ''})` 
        : 'Nearby Upcoming Events'
      }
    </Text>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: 16,
  },
});

export default EventListHeader;