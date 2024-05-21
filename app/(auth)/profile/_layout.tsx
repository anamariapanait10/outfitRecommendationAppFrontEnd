import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import Colors from '../../../constants/Colors';
import { useAuth } from '@clerk/clerk-expo';
import { Pressable } from 'react-native';

export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={'#fff'} />
    </Pressable>
  );
};

export default function Layout() {
  const { isSignedIn } = useAuth();

    return (
      <Stack
        screenOptions={{
            headerStyle: {
                backgroundColor: Colors.purple, // '#6c47ff',
            },
            headerTintColor: '#fff',
        }}>
    
    <Stack.Screen
        name="index"
        options={{
          headerTitle: ' My Profile ',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 26,
          },
          headerTitleAlign: 'center',
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />

      </Stack>
    );
  }