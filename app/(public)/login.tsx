import { useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../../constants/Colors';

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Spinner visible={loading} />

      <TextInput autoCapitalize="none" placeholder="example@domain.com" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />
      <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />

      <TouchableOpacity onPress={onSignInPress} style={styles.loginButton}>
        <Text style={{color: 'white', fontSize: 18}}>Login</Text>
      </TouchableOpacity>

      <Link href="/reset" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Forgot password?</Text>
        </Pressable>
      </Link>
      <Link href="/register" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Create An Account</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 50,
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
    margin: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.purple,
  },
  loginButton: {
    backgroundColor: Colors.purple,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  }
});

export default Login;