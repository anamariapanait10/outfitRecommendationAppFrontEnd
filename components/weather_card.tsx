import * as React from 'react';
import { Text, View, SafeAreaView, StyleSheet, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { DataStorageSingleton } from '../constants/data_storage_singleton';
import PaginationDots from './PaginationDots';

const WeatherDiv = React.forwardRef((props, ref) => {
    const [state, setState] = React.useState({activeIndex:0, carouselItems: []});
    const [counter, setCounter] = React.useState(0);

    const fetchWeatherData = async () => {
      await DataStorageSingleton.getInstance().fetchWeatherData();
      DataStorageSingleton.getInstance().updateCarouselWeatherItems();
      setState(DataStorageSingleton.getInstance().carouselWeatherItems);
    }

    React.useEffect(() => {
        console.log("Fetching weather data...");
        fetchWeatherData();
    }, []);

    const updateItems = () => {
        setState(DataStorageSingleton.getInstance().carouselWeatherItems);
        setCounter(counter + 1);
    };
  
    React.useImperativeHandle(ref, () => ({
      updateItems
    }));

    const _renderItem = ({item}) => {
        return (
          <View style={[{
              borderRadius: 5,
              height: 70,
              // padding: 5,
              marginLeft: 15,
              marginRight: 15, }, styles.weatherContainer]}>
            <Text style={{fontSize: 13}}>{item.title}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Image source={{ uri: "https://openweathermap.org/img/w/" + item.icon + ".png" }} style={styles.weatherImage} />
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
                    data={state.carouselItems}
                    sliderWidth={ Dimensions.get('window').width }
                    itemWidth={ Dimensions.get('window').width - 20 }
                    renderItem={_renderItem}
                    onSnapToItem = { 
                      index => setState({activeIndex:index, carouselItems: state.carouselItems}) } 
                    vertical={false}
                    />
            </View>
            <PaginationDots activeIndex={state.activeIndex} itemCount={state.carouselItems.length} />
        </SafeAreaView>
    );
    
});

const styles = StyleSheet.create({
  weatherContainer: {
    height: 70,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff', 
    shadowColor: '#000000',
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