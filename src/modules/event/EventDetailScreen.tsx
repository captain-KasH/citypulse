import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import { toggleFavorite } from '../event/redux/eventSlice';
import { setLanguage } from '../app/redux/appSlice';
import { getEventDetails } from '../../services/api/ticketmaster';
import Button from '../../components/Button';
import Header from '../../components/Header';
import EventDetailSkeleton from '../../components/EventDetailSkeleton';
import { COLORS, SIZES } from '../../utils/constants';
import { stripHtml } from '../../utils/stringUtils';

const EventDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { eventId } = route.params as { eventId: string };
  const { events, favorites } = useSelector((state: RootState) => state.event);
  const { user } = useSelector((state: RootState) => state.auth);
  const { language, isRTL } = useSelector((state: RootState) => state.app);
  const [event, setEvent] = useState(events.find(e => e.id === eventId) || null);
  const [loading, setLoading] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  const userFavorites = user ? favorites[user.id] || [] : [];
  const isFavorite = userFavorites.includes(eventId);

  useEffect(() => {
    const loadEventDetails = async () => {
      console.log('🎯 EventDetailScreen: Loading event details for ID:', eventId);
      console.log('📋 EventDetailScreen: Current event in state:', event);
      console.log('📋 EventDetailScreen: Events in Redux:', events.length, 'events');
      
      console.log('🚀 EventDetailScreen: Making API call for detailed event info...');
      setLoading(true);
      try {
        const eventDetails = await getEventDetails(eventId);
        console.log('✅ EventDetailScreen: Event details received:', eventDetails);
        if (eventDetails) {
          setEvent(eventDetails);
          console.log('🎉 EventDetailScreen: Event state updated successfully');
        } else {
          console.log('❌ EventDetailScreen: No event details returned from API, using existing event');
          // Keep existing event if API fails
        }
      } catch (error) {
        console.error('💥 EventDetailScreen: Error loading event details:', error);
        console.log('🔄 EventDetailScreen: Using existing event data as fallback');
      } finally {
        setLoading(false);
        console.log('🏁 EventDetailScreen: Loading finished');
      }
    };
    
    loadEventDetails();
  }, [eventId]);

  const handleToggleFavorite = () => {
    if (!user || user.isGuest) {
      Alert.alert(
        t('auth.loginRequired'),
        t('auth.pleaseLogin')
      );
      return;
    }
    dispatch(toggleFavorite({ eventId, userId: user.id }));
  };



  const formatDate = (dateString: string, timeString?: string) => {
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    if (timeString) {
      return `${dateFormatted} at ${timeString}`;
    }
    return dateFormatted;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title={t('event.details')}
          onBackPress={() => navigation.goBack()}
        />
        <EventDetailSkeleton />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title={t('event.notFound')}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('event.notFound')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const LanguageToggle = () => (
    <TouchableOpacity 
      style={styles.languageButton}
      onPress={() => dispatch(setLanguage(language === 'en' ? 'ar' : 'en'))}
    >
      <Text style={styles.languageText}>
        {language === 'en' ? 'عربي' : 'EN'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, isRTL && styles.rtlContainer]}>
      <Header 
        title={event?.name || t('event.details')}
        onBackPress={() => navigation.goBack()}
        rightComponent={<LanguageToggle />}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: event.image || 'https://via.placeholder.com/400x250' }}
          style={styles.coverImage}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, isRTL && styles.rtlText]}>
              {event.name}
            </Text>
            
            <TouchableOpacity
              style={[styles.favoriteButton, isFavorite && styles.favoriteActive]}
              onPress={handleToggleFavorite}
            >
              <Text style={[styles.favoriteText, isFavorite && styles.favoriteTextActive]}>
                {isFavorite ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t('event.details')}
            </Text>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
                {t('event.date')}:
              </Text>
              <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
                {formatDate(event.date, event.time)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
                {t('event.venue')}:
              </Text>
              <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
                {event.venue}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
                {t('event.city')}:
              </Text>
              <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
                {event.city}
              </Text>
            </View>

            {event.priceRange && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
                  {t('event.price')}:
                </Text>
                <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
                  ${event.priceRange.min} - ${event.priceRange.max}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.mapSection}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t('event.location')}
            </Text>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapText}>Map Preview</Text>
              {event.location && (
                <Text style={styles.coordinatesText}>
                  📍 {event.location.latitude.toFixed(4)}, {event.location.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          </View>

          {(event.description || event.info || event.pleaseNote) && (
            <View style={styles.infoSection}>
              <View style={styles.descriptionHeader}>
                <Text style={[styles.descriptionTitle, isRTL && styles.rtlText]}>
                  Description
                </Text>
                <TouchableOpacity 
                  style={styles.expandButton}
                  onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                >
                  <Text style={styles.expandButtonText}>
                    {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.descriptionContainer, !isDescriptionExpanded && styles.descriptionCollapsed]}>
                <Text style={[styles.descriptionText, isRTL && styles.rtlText]}>
                  {stripHtml(event.description || event.info || event.pleaseNote || '')}
                </Text>
              </View>
              
              {!isDescriptionExpanded && (
                <View style={styles.fadeOverlay} />
              )}
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  rtlContainer: {
    direction: 'rtl',
  },
  scrollView: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 250,
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
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.BLACK,
    marginRight: 16,
  },
  rtlText: {
    textAlign: 'right',
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  favoriteText: {
    fontSize: 20,
    color: COLORS.GRAY,
  },
  favoriteTextActive: {
    color: COLORS.WHITE,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.GRAY,
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: COLORS.BLACK,
  },
  mapSection: {
    marginBottom: 24,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: SIZES.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  coordinatesText: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: 4,
  },
  addressText: {
    fontSize: 16,
    color: COLORS.BLACK,
    lineHeight: 22,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.BLACK,
    lineHeight: 22,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.BLACK,
    flex: 1,
  },
  expandButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 16,
  },
  expandButtonText: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  descriptionContainer: {
    position: 'relative',
  },
  descriptionCollapsed: {
    maxHeight: 100,
    overflow: 'hidden',
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.GRAY,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: COLORS.ERROR,
    textAlign: 'center',
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 16,
  },
  languageText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
});

export default EventDetailScreen;