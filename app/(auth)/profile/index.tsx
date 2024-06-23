import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
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
  const [statsData, setStatsData] = useState("empty");
  const [wardrobeUsageError, setWardrobeUsageError] = useState("");
  const [outfitUsageError, setOutfitUsageError] = useState("");
  const [colorsError, setColorsError] = useState("");

  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.emailAddresses[0].emailAddress);
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const stats = await DataStorageSingleton.getInstance().getStats(await getToken(), userId, isLoaded);
        if(stats == undefined || stats.status == 'wardrobe empty'){
          setStatsData("empty");
          return;
        }
        console.log(stats.clothingSeasonDistribution);
        setStatsData(stats);
        if (stats.wardrobeUsage.worn_clothes_percentage.error != undefined) {
          setWardrobeUsageError(stats.wardrobeUsage.worn_clothes_percentage.error);
        } else {
          setWardrobeUsageError("");
          setClothPercentage(Math.round(stats.wardrobeUsage.worn_clothes_percentage * 100) / 100);
        }
        if(stats.wardrobeUsage.worn_outfits_percentage.error != undefined) {
          setOutfitUsageError(stats.wardrobeUsage.worn_outfits_percentage.error);
        } else {
          setOutfitUsageError("");
          setOutfitPercentage(stats.wardrobeUsage.worn_outfits_percentage);
          setWornOutfits(stats.wardrobeUsage.worn_outfits);
          setTotalOutfits(stats.wardrobeUsage.total_outfits);
        }
        if (stats.topColors.error != undefined) {
          setColorsError(stats.topColors.error);
        } else {
          setColorsError("");
        }
        setSeason(stats.wardrobeUsage.season);
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

  const colorMap = {
    white: '#FFFFFF',
    beige: '#F5F5DC',
    turquoise: '#40E0D0',
    black: '#000000',
    blue: '#0000FF',
    purple: '#800080',
    brown: '#A52A2A',
    'dark-green': '#006400',
    'light-green': '#90EE90',
    orange: '#FFA500',
    'light-blue': '#ADD8E6',
    'light-gray': '#D3D3D3',
    'dark-red': '#cc0000',
    'dark-yellow': '#cccc00',
    'dark-gray': '#505050',
    pink: '#ff80ff',
    'dark-blue': '#00008B',
    gray: '#808080',
    green: '#008000',
    yellow: '#FFFF00',
    red: '#FF0000',
    'light-pink': '#ffccff'
};

  return (
    <ScrollView>
      {user && (
        <View style={[styles.profile]}>
          <View style={{flexDirection: 'row', alignContent: 'space-between', width: '100%'}}>
            <TouchableOpacity onPress={onCaptureImage}>
              <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
            </TouchableOpacity>
            <View style={{marginLeft: 15, width: Dimensions.get('window').width - 140}}>
              <View style={{flexDirection: 'row', gap: 6, marginLeft: 0}}>
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
          </View>
        </View>
      )}
  
      { statsData !== "empty" ? (<>
        <View style={[styles.card, {marginTop: 20}]}> 
          <Text style={styles.title}>Wardrobe Usage</Text>
          { wardrobeUsageError != "" ? 
            <View style={{marginTop: 20, backgroundColor: 'white', width: '80%', alignSelf: 'center', padding: 10, borderRadius: 10}}>
              <Text style={{textAlign: 'center'}}>{wardrobeUsageError}</Text>
            </View> :
            <>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${clothPercentage}%` }]} />
              </View>
              <Text style={styles.usageText}>You're wearing {clothPercentage}% of your {season} wardrobe</Text>
            </>
          }
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Clothes temperature distribution</Text>
          {statsData?.clothingSeasonDistribution != undefined && <MyPieChart data={statsData?.clothingSeasonDistribution}/>}
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Top 3 most used colors this month</Text>
          { colorsError != "" ? 
            <View style={{marginTop: 20, backgroundColor: 'white', width: '80%', alignSelf: 'center', padding: 10, borderRadius: 10}}>
              <Text style={{textAlign: 'center'}}>{colorsError}</Text>
            </View> :
            <>
              <View style={{justifyContent: 'flex-start'}}>
              {statsData?.topColors != undefined && Object.entries(statsData?.topColors).map(([key, value], index) => (
                <View style={styles.colorRow} key={index}>
                  <View style={[styles.colorCircle, { backgroundColor: colorMap[key] }]} />
                  <Text style={styles.colorText}>{key}: {value} item{value > 1 ? 's':''}</Text>
                </View>
              ))}
              </View>
            </>
          }
        </View>
        
        
        <View style={styles.card}>
          <Text style={styles.title}>Outfits Usage</Text>
          { outfitUsageError != "" ? 
            <View style={{marginTop: 20, backgroundColor: 'white', width: '80%', alignSelf: 'center', padding: 10, borderRadius: 10}}>
              <Text style={{textAlign: 'center'}}>{outfitUsageError}</Text>
            </View> :
            <>
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
              <Text style={styles.detailsText}>{`${wornOutfits}/${totalOutfits} recommended outfits worn`}</Text>
            </>
          }
            
          </View>

        <View style={[styles.leastWornCard]}>
          <Text style={styles.title}>Least worn items</Text>
          <View style={{flexDirection: 'row', justifyContent:'center', width: '100%'}}>
            {statsData?.leastWornItems != undefined && Object.entries(statsData?.leastWornItems).map(([key, value], index) => (
              <View style={styles.leastWornColumn} key={key}>
                { value?.image != undefined && value?.image != '' &&
                    <>
                      <Image source={{ uri: `${value.image}` }} style={styles.image} />
                      <Text style={{alignSelf: 'center', fontWeight: 'bold'}} numberOfLines={1} ellipsizeMode='tail'>{key}</Text>
                    </>
                }
              </View>
            ))}
          </View>
        </View>
        
      </>) : (
        <View style={{marginTop: 20, backgroundColor: 'white', width: '80%', alignSelf: 'center', padding: 10, borderRadius: 10}}>
          <Text style={{textAlign: 'center'}}>Your wardrobe does not contain any clothes. Wardrobe statistics cannot be generated. </Text>
        </View>
      )}
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
    paddingVertical: 20,
    paddingLeft: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    //shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },    
    //borderRadius: 16,
    //marginHorizontal: 15,
    //marginVertical: 15,
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
    marginHorizontal: 15,
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
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: Colors.grey,
    marginTop: 5
  },
  editRow: {
    height: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    alignItems: 'center',
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
    marginTop: 3,
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