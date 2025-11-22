import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { getUpcomingEvents } from '../../../services/api/ticketmaster';
import { setEvents, appendEvents, setLoading, setLoadingMore, resetPagination, setUpcomingEvents, appendUpcomingEvents } from '../../event/redux/eventSlice';
import { EVENT_CONSTANTS } from '../../event/constants';

export const useHomeEvents = () => {
  const dispatch = useDispatch();
  const { events, upcomingEvents, loading, loadingMore, hasMore, currentPage, totalResults, upcomingEventsLoaded } = useSelector((state: RootState) => state.event);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadUpcomingEvents();
  }, []);

  const loadUpcomingEvents = async () => {
    if (upcomingEventsLoaded) {
      dispatch(setEvents({ events: upcomingEvents, total: 0 }));
      setInitialLoading(false);
      return;
    }
    
    dispatch(setLoading(true));
    dispatch(resetPagination());
    const result = await getUpcomingEvents(0, EVENT_CONSTANTS.PAGINATION.INITIAL_SIZE);
    dispatch(setUpcomingEvents(result.events));
    dispatch(setEvents({ events: result.events, total: 0 }));
    dispatch(setLoading(false));
    setInitialLoading(false);
  };

  const loadMoreUpcomingEvents = async (searchQuery: string) => {
    if (!hasMore || searchQuery) return;
    
    dispatch(setLoadingMore(true));
    try {
      const result = await getUpcomingEvents(currentPage + 1, EVENT_CONSTANTS.PAGINATION.PAGE_SIZE);
      dispatch(appendUpcomingEvents(result.events));
      dispatch(appendEvents(result.events));
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      dispatch(setLoadingMore(false));
    }
  };

  const resetToUpcomingEvents = () => {
    if (upcomingEventsLoaded) {
      dispatch(setEvents({ events: upcomingEvents, total: 0 }));
    } else {
      loadUpcomingEvents();
    }
  };

  return {
    events,
    loading,
    loadingMore,
    hasMore,
    totalResults,
    initialLoading,
    loadMoreUpcomingEvents,
    resetToUpcomingEvents,
  };
};