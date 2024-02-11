import { View, Text, Alert, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';

const Home = () => {
  const { user } = useUser();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [recommendedCloth, setRecommendedCloth] = useState(null);

  const fetchRandomCloth = async () => {
    if (!userId || !isLoaded) {
        console.log('No authenticated user found.');
        return;
    }
    try {
        const token = await getToken();
        const response = await fetch(process.env.EXPO_PUBLIC_BASE_API_URL + '/outfit-items/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        // setRecommendedCloth(data[Math.floor(Math.random() * data.length)]); 
        setRecommendedCloth(data[0]); 
    } catch (error: any) {
      Alert.alert("Error fetching data", error.message);
    }
  };

  // useEffect(() => {
  //   fetchRandomCloth();
  // }, []);
  // fetchRandomCloth();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome! 🎉</Text>
      <View style={styles.recommendedOutfitContainer}>
        <Text style={styles.recommendedOutfitTitle}>Recommended Outfit</Text>
        {recommendedCloth ? (
          <View style={styles.outfitDetails}>
            <Image source={{ uri: recommendedCloth.image.toString() }} style={styles.outfitImage} />
            <Text style={styles.outfitName}>{recommendedCloth.name}</Text>
          </View>
        ) : (
          <Text style={styles.noOutfitText}>No recommended outfit found</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 25, // Increased font size for larger text
    fontWeight: 'bold',
    marginBottom: 60,
  },
  recommendedOutfitContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendedOutfitTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 30,
  },
  outfitDetails: {
    alignItems: 'center',
  },
  outfitName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
  },
  outfitImage: {
    width: 200,
    height: 200,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  noOutfitText: {
    fontSize: 14,
    color: '#a9a9a9',
  },
});


export default Home;
