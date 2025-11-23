jest.mock('react-native-reanimated', () => ({
  default: {
    call: () => {},
    Value: jest.fn(),
    event: jest.fn(),
    add: jest.fn(),
    eq: jest.fn(),
    set: jest.fn(),
    cond: jest.fn(),
    interpolate: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('./src/services/firebaseConfig', () => ({
  initializeFirebase: jest.fn(),
}));

jest.mock('./src/services/firebaseAuth', () => ({
  signInWithEmail: jest.fn(),
  signUpWithEmail: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('./src/hooks/useAuthListener', () => ({
  useAuthListener: () => ({ user: null, loading: false }),
}));

jest.mock('./src/i18n', () => ({}));

jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: () => ({
    apps: [],
    initializeApp: jest.fn(),
  }),
}));

jest.mock('@react-native-firebase/auth', () => () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  currentUser: null,
  onAuthStateChanged: jest.fn(),
}));

jest.mock('@react-native-firebase/firestore', () => () => ({
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(),
      get: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    add: jest.fn(),
    where: jest.fn(() => ({ get: jest.fn() })),
  })),
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    signIn: jest.fn(),
  },
}));

jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Marker: View,
  };
});