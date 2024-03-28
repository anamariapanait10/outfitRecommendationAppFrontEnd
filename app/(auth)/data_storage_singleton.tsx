import { Alert } from "react-native";
import { ClothingItem } from "./cloth_card";
import { WeatherItem } from "../../components/WeatherItem";

export class DataStorageSingleton {
    static instance: DataStorageSingleton | null = null;

    public clothingItems: ClothingItem[] = [];
    public weatherItems: WeatherItem[] = [];

    static getInstance() {
        if (DataStorageSingleton.instance === null) {
            DataStorageSingleton.instance = new DataStorageSingleton();
        }
        return DataStorageSingleton.instance;
    }

    public fetchClothesData = async (token: string | null, userId: string | null | undefined, isLoaded: boolean) => {
        if (!userId || !isLoaded) {
            console.log('No authenticated user found.');
            return;
        }
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BASE_API_URL + '/outfit-items/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            DataStorageSingleton.getInstance().clothingItems = data;
        } catch (error: any) {
            // Handle any errors, such as by displaying an alert
            Alert.alert("Error fetching data", error.message);
        }
    };

    private processWeatherData = (data: any) => {
        const currentTime = new Date().toLocaleTimeString("en-GB");
        const forecastTime = ['00:00:00', '03:00:00', '06:00:00', '09:00:00', '12:00:00', '15:00:00', '18:00:00', '21:00:00'];
        // get only the forecast that is after the current time
        let chosenTime = '';
        for(const time of forecastTime) {
            if (currentTime > time) {
                chosenTime = time;
            } else {
                chosenTime = time;
                break;
            }
        }

        for(var i = 0; i < data.list.length; i++) 
        {
            if (data.list[i].dt_txt.includes(chosenTime)){
                var date = data.list[i].dt_txt;
                var temperature = data.list[i].main.temp;
                var weather = data.list[i].weather[0].description;
                var icon = data.list[i].weather[0].icon;
                this.weatherItems.push(new WeatherItem(date, temperature, weather, icon));
            }
           
        }
    };

    public fetchWeatherData = async (latitude: number, longitude: number) => {
        const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}`;
        try {
          const response = await fetch(weatherAPI);
          if (response.status !== '200') {
            const data = await response.json();
            this.processWeatherData(data);
            // console.log("------------------------------");
            // console.log(JSON.stringify(data.list, null, 2));
            // console.log("------------------------------");
            // console.log(data.list.length);
            // for(var i = 0; i < data.list.length; i++) 
            // {
            //   var date = data.list[i].dt_txt;
            //   var temperature = data.list[i].main.temp;
            //   var weather = data.list[i].weather[0].description;
            //   var icon = data.list[i].weather[0].icon;
            //   this.weatherItems.push(new WeatherItem(date, temperature, weather, icon));
            // }

          } else {
            console.log("Status code: " + response.status);
          }
        } catch (error) {
          console.log(error);
        }
    };
}
