import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';

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
          headerTitle: 'My Wardrobe',
          tabBarIcon: ({ color, size }) => <Ionicons name="body" size={size} color={color} />,
          tabBarLabel: 'Wardrobe',
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          tabBarLabel: 'Home',
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: 'My Profile',
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
        }}
      />
    </Tabs>

  );
};

export default TabsPage;