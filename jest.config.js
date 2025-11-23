module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs|redux-persist|immer|@react-navigation|@react-native-firebase|@react-native-google-signin|react-native-maps)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testTimeout: 10000,
  moduleNameMapper: {
    '@react-native-firebase/app': '<rootDir>/__mocks__/@react-native-firebase/app.js',
    '@react-native-firebase/auth': '<rootDir>/__mocks__/@react-native-firebase/auth.js',
    '@react-native-firebase/firestore': '<rootDir>/__mocks__/@react-native-firebase/firestore.js',
  },
};
