import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import MarketplaceItemTable from '../../components/MarketplaceItemTable';

const MarketplaceScreen = () => {
    const [items, setItems] = useState([]);
    const { isLoaded, userId, getToken } = useAuth();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const makeGetRequest = async () => {
            if (!userId || !isLoaded) {
              console.log("No authenticated user found.");
              return;
            }
            try {
                const token = await getToken();
        
                const response = await fetch(
                    process.env.EXPO_PUBLIC_BASE_API_URL + `/marketplace-items/get_available_items_for_user?userId=${userId}`,
                    {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    }
                );
        
                if (!response.ok) {
                    throw new Error("Something went wrong");
                }
        
                const json = await response.json();
                console.log("GET request response:", json);
                setItems(json);
            } catch (error) {
                console.error("Error making POST request:", error);
            }
        };
      
        makeGetRequest();
    };

    // const renderItem = ({ item }) => (
    //     <Card style={styles.card}>
    //         <Card.Title title={item.brand} subtitle={item.price + " EUR"} /> 
    //         <Card.Content>
    //             <Text>{item.description}</Text>
    //             <Text>Condition: {item.condition}</Text>
    //             <Text>Size: {item.size}</Text>
    //             <Text>Brand: {item.brand}</Text>
    //             <Text>Location: {item.location}</Text>
    //             <Image source={{ uri: item.outfit.image }} style={{ width: 200, height: 200 }} />
    //         </Card.Content>
    //         <Card.Actions>
    //             <Button onPress={() => router.replace({pathname: '/(auth)/marketplace_item_details', params: {id: item.id}})}>View Details</Button>
    //         </Card.Actions>
    //     </Card>
    // );

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
          <View style={styles.container}>
            <View style={{width: '65%'}}>
                <MarketplaceItemTable {...item} />
            </View>
            <View style={styles.info}>
              <Image source={{ uri: item.outfit.image }} style={styles.image} />
              <Card.Actions>
                <TouchableOpacity style={styles.button} onPress={() => router.replace({pathname: '/(auth)/marketplace_item_details', params: {id: item.id}})}>
                    <Text style={{color: 'white'}}>View Details</Text>
                </TouchableOpacity>
              </Card.Actions>
            </View>
          </View>
        </Card>
      );

    return (
        <View style={styles.container}>
            {!items ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 8,
        overflow: 'hidden',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    image: {
        width: 'auto',
        height: 150,
        marginLeft: 10,
        marginTop: 10,
        marginRight: 10,
        borderRadius: 15,
    },
    info: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    text: {
        marginBottom: 4,
    },
    button: {
        padding: 10,
        backgroundColor: '#7b68ee',
        color: 'white',
        borderRadius: 5,
        marginTop: 20,
    }
});

export default MarketplaceScreen;