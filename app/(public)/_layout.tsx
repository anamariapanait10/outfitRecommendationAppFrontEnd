import React from 'react';
import { Stack } from 'expo-router';
import Colors from "../../constants/Colors";

const PublicLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.purple,
        },
        headerTintColor: '#fff',
        headerBackTitle: 'Back',
        headerTitleStyle: {
          fontFamily: 'GreatVibes',
          fontSize: 30,
        },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="login"
        options={{
          headerTitle: ' Outfit Recommendation App ',
        }}></Stack.Screen>
      <Stack.Screen
        name="register"
        options={{
          headerTitle: ' Create Account ',
        }}></Stack.Screen>
      <Stack.Screen
        name="reset"
        options={{
          headerTitle: ' Reset Password ',
        }}></Stack.Screen>
    </Stack>
  );
};

export default PublicLayout;
