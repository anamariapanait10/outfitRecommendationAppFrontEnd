import * as React from 'react';
import { Text, View, SafeAreaView, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { DataStorageSingleton } from './data_storage_singleton';
import { format } from 'date-fns';

const WeatherDiv = () => {

    const [carousel, setCarousel] = React.useState();
    const [state, setState] = React.useState({activeIndex:0, carouselItems: []});

    const fetchWeatherData = async () => {
        
        await DataStorageSingleton.getInstance().fetchWeatherData(44.4268, 26.1025);
        let carouselItems = [];
        for(var i = 0; i < DataStorageSingleton.getInstance().weatherItems.length; i++) {
            let item = DataStorageSingleton.getInstance().weatherItems[i];
            let formattedDate = format(item.date, 'E MMM d');
            carouselItems.push({title: formattedDate, text: item.temperature + "°C", icon: item.icon});   
        }

        setState({
          activeIndex:0,
          carouselItems: carouselItems
        });
    }

    React.useEffect(() => {
        console.log("Fetching weather data...");
        fetchWeatherData();
    }, []);


    const _renderItem = ({item}) => {
        return (
          <View style={[{
              // backgroundColor:'transparent',
              borderRadius: 5,
              height: 70,
              padding: 5,
              marginLeft: 15,
              marginRight: 15, }, styles.weatherContainer]}>
            <Text style={{fontSize: 13}}>{item.title}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Image source={{ uri: "http://openweathermap.org/img/w/" + item.icon + ".png" }} style={styles.weatherImage} />
                <Text>{item.text}</Text>
            </View>
          </View>

        )
    }

  
    return (
        <SafeAreaView style={{flex: 1}}>
        <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center'}}>
            <Carousel
                layout={"default"}
                ref={ref => setCarousel(ref)}
                data={state.carouselItems}
                sliderWidth={355}
                itemWidth={355}
                renderItem={_renderItem}
                onSnapToItem = { index => setState({activeIndex:index, carouselItems: state.carouselItems}) } />
        </View>
        </SafeAreaView>
    );
    
}

const styles = StyleSheet.create({
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
  weatherImage: {
    width: 30,
    height: 30,
    alignContent: 'center',
  }
});

export default WeatherDiv;