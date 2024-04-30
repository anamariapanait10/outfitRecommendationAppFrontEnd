import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import Colors from "../../constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import WeatherDiv from './weather_card';
import { TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { DataStorageSingleton } from './data_storage_singleton';
import TransparentClothCard from '../../components/TransparentClothCard';
import { ClothingItem } from './cloth_card';
import LocationSelector from './select_location_modal';
import * as Location from 'expo-location';

const Home = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [recommendedCloth, setRecommendedCloth] = useState(null);
  const [clothes, setClothes] = useState<ClothingItem[] | undefined>([]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  
  const weatherDivRef = useRef(null);

  const callWeatherUpdate = () => {
    weatherDivRef.current?.updateItems();
  };

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
    await DataStorageSingleton.getInstance().fetchRecommendations(await getToken(), userId, isLoaded, weatherString, temperatureString);
    setClothes(DataStorageSingleton.getInstance().recommendations);
  };

  useEffect(() => {
    fetchClothesData();
  }, []);

  const wearOutfit = async () => {
    if(clothes != undefined) {
      const currentDate = new Date();
      const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      await DataStorageSingleton.getInstance().fetchOutfitsForMonth(currentYearMonth, await getToken(), userId, isLoaded);
      let outfits = DataStorageSingleton.getInstance().monthOutfits;
      if (currentDate.toISOString().split('T')[0] in outfits){
        console.log("Exista deja");
      } else {
        DataStorageSingleton.getInstance().wearOutfit(clothes, new Date().toISOString().split('T')[0], await getToken(), userId, isLoaded);
      }
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
            <Ionicons style={styles.location} name="location" size={22}/>
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
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => router.replace({pathname: '/(auth)/calendar'})}>
              <Ionicons style={[styles.location, {paddingTop: 1.5, padding: 2, color: Colors.purple}]} name="calendar-outline" size={19}/>
              <Text style={styles.calendar}> See calendar </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{height: 90, width: '100%', marginBottom: 10}}>
        <WeatherDiv ref={weatherDivRef} />
      </View>
      <View style={styles.recommendedOutfitContainer}>
        <Text style={styles.recommendedOutfitTitle}>Recommendations for today based on weather</Text>
        {/* <ImageBackground
            source={require('../../assets/images/titleBackground.png')}
            style={styles.image}
            resizeMode="contain"
          >
          <Text style={styles.recommendedOutfitTitle}>Recommendations for today based on weather</Text>
        </ImageBackground> */}
        {clothes ? (
          <View style={{ height: 310, justifyContent: 'center', alignItems: 'center' }}>
            <FlatList
              style={{ width: '100%' }}
              data={clothes}
              renderItem={({ item }) => <TransparentClothCard {...item} />}
              numColumns={1}
            />
            <TouchableOpacity style={styles.wearOutfitButton} onPress={wearOutfit}>
                <Text style={styles.wearOutfitButtonText}>Wear This Outfit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noOutfitText}>No recommended outfit found</Text>
        )}
      </View>
      <TouchableOpacity style={styles.wearAnotherOutfitButton} onPress={() => router.replace({pathname: '/(auth)/outfit_picker'})}>
          <Text style={styles.wearOutfitButtonText}>Or Try Another Outfit</Text>
      </TouchableOpacity>
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
    paddingTop: 0,
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
    marginTop: 10,
    width: Dimensions.get('window').width - 50,
    height: '64%',
  },
  recommendedOutfitTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 30,
    margin: 20,
    textAlign: 'center',
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
    marginTop: 20,
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
    color: Colors.purple, // "#007AFF"
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
  wearOutfitButton: {
    backgroundColor: Colors.purple,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    //marginTop: 30,
  },
  wearAnotherOutfitButton: {
    backgroundColor: '#cccccc',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  wearOutfitButtonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  image: {
    height: 160,
    justifyContent: 'center',
  },
});

export default Home;
