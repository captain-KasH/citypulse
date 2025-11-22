import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
  return (
    <Text style={styles.sectionTitle}>
      {searchQuery 
        ? t('home.searchResults', { 
            count: eventsCount, 
            total: totalResults > 0 ? ` ${t('home.of')} ${totalResults}` : '' 
          })
        : t('home.nearbyUpcomingEvents')
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