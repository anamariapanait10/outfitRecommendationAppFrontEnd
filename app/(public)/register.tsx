import { Pressable, TextInput, View, StyleSheet, TouchableOpacity, Text, ImageBackground} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import Spinner from 'react-native-loading-spinner-overlay';
import { useState } from 'react';
import { Stack, Link } from 'expo-router';
import Colors from '../../constants/Colors';

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/login_screen.jpg')} style={styles.backgroundImage} imageStyle={styles.backgroundImageOpacity}>
      <View style={styles.container}>
        <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
        <Spinner visible={loading} />

        <Text style={styles.title}>Register</Text>

        {!pendingVerification && (
          <>
            <TextInput autoCapitalize="none" placeholder="example@domain.com" value={emailAddress} onChangeText={setEmailAddress} style={styles.inputField} />
            <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputField} />

            <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
                <Text style={{color: 'white', fontSize: 18}}>Sign up</Text>
            </TouchableOpacity>
          </>
        )}

        {pendingVerification && (
          <>
            <View>
              <TextInput value={code} placeholder="Enter sent code" style={styles.inputField} onChangeText={setCode} />
            </View>

            <TouchableOpacity onPress={onPressVerify} style={styles.button}>
                <Text style={{color: 'white', fontSize: 18}}>Verify Email</Text>
            </TouchableOpacity>
          </>
        )}

        <Link href="/login" asChild>
          <Pressable style={styles.link}>
            <Text style={styles.buttonText}>Already have an account? Login</Text>
          </Pressable>
        </Link>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  backgroundImageOpacity: {
    opacity: 0.5, 
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
  link: {
    margin: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.purple,
  },
  button: {
    backgroundColor: Colors.purple,
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.purple,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Register;