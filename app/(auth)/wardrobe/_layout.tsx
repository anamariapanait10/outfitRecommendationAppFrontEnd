import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Colors from '../../../constants/Colors';

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
                headerTitle: 'Add A Clothing Item',
                headerTitleStyle: {
                    fontFamily: 'AlexBrush',
                    fontSize: 25,
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
          }}
        />
        <Stack.Screen
            name="outfit_item_details/add_marketplace_item"
            options={{
              headerTitle: ' Add Item To Marketplace ',
              headerTitleStyle: {
                fontFamily: 'AlexBrush',
                fontSize: 25,
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
            name="outfit_item_details/edit_outfit_item"
            options={{
              headerTitle: ' Edit Outfit Item ',
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
      </Stack>
    );
  }