import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Event } from '../../../store/slices/eventSlice';
import { COLORS, SIZES } from '../../../utils/constants';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{ uri: event.image || 'https://via.placeholder.com/300x200' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.name}
        </Text>
        
        <Text style={styles.venue} numberOfLines={1}>
          {event.venue}
        </Text>
        
        <Text style={styles.location} numberOfLines={1}>
          {event.city}
        </Text>
        
        <Text style={styles.date}>
          {formatDate(event.date)}
        </Text>
        
        {event.priceRange && (
          <Text style={styles.price}>
            ${event.priceRange.min} - ${event.priceRange.max}
          </Text>
        )}
      </View>
    </TouchableOpacity>
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
    width: '100%',
    height: 150,
    borderTopLeftRadius: SIZES.BORDER_RADIUS,
    borderTopRightRadius: SIZES.BORDER_RADIUS,
  },
  content: {
    padding: SIZES.PADDING,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: 8,
  },
  venue: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: COLORS.BLACK,
    fontWeight: '500',
  },
});

export default EventCard;