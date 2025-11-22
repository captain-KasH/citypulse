import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type FavoritesTabParamList = {
  Favorites: undefined;
};

export type FavoritesTabScreenProps<T extends keyof FavoritesTabParamList> = BottomTabScreenProps<FavoritesTabParamList, T>;