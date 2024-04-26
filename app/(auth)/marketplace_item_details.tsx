import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { DataStorageSingleton } from "./data_storage_singleton";
import { useAuth } from "@clerk/clerk-expo";
import SpinnerOverlay from "./spinner_overlay";
import { ClothingItem } from "./cloth_card";
import { set } from "date-fns";

export class MarketplaceItem {
    id: number;
    userId: string;
    outfit: ClothingItem;
    description: string;
    status: string;
    images: string[];
    condition: string;
    size: string;
    brand: string;
    postedDate: string;
    price: number;
    location: string;

    constructor(
        id: number,
        userId: string,
        outfit: ClothingItem,
        description: string,
        status: string,
        images: string[],
        condition: string,
        size: string,
        brand: string,
        postedDate: string,
        price: number,
        location: string
    ) {
        this.id = id;
        this.userId = userId;
        this.outfit = outfit;
        this.description = description;
        this.status = status;
        this.images = images;
        this.condition = condition;
        this.size = size;
        this.brand = brand;
        this.postedDate = postedDate;
        this.price = price;
        this.location = location;
    }
}

const MarketplaceItemDetails = () => {
    const { isLoaded, userId, getToken } = useAuth();
    const { id } = useLocalSearchParams();
    const [item, setItem] = useState<MarketplaceItem | undefined>();
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if(typeof id === 'string') {
            setLoading(true);
            let i = await DataStorageSingleton.getInstance().getMarketplaceItemById(id, await getToken(), userId, isLoaded);
            setItem(i);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <SpinnerOverlay isVisible={loading} />
            <Text style={styles.title}>{item?.description}</Text>
            <Image style={styles.image} source={{ uri: item?.outfit.image }} />
            <Text style={styles.detail}>Brand: {item?.brand}</Text>
            <Text style={styles.detail}>Size: {item?.size}</Text>
            <Text style={styles.detail}>Condition: {item?.condition}</Text>
            <Text style={styles.detail}>Price: ${item?.price}</Text>
            <Text style={styles.detail}>Location: {item?.location}</Text>
            <Text style={styles.detail}>Posted Date: {item?.postedDate}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default MarketplaceItemDetails;
