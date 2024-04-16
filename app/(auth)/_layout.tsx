import { Tabs, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { TouchableOpacity } from 'react-native';
import Colors from "../../constants/Colors";
import { useRouter } from 'expo-router';
import { DataStorageSingleton } from './data_storage_singleton';

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

const TabsPage = () => {
  const { isSignedIn } = useAuth();
  const { isLoaded, userId, getToken } = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams();

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
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6c47ff',
        },
        headerTintColor: '#fff',
      }}>
      <Tabs.Screen
        name="wardrobe"
        options={{
          headerTitle: '✨ My Wardrobe ✨',
          tabBarIcon: ({ color, size }) => <Ionicons name="body" size={size} color={color} />,
          tabBarLabel: 'Wardrobe',
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: '✨ Outfits ✨',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          tabBarLabel: 'Outfits',
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: '✨ Profile ✨',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          tabBarLabel: 'My Profile',
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
      
      <Tabs.Screen
        name="cloth_card"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="add_item_page"
        options={{
          headerTitle: 'Add Cloth Item',
          href: null,
        }}
      />
      <Tabs.Screen
        name="add_cloth_item"
        options={{
          headerTitle: 'Add A Cloth Item',
          href: null,
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
      <Tabs.Screen
        name="choose_image_modal"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="outfit_item_details"
        options={{
          headerTitle: 'Outfit Item Details',
          href: null,
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
              onPress={handleDeleteCloth}
              style={{
                paddingRight: 5,
                paddingTop: 4,
              }}>
              <Ionicons name="trash-outline" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          href: null,
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
      <Tabs.Screen
        name="weather_card"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="spinner_overlay"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="select_location_modal"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

export default TabsPage;