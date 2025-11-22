// Central screen constants - imports from all modules
export { AUTH_SCREENS } from '../modules/auth/constants/screens';
export { HOME_SCREENS } from '../modules/home/constants/screens';
export { EVENT_SCREENS } from '../modules/event/constants/screens';
export { PROFILE_SCREENS } from '../modules/profile/constants/screens';
export { FAVORITES_SCREENS } from '../modules/favorites/constants/screens';

// Combined screens object for navigation
export const SCREENS = {
  // Auth
  LANDING: 'Landing',
  LOGIN: 'Login',
  SIGNUP: 'SignUp',
  
  // Main App
  HOME: 'Home',
  FAVORITES: 'Favorites',
  PROFILE: 'Profile',
  
  // Event
  EVENT_DETAIL: 'EventDetail',
} as const;