import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES } from '../../../utils/constants';
import { EVENT_CONSTANTS } from '../../event/constants';

interface EventListFooterProps {
  hasMore: boolean;
  totalResults: number;
  eventsCount: number;
  loadingMore: boolean;
  onLoadMore: () => void;
}

const EventListFooter: React.FC<EventListFooterProps> = ({
  hasMore,
  totalResults,
  eventsCount,
  loadingMore,
  onLoadMore,
}) => {
  const { t } = useTranslation();
  
  // Hide if no more results or if we have all available results
  if (!hasMore || eventsCount === 0 || (totalResults > 0 && eventsCount >= totalResults)) {
    return null;
  }
  
  // Hide if the last batch was smaller than page size (indicates end of results)
  const lastBatchSize = eventsCount % EVENT_CONSTANTS.PAGINATION.PAGE_SIZE;
  if (lastBatchSize > 0 && lastBatchSize < EVENT_CONSTANTS.PAGINATION.PAGE_SIZE && eventsCount > EVENT_CONSTANTS.PAGINATION.INITIAL_SIZE) {
    return null;
  }
  
  return (
    <View style={styles.loadMoreContainer}>
      {loadingMore ? (
        <ActivityIndicator size="small" color={COLORS.PRIMARY} />
      ) : (
        <TouchableOpacity style={styles.loadMoreButton} onPress={onLoadMore}>
          <Text style={styles.loadMoreText}>
            {t('common.loadMore')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.BORDER_RADIUS,
    minWidth: 150,
    alignItems: 'center',
    marginBottom: 150,
  },
  loadMoreText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
});

export default EventListFooter;