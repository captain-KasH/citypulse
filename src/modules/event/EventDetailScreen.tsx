import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SafeMapView from '../../components/SafeMapView';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store';
import { useFavorites } from '../../hooks/useFavorites';

import { getEventDetails } from '../../services/api/ticketmaster';
import Button from '../../components/Button';
import Header from '../../components/Header';
import EventDetailSkeleton from '../../components/EventDetailSkeleton';
import LanguageToggle from '../../components/LanguageToggle';
import { COLORS, SIZES } from '../../utils/constants';
import { stripHtml } from '../../utils/stringUtils';
import { formatDateWithLocale, getLocaleFromLanguage } from '../../utils/dateTimeUtils';
import { EVENT_CONSTANTS } from './constants';

const EventDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { eventId } = route.params as { eventId: string };
  const { events } = useSelector((state: RootState) => state.event);
  const { user } = useSelector((state: RootState) => state.auth);
  const { language, isRTL } = useSelector((state: RootState) => state.app);
  const { favorites, handleToggleFavorite, loadUserFavorites } = useFavorites();
  const [event, setEvent] = useState(events.find(e => e.id === eventId) || null);
  const [loading, setLoading] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  const isFavorite = favorites.includes(eventId);

  useEffect(() => {
    const loadEventDetails = async () => {
      setLoading(true);
      try {
        const eventDetails = await getEventDetails(eventId);
        if (eventDetails) {
          setEvent(eventDetails);
        }
      } catch (error) {
        console.error('Error loading event details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEventDetails();
    loadUserFavorites();
  }, [eventId]);

  const onToggleFavorite = () => {
    if (!user || user.isGuest) {
      Alert.alert(
        t('auth.loginRequired'),
        t('auth.pleaseLogin')
      );
      return;
    }
    handleToggleFavorite(eventId);
  };



  const formatDate = (dateString: string, timeString?: string) => {
    const locale = getLocaleFromLanguage(language);
    return formatDateWithLocale(dateString, locale, timeString, language);
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



  return (
    <SafeAreaView style={[styles.container, isRTL && styles.rtlContainer]}>
      <Header 
        title={event?.name || t('event.details')}
        onBackPress={() => navigation.goBack()}
        rightComponent={<LanguageToggle />}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: event.image || EVENT_CONSTANTS.FALLBACK_IMAGE }}
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
              onPress={onToggleFavorite}
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
                {event.date ? formatDate(event.date, event.time) : '--'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
                {t('event.venue')}:
              </Text>
              <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
                {event.venue || '--'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
                {t('event.city')}:
              </Text>
              <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
                {event.city || '--'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
                {t('event.price')}:
              </Text>
              <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
                {event.priceRange ? `$${event.priceRange.min} - $${event.priceRange.max}` : '--'}
              </Text>
            </View>
          </View>

          <View style={styles.mapSection}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
              {t('event.location')}
            </Text>
            {event.location ? (
              <SafeMapView
                style={styles.map}
                initialRegion={{
                  latitude: event.location.latitude,
                  longitude: event.location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                marker={{
                  coordinate: {
                    latitude: event.location.latitude,
                    longitude: event.location.longitude,
                  },
                  title: event.name,
                  description: event.venue,
                }}
                fallbackText={t('event.mapUnavailable')}
              />
            ) : (
              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>{t('event.mapPreview')}</Text>
                <Text style={styles.coordinatesText}>📍 --</Text>
              </View>
            )}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.descriptionHeader}>
              <Text style={[styles.descriptionTitle, isRTL && styles.rtlText]}>
                {t('event.description')}
              </Text>
              {(() => {
                const description = stripHtml(event.description || event.info || event.pleaseNote || '');
                return description.length > 200 && (
                  <TouchableOpacity 
                    style={styles.expandButton}
                    onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  >
                    <Text style={styles.expandButtonText}>
                      {isDescriptionExpanded ? t('common.showLess') : t('common.showMore')}
                    </Text>
                  </TouchableOpacity>
                );
              })()}
            </View>
            
            <View style={[styles.descriptionContainer, !isDescriptionExpanded && styles.descriptionCollapsed]}>
              <Text style={[styles.descriptionText, isRTL && styles.rtlText]}>
                {(event.description || event.info || event.pleaseNote) ? stripHtml(event.description || event.info || event.pleaseNote || '') : '--'}
              </Text>
            </View>
            
            {(() => {
              const description = stripHtml(event.description || event.info || event.pleaseNote || '');
              return !isDescriptionExpanded && description.length > 200 && (
                <View style={styles.fadeOverlay} />
              );
            })()}
          </View>

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
  map: {
    height: 200,
    borderRadius: SIZES.BORDER_RADIUS,
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

});

export default EventDetailScreen;