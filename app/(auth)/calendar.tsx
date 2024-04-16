import React, {useEffect, useState} from 'react';
import { Dimensions, View, Text, Image, StyleSheet, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Colors from '../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataStorageSingleton } from './data_storage_singleton';
import { useAuth } from '@clerk/clerk-expo';

const OutfitCalendar = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDayOutfits, setSelectedDayOutfits] = useState({top: null, bottom: null, shoes: null});

  const [outfits, setOutfits] = useState({});
  const [yearMonth, setYearMonth] = useState("2024-04");

  const fetchMonthOutfits = async () => {
    await DataStorageSingleton.getInstance().fetchOutfitsForMonth(yearMonth, await getToken(), userId, isLoaded);
    setOutfits(DataStorageSingleton.getInstance().monthOutfits);
  }

  useEffect(() => {
    fetchMonthOutfits();
  }, []);

  useEffect(() => {
    fetchMonthOutfits();
  }, [yearMonth]);

  const renderOutfitItem = (item) => {
    return (
      <View style={styles.outfitItem}>
        <Image source={{ uri: item?.image }} style={styles.outfitImage} />
      </View>
    );
  };

  const renderOutfitsForDay = (day) => {
    const dateOutfits = outfits[day.dateString] || [];
    
    if(dateOutfits) {
      return (
        <View style={styles.outfitItem}>
          <Image source={{ uri: dateOutfits?.top?.image }} style={styles.outfitImageSmall} />
          <Image source={{ uri: dateOutfits?.bottom?.image }} style={styles.outfitImageSmall} />
          <Image source={{ uri: dateOutfits?.shoes?.image }} style={styles.outfitImageSmall} />
        </View>
      );
    }
  };

  const handleDayLongPress = (day) => {
    console.log("Handle press: ", day);
    setSelectedDayOutfits(outfits[day.dateString] || []);
    setIsModalVisible(true);
  };

  return (
    <GestureHandlerRootView style={styles.calendarContainer}>    
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {setIsModalVisible(false)}}
      > 
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View style={styles.modalView}>
            {renderOutfitItem(selectedDayOutfits?.top)}
            {renderOutfitItem(selectedDayOutfits?.bottom)}
            {renderOutfitItem(selectedDayOutfits?.shoes)}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {setIsModalVisible(false)}}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </Modal>
      <Calendar style={styles.calendar} onMonthChange={(m) => setYearMonth(m.year.toString() + '-' + (m.month < 10 ? '0' : '') + m.month.toString())}
        dayComponent={({ date, state }) => {
          return (
            <View style={styles.dayContainer}>
              {state === 'today' ? (
                <TouchableOpacity onPress={() => handleDayLongPress(date)}>
                  <Text style={styles.todayText}>{date.day}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleDayLongPress(date)}>
                  <Text style={styles.dayText}>{date.day}</Text>
                </TouchableOpacity>
              )}
              {renderOutfitsForDay(date)}
            </View>
          );
        }}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  todayText: {
    marginTop: 2,
    backgroundColor: Colors.light_purple,
    borderRadius: 25,
    padding: 5,
    width: 30
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
    // flex: 1,
    // margin: 0,
    padding: 0,
    marginLeft: 1,
    marginRight: 1,
    height: 100, 
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
    width: 40,
    height: 65,
    marginRight: 2,
    alignSelf: 'center',
    // marginTop: 2,
  },
  outfitImageSmall: {
    width: 20,
    height: 20,
    marginRight: 2,
    alignSelf: 'center',
    // marginTop: 2,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    backgroundColor: Colors.light_purple,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15
  },
});

export default OutfitCalendar;