import { View, StyleSheet, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import Colors from '../../constants/Colors';

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();

  // Request a passowrd reset code by email
  const onRequestReset = async () => {
    try {
      await signIn!.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });
      alert('Password reset successfully');

      // Set the user session active, which will log in the user automatically
      await setActive!({ session: result.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

      {!successfulCreation && (
        <>
          <TextInput autoCapitalize="none" placeholder="example@domain.com" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />

          <TouchableOpacity onPress={onRequestReset} style={styles.button}>
              <Text style={{color: 'white', fontSize: 18}}>Send Reset Email</Text>
          </TouchableOpacity>
        </>
      )}

      {successfulCreation && (
        <>
          <View>
            <TextInput value={code} placeholder="Enter sent code" style={styles.inputField} onChangeText={setCode} />
            <TextInput placeholder="New password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />
          </View>
          <TouchableOpacity onPress={onReset} style={styles.button}>
              <Text style={{color: 'white', fontSize: 18}}>Set new Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.purple,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: Colors.purple,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default PwReset;