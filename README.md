This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Installation

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Install Dependencies

```sh
# Install npm dependencies (use legacy-peer-deps if npm install fails)
npm install

# OR if npm install fails, try:
npm install --legacy-peer-deps
```

### iOS Setup

The postinstall script will automatically install iOS pods after npm install. If it doesn't work, manually install pods:

```sh
# Navigate to iOS directory and install pods
cd ios && pod install && cd ..

# OR use the npm script
npm run pods
```

# Getting Started

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### Build Android APK

```sh
# Build release APK
npm run build:android

# Build debug APK
npm run build:android:debug
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Project Architecture

## File Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Header.tsx
│   └── EventCardSkeleton.tsx
├── constants/           # App-wide constants
│   └── screens.ts
├── hooks/              # Custom React hooks
│   └── useFavorites.ts
├── i18n/               # Internationalization
│   ├── index.ts
│   └── locales/
│       ├── en.json
│       └── ar.json
├── modules/            # Feature-based modules
│   ├── app/
│   │   └── redux/
│   │       └── appSlice.ts
│   ├── auth/
│   │   ├── redux/
│   │   │   └── authSlice.ts
│   │   ├── LandingScreen.tsx
│   │   └── mockAuth.ts
│   ├── event/
│   │   ├── redux/
│   │   │   └── eventSlice.ts
│   │   ├── constants/
│   │   │   └── index.ts
│   │   └── EventDetailScreen.tsx
│   ├── home/
│   │   ├── components/
│   │   │   ├── HomeHeader.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventListHeader.tsx
│   │   │   ├── EventListEmpty.tsx
│   │   │   └── EventListFooter.tsx
│   │   ├── hooks/
│   │   │   └── useHomeEvents.ts
│   │   └── HomeScreen.tsx
│   └── profile/
│       └── ProfileScreen.tsx
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── services/          # External services
│   ├── api/
│   │   ├── client.ts      # Reusable API client
│   │   ├── types.ts       # API type definitions
│   │   ├── mappers.ts     # Data transformation
│   │   └── ticketmaster.ts # API calls
│   ├── biometric.ts
│   ├── firebaseConfig.ts
│   ├── firebaseFavorites.ts
│   └── hooks/
│       └── useEventSearch.ts
├── store/             # Redux store configuration
│   └── index.ts
├── types/             # TypeScript type definitions
│   └── navigation.ts
├── utils/             # Utility functions
│   ├── constants.ts
│   ├── stringUtils.ts
│   ├── currencyUtils.ts
│   └── dateTimeUtils.ts
└── scripts/           # Build and setup scripts
    └── postinstall.js
```

## Architecture Principles

### **Modular Design**
- **Feature-based modules**: Each feature (auth, event, home, profile) has its own folder
- **Module-level Redux**: Each module manages its own state with dedicated slices
- **Component co-location**: Components are placed near their usage context

### **API Layer**
- **Modular API structure**: Separated client, types, mappers, and API calls
- **Reusable client**: Generic HTTP client for multiple services
- **Data transformation**: Clean mapping from external APIs to internal models

### **State Management**
- **Redux Toolkit**: Modern Redux with simplified boilerplate
- **Feature slices**: Each module has its own Redux slice
- **Persistent storage**: Redux Persist for data persistence

### **Internationalization**
- **Multi-language support**: English and Arabic
- **RTL support**: Right-to-left layout for Arabic
- **Localized components**: All text uses translation keys

### **Type Safety**
- **TypeScript throughout**: Full type coverage
- **Navigation types**: Type-safe navigation with proper params
- **API types**: Strongly typed API responses and requests

# API Setup

The app uses Ticketmaster API for real event data. To get your free API key:

1. Visit [Ticketmaster Developer Portal](https://developer.ticketmaster.com/)
2. Sign up and get your Consumer Key
3. Replace the API key in `src/utils/constants.ts`

# Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Add configuration files:
   - `android/app/google-services.json`
   - `ios/CityPulse/GoogleService-Info.plist`
4. Update Firestore security rules for favorites collection

# CI/CD Pipeline

## GitHub Actions Workflow

The project includes automated CI/CD pipeline configured in `.github/workflows/ci.yml`:

### **Triggers**
- **Push**: Runs on `main` and `develop` branches
- **Pull Request**: Runs on PRs to `main` and `develop`

### **Pipeline Steps**
1. **Checkout Code**: Uses `actions/checkout@v4`
2. **Setup Node.js**: Installs Node.js 18 with npm caching
3. **Install Dependencies**: Runs `npm install --legacy-peer-deps`
4. **Linting**: Executes `npm run lint` for code quality
5. **Testing**: Runs `npm test` for unit tests
6. **Type Checking**: Validates TypeScript with `npx tsc --noEmit`

### **Available Scripts**
```sh
# Development
npm start                    # Start Metro bundler
npm run android             # Run on Android
npm run ios                 # Run on iOS

# Building
npm run build:android       # Build release APK
npm run build:android:debug # Build debug APK

# Quality Assurance
npm run lint                # ESLint code analysis
npm run type-check          # TypeScript validation
npm run check               # Run type-check + lint
npm run check:fix           # Run type-check + lint with auto-fix

# Setup
npm run postinstall         # Auto-run after npm install
npm run pods                # Install iOS CocoaPods

# Debugging
npm run keystore:debug      # Show debug keystore info
npm run keystore:release    # Show release keystore info
```

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
