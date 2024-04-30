import { Tabs, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { TouchableOpacity, Text, View } from 'react-native';
import Colors from "../../constants/Colors";
import { useRouter } from 'expo-router';
import { DataStorageSingleton } from '../../constants/data_storage_singleton';


const TabsPage = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown:false,
        headerStyle: {
          backgroundColor: Colors.purple, // '#6c47ff',
        },
        headerTintColor: '#fff',
        tabBarActiveTintColor:  Colors.purple,
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
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};

export default TabsPage;