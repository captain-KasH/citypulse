import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { Text } from 'react-native';
import { initializeFirebase } from './src/services/firebaseConfig';
import './src/i18n';

const App: React.FC = () => {
  useEffect(() => {
    initializeFirebase();
  }, []);

  /** 
   * 
   * TODO:
   * - Implement app update mechanism (force/soft update)
   * - Add remote config and feature flags integration
   * - Implement dynamic splash screen with maintenance mode
   * - Add crash reporting and analytics
   * - Implement deep linking support
   * - Add push notification setup
   * 
   */ 

  return (
    <Provider store={store}>
      <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;