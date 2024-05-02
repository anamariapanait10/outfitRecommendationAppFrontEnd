import React, {useEffect, useState} from 'react';
import { Dimensions, View, Text, Image, StyleSheet, Modal, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Colors from '../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataStorageSingleton } from './data_storage_singleton';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../../components/CustomAlert';
import SpinnerOverlay from './spinner_overlay';
import { useFocusEffect } from '@react-navigation/native';
import { set } from 'date-fns';

const OutfitCalendar = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDayOutfit, setSelectedDayOutfit] = useState({top: null, bottom: null, shoes: null, date: null});
  const [outfits, setOutfits] = useState({});
  const currentDate = new Date();
  const currentYearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const [yearMonth, setYearMonth] = useState(currentYearMonth);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMonthOutfits = async () => {
    setLoading(true);
    await DataStorageSingleton.getInstance().fetchOutfitsForMonth(yearMonth, await getToken(), userId, isLoaded);
    setOutfits(DataStorageSingleton.getInstance().monthOutfits);
    setLoading(false);
  }

  const handleDeleteOutfit = async (date) => {
    if (!userId || !isLoaded) {
      console.log('No authenticated user found.');
      return;
    }
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/worn-outfits/${date}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete the outfit');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMonthOutfits();
    }, [])
  );

  useEffect(() => {
    fetchMonthOutfits();
  }, [yearMonth]);

  const renderOutfitItem = (item) => {
    return (
      <View>
        <Image source={{ uri: item?.image }} style={styles.outfitImage} />
      </View>
    );
  };

  const renderOutfitsForDay = (day) => {
    const dateOutfits = outfits[day.dateString] || {};
    
    if(dateOutfits) {
      return (
        <View>
          <Image source={{ uri: dateOutfits?.top?.image }} style={styles.outfitImageSmall} />
          <Image source={{ uri: dateOutfits?.bottom?.image }} style={styles.outfitImageSmall} />
          <Image source={{ uri: dateOutfits?.shoes?.image }} style={styles.outfitImageSmall} />
        </View>
      );
    }
  };

  const handleDayPress = (day) => {
    let outfit = outfits[day.dateString] || {};
    if (Object.keys(outfit).length !== 0) {
      outfit.date = day.dateString;
      setSelectedDayOutfit(outfit);
      setIsModalVisible(true);
    }
  };

  const deleteOutfit = async (date) => {
    setLoading(true);
    await handleDeleteOutfit(date);
    await fetchMonthOutfits();
    setIsModalVisible(false);
    setLoading(false);
  };

  return (
    <GestureHandlerRootView>    
      <SpinnerOverlay isVisible={loading} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {setIsModalVisible(false)}}
      > 
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          activeOpacity={1}
          onPressOut={() => {setIsModalVisible(false)}}
        >
          <TouchableOpacity
            style={styles.modalView}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
              <TouchableOpacity
                style={styles.modal_button}
                onPress={() => setAlertVisible(true)}>
                <Ionicons style={{color: Colors.purple}} name="trash-outline" size={28}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modal_button}
                onPress={() => {setIsModalVisible(false)}}>
                <Ionicons style={{color: Colors.purple}} name="close-outline" size={28}/>
              </TouchableOpacity>
            </View>
            {renderOutfitItem(selectedDayOutfit?.top)}
            {renderOutfitItem(selectedDayOutfit?.bottom)}
            {renderOutfitItem(selectedDayOutfit?.shoes)}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <CustomAlert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        onSubmit={() => {
          deleteOutfit(selectedDayOutfit.date);
          setAlertVisible(false);
        }}
        question="Are you sure you want to delete this outfit?"
      />
      <Calendar 
        onMonthChange={(m) => setYearMonth(m.year.toString() + '-' + (m.month < 10 ? '0' : '') + m.month.toString())}
        theme={{
            'stylesheet.calendar.main': {
                week: {
                    marginTop: 0,
                    marginBottom: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }
            }
        }}
        dayComponent={({ date, state }) => {
          return (
            <TouchableOpacity 
              onPress={() => handleDayPress(date)}
            >
              <View style={styles.dayContainer}>
                {state === 'today' ? (
                  <Text style={styles.todayText}>{date.day}</Text>
                ) : (
                  <Text style={styles.dayText}>{date.day}</Text>
                )}
                {renderOutfitsForDay(date)}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  todayText: {
    marginTop: 1,
    backgroundColor: Colors.light_purple,
    borderRadius: 25,
    paddingHorizontal: 3,
    paddingVertical: 1,
    marginBottom: 1,
    // width: 30
  },
  dayText: {
    marginTop: 2,
  },
  // calendarContainer: {
  //   height: 900,
  // },
  // calendar: {
  //   height: 900,
  // },
  dayContainer: {
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#FFF',
    overflow: 'hidden',
    alignItems: 'center',
    // justifyContent: 'flex-start', 
    //flex: 1,
    marginHorizontal: 1, 
    marginTop: 0,
    marginBottom: 0,
    padding: 0,   
    height: (Dimensions.get('window').height - 190) / 5 , 
    width: (Dimensions.get('window').width - 2) / 7, 
  },
  dateContainer: {
    alignSelf: 'center', 
    marginLeft: 4,
    // marginTop: 2,
  },
  outfitImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  outfitImage: {
    width: 100,
    height: 100,
    marginRight: 2,
    alignSelf: 'center',
    borderRadius: 7,
    marginTop: 2,
  },
  outfitImageSmall: {
    width: 29,
    height: 29,
    marginRight: 2,
    alignSelf: 'center',
    borderRadius: 3,
    // marginTop: 2,
  },
  modalView: {
    margin: 20,
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modal_button: {
    backgroundColor: Colors.light_purple,
    borderRadius: 25,
    padding: 5,
    elevation: 2,
    // marginTop: 15
  },
});

export default OutfitCalendar;