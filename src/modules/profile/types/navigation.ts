import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type ProfileTabParamList = {
  Profile: undefined;
};

export type ProfileTabScreenProps<T extends keyof ProfileTabParamList> = BottomTabScreenProps<ProfileTabParamList, T>;