import { Alert } from "react-native";
import { ClothingItem } from "../components/cloth_card";
import { WeatherItem } from "../components/WeatherItem";
import { format } from 'date-fns';

export class DataStorageSingleton {
    static instance: DataStorageSingleton | null = null;

    public clothingItems: ClothingItem[] = [];
    public weatherItems: WeatherItem[] = [];
    public clothId: number = 0;
    public marketPlaceItemId: number = 0;
    public recommendations: ClothingItem[][] = [[]];
    public selectedLocation = {
        city: 'București',
        county: 'București',
        latitude: 44.41233794877461,
        longitude: 26.051842868328094,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    public carouselWeatherItems = {
        activeIndex:0,
        carouselItems: []
    };

    public monthOutfits = {}

    public lastAIExpertResponse = '';

    public lastWardrobeFilter = 'All';
    public lastMarketplaceTab = 'marketplace items';

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
            Alert.alert("Error fetching data", error.message);
        }
    };

    private processWeatherData = (data: any) => {
        const currentTime = new Date().toLocaleTimeString("en-GB");
        const forecastTime = ['00:00:00', '03:00:00', '06:00:00', '09:00:00', '12:00:00', '15:00:00', '18:00:00', '21:00:00'];
        // get only the forecast that is after the current time
        this.weatherItems = [];
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
                var temperature = (Math.round(parseFloat(data.list[i].main.temp) * 10) / 10).toFixed(1);
                var weatherId = data.list[i].weather[0].id;
                var icon = data.list[i].weather[0].icon;
                this.weatherItems.push(new WeatherItem(date, temperature, weatherId, icon.replace('n', 'd')));
            }
           
        }
        console.log(this.weatherItems);
    };

    public fetchWeatherData = async () => {
        let latitude = this.selectedLocation.latitude;
        let longitude = this.selectedLocation.longitude;
        // console.log("Fetching weather for " + this.selectedLocation.city);
        const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}`;
        try {
          const response = await fetch(weatherAPI);
          if (response.status !== '200') {
            const data = await response.json();
            this.processWeatherData(data);
          } else {
            console.log("Status code: " + response.status);
          }
        } catch (error) {
          console.log(error);
        }
    };

    public fetchRecommendations = async (token: string | null, userId: string | null | undefined, isLoaded: boolean, weather: string, temperature: string, isOnePiece: string, isFormal: string) => {
        if (!userId || !isLoaded) {
            console.log('No authenticated user found.');
            return;
        }
        try {
            const baseUrl = process.env.EXPO_PUBLIC_BASE_API_URL + '/outfit-items/get_recommendations/';
            const queryParams = `?weather=${encodeURIComponent(weather)}&temperature=${encodeURIComponent(temperature)}&onePiece=${isOnePiece}&userId=${userId}&isFormal=${isFormal}`;
            const urlWithParams = baseUrl + queryParams;
            const response = await fetch(urlWithParams, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if ('error' in data){
                return data;
            }
            DataStorageSingleton.getInstance().recommendations = data;
            return data;
        } catch (error: any) {
            Alert.alert("Error fetching data", error.message);
        }
    };

    public updateCarouselWeatherItems = async () => {
        this.carouselWeatherItems.carouselItems = [];
        this.carouselWeatherItems.activeIndex = 0;
        for(var i = 0; i < this.weatherItems.length; i++) {
            let item = this.weatherItems[i];
            let formattedDate = format(item.date, 'E MMM d');
            this.carouselWeatherItems.carouselItems.push({title: formattedDate, text: item.temperature + "°C", icon: item.icon});   
        }
    }

    public fetchOutfitsForMonth = async (yearMonth: string, token: string | null, userId: string | null | undefined, isLoaded: boolean) => {
        if (!userId || !isLoaded) {
            console.log('No authenticated user found.');
            return;
        }
        try {
            const baseUrl = process.env.EXPO_PUBLIC_BASE_API_URL + '/worn-outfits/get_for_year_month?yearMonth=' + yearMonth;
            const response = await fetch(baseUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            DataStorageSingleton.getInstance().monthOutfits = data;
        } catch (error: any) {
            Alert.alert("Error fetching data", error.message);
        }
    }

    public deleteOutfit = async (date: string, token: string | null, userId: string | null | undefined, isLoaded: boolean) => {
        if (!userId || !isLoaded) {
            console.log('No authenticated user found.');
            return;
        }
        try {
            const baseUrl = process.env.EXPO_PUBLIC_BASE_API_URL + '/worn-outfits/' + date + '/';
            const response = await fetch(baseUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if(response.status !== 204) {
                Alert.alert("Error fetching data", "Could not delete outfit.");
            }
        } catch (error: any) {
            Alert.alert("Error fetching data", error.message);
        }
    }

    public wearOutfit = async (clothes: ClothingItem[], date: string, token: string | null, userId: string | null | undefined, isLoaded: boolean, recommended: boolean = false) => {
        if (!userId || !isLoaded) {
            console.log('No authenticated user found.');
            return;
        }
        try {
            const baseUrl = process.env.EXPO_PUBLIC_BASE_API_URL + '/worn-outfits/wear/';
            const requestBody = JSON.stringify({
                outfit: clothes,
                date: date,
                was_recommended: recommended
            });
            console.log(requestBody);
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: requestBody
            });
            if(response.status !== 200) {
                Alert.alert("Error fetching data", "Could not save outfit.");
            } 
        } catch (error: any) {
            Alert.alert("Error fetching data", error.message);
        }
    }

    public getMarketplaceItemById = async (id: string, token: string | null, userId: string | null | undefined, isLoaded: boolean) => {
        if (!userId || !isLoaded) {
            console.log('No authenticated user found.');
            return;
        }
        try {
            const baseUrl = process.env.EXPO_PUBLIC_BASE_API_URL + '/marketplace-items/' + id;
            const response = await fetch(baseUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            return data;
        } catch (error: any) {
            Alert.alert("Error fetching data", error.message);
        }
    }

    public askAiExpert = async (top: ClothingItem | null, bottom: ClothingItem | null, foot: ClothingItem, body: ClothingItem | null, event: string, token: string | null, userId: string | null | undefined, isLoaded: boolean) => {
        if (!userId || !isLoaded) {
            console.log('No authenticated user found.');
            return;
        }
        try {
            const baseUrl = process.env.EXPO_PUBLIC_BASE_API_URL + '/ai-expert/ask/';

            let requestBody = {
                footwear: foot,
                event: event
            } as any;
            if (body) {
                requestBody.bodywear = body;

            } else {
                requestBody.topwear = top;
                requestBody.bottomwear = bottom;
            }
            requestBody = JSON.stringify(requestBody);

            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: requestBody
            });
            if(response.status !== 200) {
                Alert.alert("Error fetching data", "Could not fetch AI expert response. Please try again later.");    
            }
            const data = await response.json();
            this.lastAIExpertResponse = data;
        } catch (error: any) {
            Alert.alert("Error fetching data", error.message);
        }
    }

    public fetchSimilarItems = async (id: string, token: string | null, userId: string | null | undefined, isLoaded: boolean) => {
        if (!userId || !isLoaded) {
            console.log('No authenticated user found.');
            return;
        }
        try {
            const baseUrl = process.env.EXPO_PUBLIC_BASE_API_URL + '/marketplace-items/similarity?marketplaceItemId=' + id;
            const response = await fetch(baseUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            return data;
        } catch (error: any) {
            Alert.alert("Error fetching data", error.message);
        }
    }

    public getStats = async (token: string | null, userId: string | null | undefined, isLoaded: boolean) => {
        return await this.makeGETRequest('/stats/get_stats?userId='+userId, token, userId, isLoaded);
    }

    public makeGETRequest = async (endpoint: string, token: string | null, userId: string | null | undefined, isLoaded: boolean, customResponseProcessing?: (data: any) => void) => {
        if (!userId || !isLoaded) {
            console.log('No authenticated user found.');
            return;
        }
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BASE_API_URL + endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (customResponseProcessing) {
                customResponseProcessing(data);
            } else {
                return data;
            }
        } catch (error: any) {
            Alert.alert("Error fetching data", error.message);
        }
    };

}
