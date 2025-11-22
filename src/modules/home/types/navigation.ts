import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type HomeTabParamList = {
  Home: undefined;
};

export type HomeTabScreenProps<T extends keyof HomeTabParamList> = BottomTabScreenProps<HomeTabParamList, T>;