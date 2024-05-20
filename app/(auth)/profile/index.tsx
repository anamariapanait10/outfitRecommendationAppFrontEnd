import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { DataStorageSingleton } from "../../../constants/data_storage_singleton";
import { useAuth } from '@clerk/clerk-expo';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import MyPieChart from '../../../components/pie_chart';
import { set } from 'date-fns';

const Profile = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress);
  const [edit, setEdit] = useState(false);
  const [clothPercentage, setClothPercentage] = useState(0);
  const [outfitPercentage, setOutfitPercentage] = useState(0);
  const [wornOutfits, setWornOutfits] = useState(0);
  const [totalOutfits, setTotalOutfits] = useState(0);
  const [season, setSeason] = useState('');
  const { isLoaded, userId, getToken } = useAuth();
  const [newStatsData, setNewStatsData] = useState({});

  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.emailAddresses[0].emailAddress);
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const stats = await DataStorageSingleton.getInstance().makeGETRequest('/stats/get_stats?userId='+userId, await getToken(), userId, isLoaded);
        console.log("Stats: ", stats);
        setClothPercentage(Math.round(stats.worn_clothes_percentage * 100) / 100);
        setOutfitPercentage(stats.worn_outfits_percentage);
        setWornOutfits(stats.worn_outfits);
        setTotalOutfits(stats.total_outfits);
        setSeason(stats.season);

        const newStats = await DataStorageSingleton.getInstance().getNewStats(await getToken(), userId, isLoaded);
        setNewStatsData(newStats);
      };
      fetchData();
    }, [])
  );

  const onSaveUser = async () => {
    setEdit(false);
    try {
      if (!firstName || !lastName) return;
      await user?.update({
        firstName,
        lastName,
      });
    } catch (e) {
      console.log(JSON.stringify(e));
    } finally {
      setEdit(false);
    }
  };

  const onCaptureImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
      base64: true,
    });

    if(!result.canceled){
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      user?.setProfileImage({
        file: base64
      });
    }

  }

  return (
    <ScrollView>
      {user && (
        <View style={styles.profile}>
          <TouchableOpacity onPress={onCaptureImage}>
            <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', gap: 6}}>
            {edit ? (
              <View style={styles.editRow}>
                <TextInput placeholder='First Name' value={firstName || ''} onChangeText={setFirstName} style={styles.inputField} />
                <TextInput placeholder='Last Name' value={lastName || ''} onChangeText={setLastName} style={styles.inputField} />
                <TouchableOpacity onPress={onSaveUser}>
                  <Ionicons name="checkmark-outline" size={24} color={Colors.dark} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.editRow}>
                <Text style={{fontSize: 22 }}>{firstName} {lastName} </Text>
                <TouchableOpacity onPress={() => setEdit(true)}>
                  <Ionicons name="create-outline" size={24} color={Colors.dark} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text>{email}</Text>
          <Text>Since {user?.createdAt?.toLocaleDateString()}</Text>
        </View>
      )}
      <View style={styles.card}> 
        <Text style={styles.title}>Wardrobe Usage</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${clothPercentage}%` }]} />
        </View>
        <Text style={styles.usageText}>You're wearing {clothPercentage}% of your {season} wardrobe</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Clothes temperature distribution</Text>
        {newStatsData?.clothingSeasonDistribution != undefined && <MyPieChart data={newStatsData?.clothingSeasonDistribution}/>}
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Top 3 most used colors</Text>
        <View style={{justifyContent: 'flex-start'}}>
          {newStatsData?.topColors != undefined && Object.entries(newStatsData?.topColors).map(([key, value], index) => (
            <View style={styles.colorRow} key={index}>
              <View style={[styles.colorCircle, { backgroundColor: key }]} />
              <Text style={styles.colorText}>{key}: {value} item{value > 1 ? 's':''}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.leastWornCard]}>
        <Text style={styles.title}>Least worn items</Text>
        <View style={{flexDirection: 'row', justifyContent:'center', width: '100%'}}>
          {newStatsData?.leastWornItems != undefined && Object.entries(newStatsData?.leastWornItems).map(([key, value], index) => (
            <View style={styles.leastWornColumn} key={index}>
              <Image source={{ uri: `${value.image}` }} style={styles.image} />
              <Text style={{alignSelf: 'center', fontWeight: 'bold'}} numberOfLines={1} ellipsizeMode='tail'>{key}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <AnimatedCircularProgress
          size={120}
          width={15}
          fill={outfitPercentage}
          tintColor={Colors.purple} //"#FF9500"
          backgroundColor={Colors.light_purple}>
          {
            (fill) => (
              <Text style={styles.percentageText}>
                {`${Math.round(fill)}%`}
              </Text>
            )
          }
        </AnimatedCircularProgress>
        <Text style={styles.detailsText}>{`${wornOutfits}/${totalOutfits} outfits worn`}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24
  },
  header: {
    fontSize: 24,
  },
  profile: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    width: 100,
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    // margin: 20,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: 'center',
    // gap: 14,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  leastWornCard: {
    // margin: 20,
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 2,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: 'center',
    // gap: 14,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  editRow: {
    height: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.purple,
    borderRadius: 10,
  },
  usageText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  percentageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark_purple,
  },
  detailsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  leastWornColumn: {
    flexDirection: 'column',
    marginHorizontal: 5,
    width: '28%'
  },
  colorCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: 'black',
  },
  colorText: {
    fontSize: 16,
    color: '#333',
  },
  valueText: {
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
},
});

export default Profile;