import { Alert } from "react-native";
import { ClothingItem } from "./cloth_card";
import { useAuth } from '@clerk/clerk-expo';

export class DataStorageSingleton {
    static instance: DataStorageSingleton | null = null;

    public clothingItems: ClothingItem[] = [];
    // public const [clothes, setClothes] = useState();

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
        console.log("making api call");
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_BASE_API_URL + '/outfit-items/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            // console.log(data);
            // setClothes(data); // Update the state with the fetched data
            DataStorageSingleton.getInstance().clothingItems = data;
            console.log("finished api call");
        } catch (error: any) {
            // Handle any errors, such as by displaying an alert
            Alert.alert("Error fetching data", error.message);
        }
    };

}