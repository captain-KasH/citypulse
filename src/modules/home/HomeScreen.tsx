import React, { useState } from 'react';
import { StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../types/navigation';
import type { NavigationProp } from '@react-navigation/native';
import { useEventSearch } from '../../services/hooks/useEventSearch';
import { useHomeEvents } from './hooks/useHomeEvents';
import HomeHeader from './components/HomeHeader';
import SearchBar from './components/SearchBar';
import EventCard from './components/EventCard';
import EventListHeader from './components/EventListHeader';
import EventListEmpty from './components/EventListEmpty';
import EventListFooter from './components/EventListFooter';
import { COLORS, SIZES, FEATURE_FLAGS } from '../../utils/constants';

type HomeNavigationProp = NavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoadMore, setShowLoadMore] = useState(false);
  const { suggestions, searchWithDebounce, loadMoreSearchResults, clearSuggestions } = useEventSearch();
  const { events, loading, loadingMore, hasMore, totalResults, initialLoading, loadMoreUpcomingEvents, resetToUpcomingEvents } = useHomeEvents();

  const handleSearch = (keyword: string) => {
    setSearchQuery(keyword);
    if (keyword.trim()) {
      searchWithDebounce(keyword);
    } else {
      clearSuggestions();
      resetToUpcomingEvents();
    }
  };

  const handleLoadMore = () => {
    if (searchQuery) {
      loadMoreSearchResults();
    } else {
      loadMoreUpcomingEvents(searchQuery);
    }
    setShowLoadMore(false);
  };

  const handleEndReached = () => {
    if (hasMore && !loadingMore) {
      if (FEATURE_FLAGS.MANUAL_LOAD_MORE) {
        setShowLoadMore(true);
      } else {
        handleLoadMore();
      }
    }
  };

  const handleEventPress = (eventId: string) => {
    clearSuggestions();
    navigation.navigate('EventDetail', { eventId });
  };

  const renderEventItem: ListRenderItem<any> = ({ item }) => (
    <EventCard
      event={item}
      onPress={() => handleEventPress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      
      <SearchBar
        onSearch={handleSearch}
        suggestions={suggestions}
        onSuggestionPress={handleEventPress}
      />

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderEventItem}
        ListHeaderComponent={() => (
          <EventListHeader 
            searchQuery={searchQuery}
            eventsCount={events.length}
            totalResults={totalResults}
          />
        )}
        ListEmptyComponent={() => (
          <EventListEmpty 
            loading={loading}
            initialLoading={initialLoading}
            searchQuery={searchQuery}
          />
        )}
        ListFooterComponent={() => (
          <EventListFooter 
            hasMore={FEATURE_FLAGS.MANUAL_LOAD_MORE ? showLoadMore : (hasMore && loadingMore)}
            totalResults={totalResults}
            eventsCount={events.length}
            loadingMore={loadingMore}
            onLoadMore={handleLoadMore}
          />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  content: {
    paddingHorizontal: SIZES.PADDING,
    paddingBottom: 24,
  },
});

export default HomeScreen;