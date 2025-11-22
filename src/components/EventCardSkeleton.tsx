import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonLoader from './SkeletonLoader';
import { COLORS, SIZES } from '../utils/constants';

const EventCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Image skeleton */}
      <SkeletonLoader 
        width="100%" 
        height={150} 
        borderRadius={0}
        style={styles.image}
      />
      
      {/* Content skeleton */}
      <View style={styles.content}>
        {/* Title skeleton - 2 lines */}
        <SkeletonLoader width="90%" height={16} style={styles.titleLine1} />
        <SkeletonLoader width="70%" height={16} style={styles.titleLine2} />
        
        {/* Venue skeleton */}
        <SkeletonLoader width="60%" height={14} style={styles.venue} />
        
        {/* Location skeleton */}
        <SkeletonLoader width="50%" height={14} style={styles.location} />
        
        {/* Date skeleton */}
        <SkeletonLoader width="40%" height={14} style={styles.date} />
        
        {/* Price skeleton */}
        <SkeletonLoader width="35%" height={14} style={styles.price} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderRadius: SIZES.BORDER_RADIUS,
    marginBottom: 16,
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    borderTopLeftRadius: SIZES.BORDER_RADIUS,
    borderTopRightRadius: SIZES.BORDER_RADIUS,
  },
  content: {
    padding: SIZES.PADDING,
  },
  titleLine1: {
    marginBottom: 4,
  },
  titleLine2: {
    marginBottom: 8,
  },
  venue: {
    marginBottom: 4,
  },
  location: {
    marginBottom: 8,
  },
  date: {
    marginBottom: 4,
  },
  price: {
    marginBottom: 0,
  },
});

export default EventCardSkeleton;