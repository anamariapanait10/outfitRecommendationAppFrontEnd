import { Animated, View, Text, Alert, Image, StyleSheet, PanResponder, Dimensions, Button } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import Colors from "../../constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import OutfitCalendar from './calendar';
import WeatherDiv from './weather_card';
import { TouchableOpacity, FlatList } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { DataStorageSingleton } from './data_storage_singleton';
import { set } from 'date-fns';
import TransparentClothCard, { TransparentClothingItem } from '../../components/TransparentClothCard';
import { ClothingItem } from './cloth_card';
import LocationSelector from './select_location_modal';
import * as Location from 'expo-location';

const Home = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [recommendedCloth, setRecommendedCloth] = useState(null);
  const [clothes, setClothes] = useState<ClothingItem[] | undefined>([]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  
  const weatherDivRef = useRef(null);

  // Function to call the child's function
  const callWeatherUpdate = () => {
    weatherDivRef.current?.updateItems();
  };


  // useEffect(() => {
  //   console.log("Fetching weather data...");
  //   fetchWeatherData();
  // }, []);

  const displayDate = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString();
  };
  
  // const fetchClothesData = async () => {
  //   await DataStorageSingleton.getInstance().fetchClothesData(await getToken(), userId, isLoaded);
  //   let clothesItems = DataStorageSingleton.getInstance().clothingItems;
  //   let len = clothesItems.length;
  //   let topwearList = clothesItems.filter((item) => item.category == 'Topwear');
  //   let topwear = topwearList[Math.floor(Math.random() * topwearList.length)];
  //   let bottomwearList = clothesItems.filter((item) => item.category == 'Bottomwear');
  //   let bottomwear = bottomwearList[Math.floor(Math.random() * bottomwearList.length)];
  //   let footwearList = clothesItems.filter((item) => item.category == 'Footwear');
  //   let footwear = footwearList[Math.floor(Math.random() * footwearList.length)];
  //   setClothes([topwear, bottomwear, footwear]);
  // };

  const fetchClothesData = async (refreshWeatherData=false) => {
    if(DataStorageSingleton.getInstance().weatherItems.length == 0 || refreshWeatherData) {
      await DataStorageSingleton.getInstance().fetchWeatherData();
      await DataStorageSingleton.getInstance().updateCarouselWeatherItems();
      callWeatherUpdate();
    }
    let weatherItem = DataStorageSingleton.getInstance().weatherItems[0];
    // console.log("weatherItem ", weatherItem);
    let temperatureNumber = Number(weatherItem.temperature);
    let temperatureString = "";
    if(temperatureNumber < 10) {
      temperatureString = "Cold";
    } else if(temperatureNumber >= 10 && temperatureNumber < 20) {
      temperatureString = "Mild";
    } else {
      temperatureString = "Hot";
    }
    let weatherString = "";
    if(weatherItem.weatherId < 600) {
      weatherString = "rainy";
    } else if(weatherItem.weatherId < 700) {
      weatherString = "snowy";
    } else if(weatherItem.weatherId < 800) {
      weatherString = "overcast";
    } else if(weatherItem.weatherId == 800) {
      weatherString = "sunny";
    } else {
      weatherString = "overcast";
    }
    // await DataStorageSingleton.getInstance().fetchRecommendations(await getToken(), userId, isLoaded, weatherString, temperatureString);
    // setClothes(DataStorageSingleton.getInstance().recommendations);
  };

  const fetchRadomOutfit = async () => {
    if (!userId || !isLoaded) {
      console.log('No authenticated user found.');
      return;
    }
    console.log('Fetching random outfit...');
    console.log("clothes ", clothes);
    
  };

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
      Alert.alert("Error", error.message);
    }
  };

  // useEffect(() => {
  //   fetchClothesData(); 
  // });
  useEffect(() => {
    fetchClothesData();
    // fetchRadomOutfit();
  }, []);

  const wearOutfit = async () => {
    if(clothes != undefined) {
      DataStorageSingleton.getInstance().wearOutfit(clothes, new Date().toISOString().split('T')[0], await getToken(), userId, isLoaded);
    }
  }

  const handleSelectLocation = async (location) => {
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude: location.latitude,
      longitude: location.longitude
    });
    
    if (reverseGeocode.length > 0) {
      DataStorageSingleton.getInstance().selectedLocation = {
          city: reverseGeocode[0].city,
          county: reverseGeocode[0].region,
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
      };
    } else {
      DataStorageSingleton.getInstance().selectedLocation = location;
    }
    
    setLocationModalVisible(false);
    fetchClothesData(true);
  };
  
  return (
    <View style={styles.container}>

      <View style={styles.weatherAndLocationContainer}>
        <View style={styles.locationAndCalendarContainer}>
          <TouchableOpacity style={styles.locationContainer} onPress={() => setLocationModalVisible(true)}>
            <Ionicons style={styles.location} name="location" size={24}/>
            {/* <Text style={styles.location}>Bucharest</Text> */}
            {DataStorageSingleton.getInstance().selectedLocation &&
             <Text style={styles.location}>{DataStorageSingleton.getInstance().selectedLocation.city}</Text>}

            {DataStorageSingleton.getInstance().selectedLocation && !DataStorageSingleton.getInstance().selectedLocation.city &&
             DataStorageSingleton.getInstance().selectedLocation.county && 
              <Text style={styles.location}>
                {DataStorageSingleton.getInstance().selectedLocation.county}
              </Text>
            }
            {DataStorageSingleton.getInstance().selectedLocation && !DataStorageSingleton.getInstance().selectedLocation.city &&
              !DataStorageSingleton.getInstance().selectedLocation.county &&
              <Text style={styles.location}>
                {DataStorageSingleton.getInstance().selectedLocation.latitude.toFixed(2)},
                {DataStorageSingleton.getInstance().selectedLocation.longitude.toFixed(2)}
              </Text>
            }
            <LocationSelector
                visible={locationModalVisible}
                onClose={() => setLocationModalVisible(false)}
                onSelectLocation={handleSelectLocation}
            />
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={() => router.replace({pathname: '/(auth)/calendar'})}>
              <Text style={styles.calendar}>See calendar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={styles.weatherContainer}>
          <Text>Fri Mar 22</Text>
          <Text style={styles.weatherText}>🌤️ 25°C</Text>
        </View> */}

         <View style={{height: 80, width: 360}}>
           <WeatherDiv ref={weatherDivRef} />
        </View>
      </View>
      {/* <View style={{height: 80, width: 400}}>
        <WeatherDiv />
      </View> */}

      {/* <Text style={styles.welcomeText}>Welcome! 🎉</Text> */}
      <View style={styles.recommendedOutfitContainer}>
        <Text style={styles.recommendedOutfitTitle}>Recommendations for today</Text>
        {clothes ? (
          // <View style={styles.outfitDetails}>
          //   <Image source={{ uri: recommendedCloth.image.toString() }} style={styles.outfitImage} />
          //   <Text style={styles.outfitName}>{recommendedCloth.name}</Text>
          // </View>
          <View style={{ height: 300 }}>
            <FlatList
              style={{ width: '100%' }}
              data={clothes}
              renderItem={({ item }) => <TransparentClothCard {...item} />}
              // keyExtractor={item => item.id.toString()}
              numColumns={1}
            />
            <Button title='Wear This Outfit' onPress={wearOutfit}></Button>
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
    fontSize: 25,
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
    marginTop: 50,
    width: '80%',
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
  weatherAndLocationContainer: {
    width: '90%',
  },
  locationAndCalendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  locationContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  weatherContainer: {
    height: 70,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 50,
  },
  weatherText: {

  },
  location: {
    color: Colors.grey,
  },
  calendar: {
    color: "#007AFF"
  },
  swipeableContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'lightblue',
    position: 'absolute',
    bottom: 50,
  },
  dateText: {
    fontSize: 18,
  },
});

export default Home;
