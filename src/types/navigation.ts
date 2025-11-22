import type { NavigatorScreenParams } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Import module-specific types
import type { AuthStackParamList } from '../modules/auth/types/navigation';
import type { EventStackParamList } from '../modules/event/types/navigation';
import type { HomeTabParamList } from '../modules/home/types/navigation';
import type { ProfileTabParamList } from '../modules/profile/types/navigation';
import type { FavoritesTabParamList } from '../modules/favorites/types/navigation';

// Combined Tab Navigator Params
export type TabParamList = HomeTabParamList & ProfileTabParamList & FavoritesTabParamList;

// Main Stack Params
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
} & EventStackParamList;

// Screen Props Types
export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<TabParamList, T>;


// Re-export module types
export type { AuthStackParamList } from '../modules/auth/types/navigation';
export type { EventStackParamList } from '../modules/event/types/navigation';
export type { HomeTabParamList, HomeTabScreenProps } from '../modules/home/types/navigation';
export type { ProfileTabParamList, ProfileTabScreenProps } from '../modules/profile/types/navigation';
export type { FavoritesTabParamList, FavoritesTabScreenProps } from '../modules/favorites/types/navigation';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}