import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18n from '../../../i18n';

interface AppState {
  language: 'en' | 'ar';
  isRTL: boolean;
  theme: 'light' | 'dark';
  hasSeenSplash: boolean;
  biometricEnabled: boolean;
}

const initialState: AppState = {
  language: 'en',
  isRTL: false,
  theme: 'light',
  hasSeenSplash: false,
  biometricEnabled: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.language = action.payload;
      state.isRTL = action.payload === 'ar';
      i18n.changeLanguage(action.payload);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setSplashSeen: (state) => {
      state.hasSeenSplash = true;
    },
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },
  },
});

export const { setLanguage, setTheme, setSplashSeen, setBiometricEnabled } = appSlice.actions;
export default appSlice.reducer;