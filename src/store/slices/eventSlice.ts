import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  image: string;
  url: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

interface EventState {
  events: Event[];
  upcomingEvents: Event[];
  favorites: { [userId: string]: string[] };
  loading: boolean;
  loadingMore: boolean;
  searchQuery: string;
  currentPage: number;
  hasMore: boolean;
  totalResults: number;
  upcomingEventsLoaded: boolean;
}

const initialState: EventState = {
  events: [],
  upcomingEvents: [],
  favorites: {},
  loading: false,
  loadingMore: false,
  searchQuery: '',
  currentPage: 0,
  hasMore: true,
  totalResults: 0,
  upcomingEventsLoaded: false,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<{events: Event[], total: number}>) => {
      state.events = action.payload.events;
      state.totalResults = action.payload.total;
      state.currentPage = 0;
      state.hasMore = action.payload.events.length > 0;
    },
    appendEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = [...state.events, ...action.payload];
      state.currentPage += 1;
      state.hasMore = action.payload.length >= 10; // Hide if less than page size
    },
    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.loadingMore = action.payload;
    },
    resetPagination: (state) => {
      state.currentPage = 0;
      state.hasMore = true;
    },
    setUpcomingEvents: (state, action: PayloadAction<Event[]>) => {
      state.upcomingEvents = action.payload;
      state.upcomingEventsLoaded = true;
    },
    appendUpcomingEvents: (state, action: PayloadAction<Event[]>) => {
      state.upcomingEvents = [...state.upcomingEvents, ...action.payload];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<{eventId: string, userId: string}>) => {
      const { eventId, userId } = action.payload;
      if (!state.favorites[userId]) {
        state.favorites[userId] = [];
      }
      if (state.favorites[userId].includes(eventId)) {
        state.favorites[userId] = state.favorites[userId].filter(id => id !== eventId);
      } else {
        state.favorites[userId].push(eventId);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setEvents, appendEvents, setLoading, setLoadingMore, toggleFavorite, setSearchQuery, resetPagination, setUpcomingEvents, appendUpcomingEvents } = eventSlice.actions;
export default eventSlice.reducer;