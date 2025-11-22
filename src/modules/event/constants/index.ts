export const EVENT_CONSTANTS = {
  PAGINATION: {
    INITIAL_SIZE: 20,
    PAGE_SIZE: 10,
  },
  SEARCH: {
    DEBOUNCE_DELAY: 500,
    MIN_QUERY_LENGTH: 2,
  },
  FALLBACK_IMAGE: 'https://via.placeholder.com/400x250'
} as const;