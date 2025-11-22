import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SIZES } from '../../../utils/constants';

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
  if (!hasMore) return null;
  
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
  },
  loadMoreText: {
    fontSize: 16,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
});

export default EventListFooter;