export const COLORS = {
  PRIMARY: '#FF6F26',
  BLACK: '#101010',
  WHITE: '#FFFFFF',
  GRAY: '#666666',
  LIGHT_GRAY: '#F5F5F5',
  ERROR: '#FF3B30',
  SUCCESS: '#34C759',
};

export const FONTS = {
  REGULAR: 'System',
  MEDIUM: 'System',
  BOLD: 'System',
};

export const SIZES = {
  PADDING: 16,
  MARGIN: 16,
  BORDER_RADIUS: 8,
  HEADER_HEIGHT: 60,
};

// ToDo:: move to .env
export const API_CONFIG = {
  TICKETMASTER_BASE_URL: 'https://app.ticketmaster.com/discovery/v2',
  TICKETMASTER_API_KEY: 'SRZnhFZZ6DixEUKaLPDsfR4HNhKQ9Sou',
};

export const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  FAVORITES: 'favorites',
  LANGUAGE: 'language',
  BIOMETRIC_ENABLED: 'biometric_enabled',
};

export const PAGINATION = {
  INITIAL_SIZE: 5,
  PAGE_SIZE: 10,
};

// ToDo:: add to config api
export const FEATURE_FLAGS = {
  ENABLE_SEARCH_SUGGESTIONS: false, // enable/disable autocomplete search suggestion list
  MANUAL_LOAD_MORE: true, // Will disable auto api call on end reach
};