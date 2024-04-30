import { Tabs, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { TouchableOpacity, Text, View } from 'react-native';
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
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.purple, // '#6c47ff',
        },
        headerTintColor: '#fff',
        tabBarActiveTintColor:  Colors.purple,
      }}>
      <Tabs.Screen
        name="wardrobe"
        options={{
          headerTitle: ' My Wardrobe ',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 24,
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => <Ionicons name="body" size={size} color={color} />,
          tabBarLabel: 'Wardrobe',
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: ' Outfits ',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 26,
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          tabBarLabel: 'Outfits',
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
        name="filter_bar"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="add_cloth_item"
        options={{
          headerTitle: 'Add A Cloth Item',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 21,
          },
          headerTitleAlign: 'center',
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
          headerTitle: 'Outfit Item Details ',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 24,
          },
          headerTitleAlign: 'center',
          href: null,
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
      <Tabs.Screen
        name="calendar"
        options={{
          href: null,
          headerTitle: 'Calendar',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 26,
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
      <Tabs.Screen
        name="add_marketplace_item"
        options={{
          href: null,
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
      <Tabs.Screen
        name="marketplace"
        options={{
          headerTitle: ' Marketplace ',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 24,
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => <Ionicons name="bag-handle-outline" size={size} color={color} />,
          tabBarLabel: 'Marketplace',
        }}
      />
      <Tabs.Screen
        name="outfit_picker"
        options={{
          href: null,
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 24,
          },
          headerTitleAlign: 'center',
          headerTitle: ' Choose Your Outfit ',
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
        name="marketplace_item_details"
        options={{
          href: null,
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
              <Ionicons name="trash-outline" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: ' Profile ',
          headerTitleStyle: {
            fontFamily: 'GreatVibes',
            fontSize: 26,
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          tabBarLabel: 'My Profile',
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};

export default TabsPage;