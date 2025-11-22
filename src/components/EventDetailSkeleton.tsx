import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import { COLORS, SIZES } from '../utils/constants';

const EventDetailSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Cover Image Skeleton */}
      <SkeletonLoader width="100%" height={250} borderRadius={0} />
      
      <View style={styles.content}>
        {/* Title and Favorite Button */}
        <View style={styles.header}>
          <SkeletonLoader width="70%" height={28} style={styles.title} />
          <SkeletonLoader width={44} height={44} borderRadius={22} />
        </View>

        {/* Event Details Section */}
        <View style={styles.section}>
          <SkeletonLoader width="40%" height={20} style={styles.sectionTitle} />
          
          {/* Info Rows */}
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.infoRow}>
              <SkeletonLoader width={80} height={16} />
              <SkeletonLoader width="60%" height={16} />
            </View>
          ))}
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <SkeletonLoader width="30%" height={20} style={styles.sectionTitle} />
          <SkeletonLoader width="100%" height={150} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    padding: SIZES.PADDING,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    marginRight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
});

export default EventDetailSkeleton;