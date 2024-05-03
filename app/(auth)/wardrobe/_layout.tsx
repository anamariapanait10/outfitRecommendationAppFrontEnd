import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';
import { useAuth } from '@clerk/clerk-expo';
import { DataStorageSingleton } from "../../../constants/data_storage_singleton";

const headerWithBack =() => (
    <TouchableOpacity
    onPress={() => router.back()}
    style={{
        paddingLeft: 4,
        paddingTop: 4,
    }}>
    <Ionicons name="arrow-back-outline" size={22} color={'#fff'} />
    </TouchableOpacity>
)

export default function Layout() {
    const { isLoaded, userId, getToken } = useAuth();

    const handleDeleteCloth = async () => {
        if (!userId || !isLoaded) {
          console.log('No authenticated user found.');
          return;
        }
        try {
          const token = await getToken();
          const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/outfit-items/${DataStorageSingleton.getInstance().clothId}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!response.ok) {
            throw new Error('Failed to delete the item');
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
        }}>
    
        <Stack.Screen name="index" options={{
          headerTitle: ' My Wardrobe ',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 24,
          },
          headerTitleAlign: 'center',
        }} />

        <Stack.Screen
            name="add_cloth_item"
            options={{
                headerTitle: 'Add A Cloth Item',
                headerTitleStyle: {
                    fontFamily: 'GreatVibes',
                    fontSize: 21,
                },
                headerTitleAlign: 'center',
                headerLeft: headerWithBack,
            }}
        />

        <Stack.Screen
        name="outfit_item_details/index"
        options={{
          headerTitle: 'Outfit Item Details ',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 24,
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                paddingLeft: 4,
                paddingTop: 4,
              }}>
              <Ionicons name="arrow-back-outline" size={22} color={'#eee'} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={handleDeleteCloth}
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
              <Ionicons name="trash-outline" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />

    <Stack.Screen
        name="outfit_item_details/add_marketplace_item"
        options={{
          headerTitle: ' Add Item To Marketplace ',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 20,
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
        }}
      />
        
      </Stack>
    );
  }