import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  language: 'en' | 'ar';
  isRTL: boolean;
  theme: 'light' | 'dark';
  hasSeenSplash: boolean;
}

const initialState: AppState = {
  language: 'en',
  isRTL: false,
  theme: 'light',
  hasSeenSplash: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.language = action.payload;
      state.isRTL = action.payload === 'ar';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setSplashSeen: (state) => {
      state.hasSeenSplash = true;
    },
  },
});

export const { setLanguage, setTheme, setSplashSeen } = appSlice.actions;
export default appSlice.reducer;