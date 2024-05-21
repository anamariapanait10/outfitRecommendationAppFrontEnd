import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
let customFonts = {
  'GreatVibes': require('../assets/fonts/GreatVibes-Regular.ttf'),
  'FabfeltScript': require('../assets/fonts/fabfeltscript-bold.ttf'),
  'AlexBrush': require('../assets/fonts/alex-brush.regular.ttf'),
};

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isFontrLoaded] = useFonts(customFonts);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn ){
      router.replace('/(auth)/home');
    } else {
      router.replace('/(public)/login');
    }
  }, [isSignedIn]);

  return <Slot />;
};

const RootLayoutNav = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
};

export default RootLayoutNav;