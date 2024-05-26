import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Switch } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-expo';
import Colors from "../../../constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import WeatherDiv from '../../../components/weather_card';
import { TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { DataStorageSingleton } from '../../../constants/data_storage_singleton';
import TransparentClothCard from '../../../components/TransparentClothCard';
import { ClothingItem } from '../../../components/cloth_card';
import LocationSelector from '../../../components/select_location_modal';
import * as Location from 'expo-location';
import CustomAlert from '../../../components/CustomAlert';
import Carousel from 'react-native-snap-carousel';
import PaginationDots from '../../../components/PaginationDots';
import { useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [clothes, setClothes] = useState<ClothingItem[][] | undefined>([[]]);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [wearOutfitAlert, setWearOutfitAlert] = useState(false);
  const [wearOutfitSuccessAlert, setWearOutfitSuccessAlert] = useState(false);
  const [recommendationError, setRecommendationError] = useState('No recommended outfit found');
  const [activeSlide, setActiveSlide] = useState(0);
  const [weather, setWeather] = useState('sunny');
  const [temperature, setTemperature] = useState('hot');
  const [loading, setLoading] = useState(false);
  const [isOnePiece, setIsOnePiece] = useState(false);
  
  const weatherDivRef = useRef(null);

  const callWeatherUpdate = () => {
    weatherDivRef.current?.updateItems();
  };

  const fetchClothesData = async (refreshWeatherData=false) => {
    setLoading(true);
    if(DataStorageSingleton.getInstance().weatherItems.length == 0 || refreshWeatherData) {
      await DataStorageSingleton.getInstance().fetchWeatherData();
      await DataStorageSingleton.getInstance().updateCarouselWeatherItems();
      callWeatherUpdate();
    }
    let weatherItem = DataStorageSingleton.getInstance().weatherItems[0];
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
    setWeather(weatherString);
    setTemperature(temperatureString.toLowerCase());
    await DataStorageSingleton.getInstance().fetchRecommendations(await getToken(), userId?.toString(), isLoaded, weatherString, temperatureString, isOnePiece.toString());
    let recommendations = DataStorageSingleton.getInstance().recommendations;
    if(recommendations.error){
      setRecommendationError(recommendations.error);
    } else {
      if(recommendations.length == 3) {
        setActiveSlide(1);
      }
      setClothes(DataStorageSingleton.getInstance().recommendations);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClothesData();
  }, [isOnePiece]);

  useFocusEffect(
    React.useCallback(() => {
      fetchClothesData();
    }, [isOnePiece])
  );

  const wearOutfit = async () => {
    if(clothes != undefined) {
      const currentDate = new Date();
      const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      await DataStorageSingleton.getInstance().fetchOutfitsForMonth(currentYearMonth, await getToken(), userId, isLoaded);
      let outfits = DataStorageSingleton.getInstance().monthOutfits;
      if (currentDate.toISOString().split('T')[0] in outfits){
        setWearOutfitAlert(true);
      } else {
        DataStorageSingleton.getInstance().wearOutfit(clothes[activeSlide], currentDate.toISOString().split('T')[0], await getToken(), userId, isLoaded);
        setWearOutfitSuccessAlert(true);
      }
    }
  }

  const replaceOutfit = async () => {
    if(clothes != undefined) {
      const currentDate = new Date().toISOString().split('T')[0];
      await DataStorageSingleton.getInstance().deleteOutfit(currentDate, await getToken(), userId, isLoaded);
      DataStorageSingleton.getInstance().wearOutfit(clothes[activeSlide], new Date().toISOString().split('T')[0], await getToken(), userId, isLoaded);
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
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => router.push({pathname: '/(auth)/home/calendar'})}>
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
          <Text style={styles.recommendedOutfitTitle}>Recommendations for today based on weather and temperature ({weather}, {temperature})</Text>
          {clothes ? (
            <View style={{ height: 320, justifyContent: 'center', alignItems: 'center' }}>
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={{width: '100%', height: 249}}/>
              ) : (
              <Carousel
                data={clothes}
                renderItem={({ item }) => (
                  <View>
                    <FlatList
                      style={{ width: '100%' }}
                      data={item}
                      renderItem={({ item }) => <TransparentClothCard {...item} />}
                      keyExtractor={(item) => item.id.toString()}
                      numColumns={1}
                    />
                  </View>
                )}
                sliderWidth={310}
                itemWidth={110}
                firstItem={activeSlide}
                onSnapToItem={(index) => setActiveSlide(index)}
                inactiveSlideScale={0.8}
                inactiveSlideOpacity={0.5}
                inactiveSlideShift={20}
              />)}
              <Text style={{fontSize: 3}}></Text>
              <PaginationDots activeIndex={activeSlide} itemCount={clothes.length} />
              <CustomAlert
                visible={wearOutfitAlert}
                onClose={() => setWearOutfitAlert(false)}
                onSubmit={() => {
                  replaceOutfit();
                  setWearOutfitAlert(false);
                }}
                question="An outfit is already scheduled for this date. Proceeding will overwrite it. Do you want to continue?"
              />
              <CustomAlert
                visible={wearOutfitSuccessAlert}
                onClose={() => setWearOutfitSuccessAlert(false)}
                onSubmit={() => setWearOutfitSuccessAlert(false)}
                question="Outfit successfully scheduled for today!"
                button="Close"
              />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.wearAnotherOutfitButton} onPress={() => router.push({pathname: '/(auth)/home/outfit_picker'})}>
                  <Text style={styles.wearOutfitButtonText}>Wear Another</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wearOutfitButton} onPress={wearOutfit}>
                  <Text style={styles.wearOutfitButtonText}>Wear This</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text style={styles.noOutfitText}>{recommendationError}</Text>
          )}
        </View> 
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Two-piece / One-piece Outfits</Text>
        <Switch
          value={isOnePiece}
          onValueChange={() => setIsOnePiece(!isOnePiece)}
          trackColor={{false: '#767577', true: Colors.purple}}
          thumbColor={isOnePiece ? Colors.light_purple : '#f4f3f4'}
        />
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
    paddingTop: 0,
    paddingBottom: 10,
    paddingHorizontal: 10,
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
    height: '66%',
  },
  recommendedOutfitTitle: {
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 15,
    marginBottom: 15,
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
    marginTop: 10,
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
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 10,
  },
  wearAnotherOutfitButton: {
    backgroundColor: '#cccccc',
    paddingVertical: 5,
    paddingHorizontal: 10,
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
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 7,
    width: '70%',
  },
  switchLabel: {
    fontSize: 16,
    //marginHorizontal: 10,
  },
});

export default Home;
