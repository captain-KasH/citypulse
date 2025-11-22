import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash.debounce';
import { searchEvents } from '../api/ticketmaster';
import { setEvents, appendEvents, setLoading, setLoadingMore, resetPagination } from '../../store/slices/eventSlice';
import { Event } from '../../store/slices/eventSlice';
import { RootState } from '../../store';
import { PAGINATION } from '../../utils/constants';

export const useEventSearch = () => {
  const dispatch = useDispatch();
  const { currentPage, hasMore } = useSelector((state: RootState) => state.event);
  const [suggestions, setSuggestions] = useState<Event[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const debouncedSearch = debounce(async (keyword: string) => {
    if (!keyword.trim()) {
      setSuggestions([]);
      return;
    }

    dispatch(setLoading(true));
    dispatch(resetPagination());
    setCurrentKeyword(keyword);
    try {
      const result = await searchEvents(keyword, 0, PAGINATION.INITIAL_SIZE);
      setSuggestions(result.events.slice(0, 5)); // Limit suggestions
      dispatch(setEvents(result));
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      dispatch(setLoading(false));
    }
  }, 300);

  const searchWithDebounce = (keyword: string) => {
    debouncedSearch(keyword);
  };

  const loadMoreSearchResults = async () => {
    if (!hasMore || !currentKeyword) return;
    
    dispatch(setLoadingMore(true));
    try {
      const result = await searchEvents(currentKeyword, currentPage + 1, PAGINATION.PAGE_SIZE);
      dispatch(appendEvents(result.events));
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      dispatch(setLoadingMore(false));
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };

  return {
    suggestions,
    searchWithDebounce,
    loadMoreSearchResults,
    clearSuggestions,
  };
};