import { Stack, router } from 'expo-router';
import Colors from '../../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { DataStorageSingleton } from '../../../constants/data_storage_singleton';

export default function Layout() {
  const { isLoaded, userId, getToken } = useAuth();
  const { isSignedIn } = useAuth();

    return (
      <Stack
        screenOptions={{
          headerStyle: {
              backgroundColor: Colors.purple, // '#6c47ff',
          },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: ' Marketplace ',
            headerTitleStyle: {
              fontFamily: 'GreatVibes',
              fontSize: 28,
            },
            headerTitleAlign: 'center',
          }}
          redirect={!isSignedIn}
        />
    
        <Stack.Screen
        name="marketplace_item_details"
        options={{
          headerTitle: 'Marketplace Item Details',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 22,
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                paddingLeft: 4,
                paddingTop: 4,
              }}>
              <Ionicons name="arrow-back-outline" size={22} color={'#fff'} />
            </TouchableOpacity>
          )
        }}
      />
        
      </Stack>
    );
  }