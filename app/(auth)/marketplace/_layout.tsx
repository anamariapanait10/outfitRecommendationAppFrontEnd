import { Stack, router } from 'expo-router';
import Colors from '../../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';

export default function Layout() {
  const { isLoaded, userId, getToken } = useAuth();
  const { isSignedIn } = useAuth();
  
  const handleDeleteMarketplaceItem = async () => {
    if (!userId || !isLoaded) {
      console.log('No authenticated user found.');
      return;
    }
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/marketplace-items/${DataStorageSingleton.getInstance().marketPlaceItemId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete the marketplace item');
      }
  
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

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
            headerTitle: ' My Wardrobe ',
            headerTitleStyle: {
              fontFamily: 'GreatVibes',
              fontSize: 24,
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
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleDeleteMarketplaceItem}
              style={{
                marginRight: 10,
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 3,
                paddingBottom: 3,
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 15,
                backgroundColor: '#fff',  
              }}>
              <Ionicons name="trash-outline" size={24} color={'black'} />
            </TouchableOpacity>
          ),
        }}
      />
        
      </Stack>
    );
  }