import { Stack, router } from 'expo-router';
import Colors from '../../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
    return (
      <Stack
        screenOptions={{
          headerStyle: {
              backgroundColor: Colors.purple, // '#6c47ff',
          },
          headerTintColor: '#fff',
        }}>
    
        <Stack.Screen name="index" options={{
            headerTitle: ' Outfits ',
            headerTitleStyle: {
              fontFamily: 'GreatVibes',
              fontSize: 26,
            },
            headerTitleAlign: 'center',
          }} />

        <Stack.Screen
          name="calendar"
          options={{
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
        <Stack.Screen
          name="outfit_picker"
          options={{
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
      </Stack>
    );
  }