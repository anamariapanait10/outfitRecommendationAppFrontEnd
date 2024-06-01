import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, Modal, Switch } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel from 'react-native-snap-carousel';
import { DataStorageSingleton } from '../../../constants/data_storage_singleton';
import { useAuth } from '@clerk/clerk-expo';
import { ClothingItem } from '../../../components/cloth_card';
import Colors from '../../../constants/Colors';
import SpinnerOverlay from '../../../components/spinner_overlay';
import DropDownPicker from 'react-native-dropdown-picker';
import { Calendar } from 'react-native-calendars';
import CustomAlert from '../../../components/CustomAlert';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const OutfitPicker = () => {
    const { isLoaded, userId, getToken } = useAuth();
    const [topwearIndex, setTopwearIndex] = useState(0);
    const [bottomwearIndex, setBottomwearIndex] = useState(0);
    const [footwearIndex, setFootwearIndex] = useState(0);
    const [bodywearIndex, setBodywearIndex] = useState(0);
    const topwearCarouselRef = useRef(null);
    const bottomwearCarouselRef = useRef(null);
    const footwearCarouselRef = useRef(null);
    const bodywearCarouselRef = useRef(null);
    const [topwears, setTopwears] = useState<ClothingItem[]>([]);
    const [bottomwears, setBottomwears] = useState<ClothingItem[]>([]);
    const [footwears, setFootwears] = useState<ClothingItem[]>([]);
    const [bodywears, setBodywears] = useState<ClothingItem[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [expertResponse, setExpertResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState("");
    const [dropdownItems, setDropdownItems] = useState([
      {label: 'Casual', value: 'Casual'},
      {label: 'Ethnic', value: 'Ethnic'},
      {label: 'Formal', value: 'Formal'},
      {label: 'Sports', value: 'Sports'},
      {label: 'Smart Casual', value: 'Smart Casual'},
      {label: 'Party', value: 'Party'}
    ]);
    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [filteredTopwears, setFilteredTopwears] = useState<ClothingItem[]>([]);
    const [filteredBottomwears, setFilteredBottomwears] = useState<ClothingItem[]>([]);
    const [filteredFootwears, setFilteredFootwears] = useState<ClothingItem[]>([]);
    const [filteredBodywears, setFilteredBodywears] = useState<ClothingItem[]>([]);
    const [wearOutfitAlert, setWearOutfitAlert] = useState(false);
    const [isOccasionOpen, setIsOccasionOpen] = useState(false);
    const [isSeasonOpen, setIsSeasonOpen] = useState(false);
    const [isMaterialOpen, setIsMaterialOpen] = useState(false);
    const [isPatternOpen, setIsPatternOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [isOnePieceEnabled, setIsOnePieceEnabled] = useState(false);

    const [occasionValue, setOccasionValue] = useState("");
    const [seasonValue, setSeasonValue] = useState("");
    const [materialValue, setMaterialValue] = useState("");
    const [patternValue, setPatternValue] = useState("");
    const [colorValue, setColorValue] = useState("");
    
    const [occasionItems, setOccasionItems] = useState([
      { label: 'None', value: null },
      { label: 'Casual', value: 'Casual' },
      { label: 'Ethnic', value: 'Ethnic' },
      { label: 'Formal', value: 'Formal' },
      { label: 'Sports', value: 'Sports' },
      { label: 'Smart Casual', value: 'Smart Casual' },
      { label: 'Party', value: 'Party' }
    ]);
    const [seasonItems, setSeasonItems] = useState([
      { label: 'None', value: null },
      { label: 'Spring', value: 'Spring' },
      { label: 'Summer', value: 'Summer' },
      { label: 'Autumn', value: 'Autumn' },
      { label: 'Winter', value: 'Winter' },
    ]);
    const [materialItems, setMaterialItems] = useState([
      { label: 'None', value: null },
      { label: 'Cotton', value: 'Cotton' },
      { label: 'Polyester', value: 'Polyester' },
      { label: 'Wool', value: 'Wool' },
      { label: 'Silk', value: 'Silk' },
      { label: 'Synthetic fibers', value: 'Synthetic fibers' },
      { label: 'Leather', value: 'Leather' },
      { label: 'Linen', value: 'Linen' }
    ]);
    const [patternItems, setPatternItems] = useState([
      { label: 'None', value: null },
      { label: 'Plain', value: 'Plain' },
      { label: 'Striped', value: 'Striped' },
      { label: 'Checkered', value: 'Checkered' },
      { label: 'Floral', value: 'Floral' },
      { label: 'Dotted', value: 'Dotted' },
      { label: 'Animal print', value: 'Animal print' },
      { label: 'Camouflage', value: 'Camouflage' },
      { label: 'Graphic', value: 'Graphic' }
    ]);
    const [colorItems, setColorItems] = useState([
      { label: 'None', value: null },
      { label: 'White', value: 'White' },
      { label: 'Black', value: 'Black' },
      { label: 'Multicolor', value: 'Multicolor' },
      { label: 'Beige', value: 'Beige' },
      { label: 'Light gray', value: 'Light gray' },
      { label: 'Gray', value: 'Gray' },
      { label: 'Dark gray', value: 'Dark gray' },
      { label: 'Yellow', value: 'Yellow' },
      { label: 'Dark yellow', value: 'Dark yellow' },
      { label: 'Light green', value: 'Light green' },
      { label: 'Green', value: 'Green' },
      { label: 'Dark green', value: 'Dark green' },
      { label: 'Turquoise', value: 'Turquoise' },
      { label: 'Orange', value: 'Orange' },
      { label: 'Light blue', value: 'Light blue' },
      { label: 'Blue', value: 'Blue' },
      { label: 'Dark blue', value: 'Dark blue' },
      { label: 'Light pink', value: 'Light pink' },
      { label: 'Pink', value: 'Pink' },
      { label: 'Red', value: 'Red' },
      { label: 'Dark red', value: 'Dark red' },
      { label: 'Brown', value: 'Brown' },
      { label: 'Purple', value: 'Purple' },
    ]);
    const [filters, setFilters] = useState({
      occasion: "",
      season: "",
      material: "",
      pattern: "",
      color: "",
      one_piece: false
    });
    const router = useRouter();

    const fetchClothesData = async () => {
      setLoading(true);
      await DataStorageSingleton.getInstance().fetchClothesData(await getToken(), userId, isLoaded);
      let clothes = DataStorageSingleton.getInstance().clothingItems;
      let topwears = clothes.filter(cloth => cloth["category"] === "Topwear");
      let bottomwears = clothes.filter(cloth => cloth["category"] === "Bottomwear");
      let footwears = clothes.filter(cloth => cloth["category"] === "Footwear");
      let bodywears = clothes.filter(cloth => cloth["category"] === "Bodywear");
      setTopwears(topwears);
      setFilteredTopwears(topwears);
      setBottomwears(bottomwears);
      setFilteredBottomwears(bottomwears);
      setFootwears(footwears);
      setFilteredFootwears(footwears);
      setBodywears(bodywears)
      setFilteredBodywears(bodywears);
      setLoading(false);
    };
    
    useEffect(() => { // apelat cand se deschide pagina
      fetchClothesData();
      setFilteredTopwears(filterClothes(topwears));
      setFilteredBottomwears(filterClothes(bottomwears));
      setFilteredFootwears(filterClothes(footwears));
      setFilteredBodywears(filterClothes(bodywears));
    }, []);

    useEffect(() => { // apelat cand se schimba filtrele
      setFilteredTopwears(filterClothes(topwears));
      setFilteredBottomwears(filterClothes(bottomwears));
      setFilteredFootwears(filterClothes(footwears));
      setFilteredBodywears(filterClothes(bodywears));

      carouselGoToIndex(topwearCarouselRef, Math.floor(filteredTopwears.length / 2));
      carouselGoToIndex(bottomwearCarouselRef, Math.floor(filteredBottomwears.length / 2));
      carouselGoToIndex(footwearCarouselRef, Math.floor(filteredFootwears.length / 2));
      carouselGoToIndex(bodywearCarouselRef, Math.floor(filteredBodywears.length / 2));

    }, [filters]);

    const carouselGoToIndex = (carouselRef, index) => {
      // carouselRef.current.snapToItem(index);
    };

    const openCalendar = () => {
      setIsCalendarVisible(true);
    };
    const handleDateSelect = (day) => {
      setDate(day.dateString);
    };

    const replaceOutfit = async () => {
      let clothes = [];
      if (isOnePieceEnabled) {
        clothes = [bodywears[bodywearIndex], footwears[footwearIndex]];
      } else {
        clothes = [topwears[topwearIndex], bottomwears[bottomwearIndex], footwears[footwearIndex]];
      }
      await DataStorageSingleton.getInstance().deleteOutfit(date, await getToken(), userId, isLoaded);
      DataStorageSingleton.getInstance().wearOutfit(clothes, date, await getToken(), userId, isLoaded);
      setIsConfirmationModalVisible(true);
   }

    const handleSaveOutfit = async () => {
      let clothes = [];
      if (isOnePieceEnabled) {
        clothes = [bodywears[bodywearIndex], footwears[footwearIndex]];
      } else {
        clothes = [topwears[topwearIndex], bottomwears[bottomwearIndex], footwears[footwearIndex]];
      }
      let currentYearMonth = date.split('-').slice(0, 2).join('-');
      await DataStorageSingleton.getInstance().fetchOutfitsForMonth(currentYearMonth, await getToken(), userId, isLoaded);
      let outfits = DataStorageSingleton.getInstance().monthOutfits;
      if (date in outfits){
        setWearOutfitAlert(true);
      } else {
        DataStorageSingleton.getInstance().wearOutfit(clothes, date, await getToken(), userId, isLoaded);
        setIsConfirmationModalVisible(true);
      }
    };

    const renderCarouselItem = ({ item, index }) => {
        return (
            <View style={styles.item}>
            <Image src={item.image} style={styles.image} />
            </View>
        );
    };

    const renderBodywearItem = ({item, index}) => {
      return (
        <View style={styles.item}>
          <Image src={item.image} style={{width: 160, height: 300, marginBottom: 10, borderRadius: 12}} />
        </View>
      );
    }

    const renderFootwearItem = ({item, index}) => {
      return (
        <View style={styles.item}>
          <Image src={item.image} style={{width: 160, height: 160, marginBottom: 10, borderRadius: 12}} />
        </View>
      );
    }

    const renderOutfitItem = (item, bigImage=false) => {
      return (
        <View style={{}}>
          <Image source={{ uri: item?.image }} style={bigImage ? styles.outfitImageBig : styles.outfitImage} />
        </View>
      );
    };

    const askAiExpert = async () => {
      setLoading(true);
      if (isOnePieceEnabled) {
        await DataStorageSingleton.getInstance().askAiExpert(null, null, footwears[footwearIndex], bodywears[bodywearIndex], dropdownValue, await getToken(), userId, isLoaded);
      } else {
        await DataStorageSingleton.getInstance().askAiExpert(topwears[topwearIndex], bottomwears[bottomwearIndex], footwears[footwearIndex], null, dropdownValue, await getToken(), userId, isLoaded);
      }
      setExpertResponse(DataStorageSingleton.getInstance().lastAIExpertResponse);
      setLoading(false);
      setIsModalVisible(true);
    }

    const filterClothes = (clothes) => {
      return clothes.filter(item => {
        return (!filters.occasion || item.occasions.toLowerCase().split(",").includes(filters.occasion.toLowerCase())) &&
          (!filters.season || item.seasons.toLowerCase().includes(filters.season.toLowerCase())) &&
          (!filters.material || item.material.toLowerCase() === filters.material.toLowerCase()) &&
          (!filters.pattern|| item.pattern.toLowerCase() === filters.pattern.toLowerCase()) &&
          (!filters.color || item.color.toLowerCase() === filters.color.toLowerCase());
      });
    };
    const applyFilters = () => {
      setFilters({'occasion': occasionValue, 'season': seasonValue, 'material': materialValue, 'pattern': patternValue, 'color': colorValue, one_piece: isOnePieceEnabled});
      setIsFilterModalVisible(false);
    }
    const resetFilters = () => {
      setFilters({'occasion': '', 'season': '', 'material': '', 'pattern': '', 'color': '', one_piece: false});
      setFilteredTopwears(topwears);
      setFilteredBottomwears(bottomwears);
      setFilteredFootwears(footwears);
      setFilteredBodywears(bodywears);
      setOccasionValue("");
      setSeasonValue("");
      setMaterialValue("");
      setPatternValue("");
      setColorValue("");
      setIsFilterModalVisible(false);
      setIsOnePieceEnabled(false);
    }

    return (
      <View style={{height: '100%'}}>  
        <View style={styles.mainContainer}>
          <SpinnerOverlay isVisible={loading} />
          <GestureHandlerRootView>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => {setIsModalVisible(false)}}
            > 
              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={styles.modalView}>
                  <Text style={{fontSize: 25}}>AI Expert's Decision:</Text>
                  {isOnePieceEnabled ? (
                    <>
                      {renderOutfitItem(bodywears[bodywearIndex], true)}
                      {renderOutfitItem(footwears[footwearIndex])}
                    </>
                  ) : (
                    <>
                      {renderOutfitItem(topwears[topwearIndex])}
                      {renderOutfitItem(bottomwears[bottomwearIndex])}
                      {renderOutfitItem(footwears[footwearIndex])}
                    </>
                  )}
                  <Text style={{fontSize: 16, textAlign: 'center', backgroundColor: Colors.light_purple, borderRadius: 15, padding: 5, margin: 5}}>
                    {expertResponse.decision == 'yes' ? 'The outfit looks great!' : 'This outfit is not the best, maybe try another one.'}
                  </Text>
                  <Text>
                    {expertResponse.reason}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {setIsModalVisible(false)}}
                  >
                    <Text>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isCalendarVisible}
            > 
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                activeOpacity={1}
                onPressOut={() => {setIsCalendarVisible(false)}}
              >
                <View style={styles.calendarView}>
                  <Calendar
                    onDayPress={handleDateSelect}
                    markedDates={{ [date]: { selected: true, marked: true, selectedColor: Colors.light_purple } }}
                  />
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <TouchableOpacity style={{backgroundColor: Colors.cancel_btn, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 20}} onPress={() => setIsCalendarVisible(false)}>
                      <Text style={{color: 'black'}}>Close</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: Colors.light_purple, paddingVertical: 10, paddingHorizontal: 17, borderRadius: 20}} onPress={() => {handleSaveOutfit(); setIsCalendarVisible(false);}}>
                      <Text style={{color: 'black'}}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={isFilterModalVisible}
              onRequestClose={() => {setIsFilterModalVisible(false)}}
            >
              <TouchableOpacity
                style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}
                activeOpacity={1}
                onPressOut={() => {setIsFilterModalVisible(false)}}
              >
                <View style={[styles.filterView, {width: '80%'}]}>
                  <Text style={{ fontSize: 21, paddingBottom: 15, alignSelf: 'center' }}>Filter Clothes</Text>

                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10}}>
                    <Text style={{width: '80%', marginLeft: 10, fontSize: 16, color: 'black',}}>Enable One-piece Clothing</Text>
                    <Switch
                      value={isOnePieceEnabled}
                      onValueChange={() => setIsOnePieceEnabled(previousState => !previousState)}
                      trackColor={{false: '#767577', true: Colors.purple}}
                      thumbColor={isOnePieceEnabled ? Colors.light_purple : '#f4f3f4'}
                    />
                  </View>

                  <View style={styles.filterRow}>
                    <Text style={styles.label}>Style</Text>
                    <DropDownPicker
                      open={isOccasionOpen}
                      value={occasionValue}
                      items={occasionItems}
                      setOpen={setIsOccasionOpen}
                      setValue={setOccasionValue}
                      setItems={setOccasionItems}
                      placeholder="Select Style"
                      zIndex={3000}
                      zIndexInverse={1000}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                    />
                  </View>

                  <View style={styles.filterRow}>
                    <Text style={styles.label}>Season</Text>
                    <DropDownPicker
                      open={isSeasonOpen}
                      value={seasonValue}
                      items={seasonItems}
                      setOpen={setIsSeasonOpen}
                      setValue={setSeasonValue}
                      setItems={setSeasonItems}
                      placeholder="Select Season"
                      zIndex={2500}
                      zIndexInverse={1000}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                    />
                  </View>

                  <View style={styles.filterRow}>
                    <Text style={styles.label}>Material</Text>
                    <DropDownPicker
                      open={isMaterialOpen}
                      value={materialValue}
                      items={materialItems}
                      setOpen={setIsMaterialOpen}
                      setValue={setMaterialValue}
                      setItems={setMaterialItems}
                      placeholder="Select Material"
                      zIndex={2000}
                      zIndexInverse={1000}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                    />
                  </View>

                  <View style={styles.filterRow}>
                    <Text style={styles.label}>Pattern</Text>
                    <DropDownPicker
                      open={isPatternOpen}
                      value={patternValue}
                      items={patternItems}
                      setOpen={setIsPatternOpen}
                      setValue={setPatternValue}
                      setItems={setPatternItems}
                      placeholder="Select Pattern"
                      zIndex={1500}
                      zIndexInverse={1000}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                    />
                  </View>

                  <View style={styles.filterRow}>
                    <Text style={styles.label}>Color</Text>
                    <DropDownPicker
                      open={isColorOpen}
                      value={colorValue}
                      items={colorItems}
                      setOpen={setIsColorOpen}
                      setValue={setColorValue}
                      setItems={setColorItems}
                      placeholder="Select Color"
                      zIndex={1000}
                      zIndexInverse={1000}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                    />
                  </View>

                  <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20}}>
                    <TouchableOpacity style={{backgroundColor: Colors.light_grey, paddingVertical: 10, paddingHorizontal: 10, borderRadius: 20}} onPress={resetFilters}>
                      <Text style={{color: 'black'}}>Reset Filters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: Colors.light_purple, paddingVertical: 10, paddingHorizontal: 17, borderRadius: 20}} onPress={applyFilters}>
                      <Text style={{color: 'black'}}>    Apply    </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
            <CustomAlert
                visible={isConfirmationModalVisible}
                onClose={() => setIsConfirmationModalVisible(false)}
                onSubmit={() => {setIsConfirmationModalVisible(false); router.replace('/(auth)/home/calendar');}}
                question="Outfit successfully scheduled!"
                button="See calendar/Close"
              />
          </GestureHandlerRootView>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '50%', marginLeft: 5}}>
              <DropDownPicker
                open={isDropdownOpen}
                value={dropdownValue}
                items={dropdownItems}
                setOpen={setDropdownOpen}
                setValue={setDropdownValue}
                setItems={setDropdownItems}
                placeholder="Select a style"
                zIndex={3000}
                zIndexInverse={1000}
                style={{ 
                  borderColor: '#bdbdbd'
                }}
                textStyle={{
                  // color: '#bdbdbd'
                }}
                dropDownContainerStyle={{
                  borderColor: '#cccccc'
                }}
                placeholderStyle={{
                  color: '#888'
                }}
              />
            </View>
            <TouchableOpacity style={{ backgroundColor: Colors.purple, width: '45%', height:50, padding:15, paddingLeft: 29, borderRadius: 5, marginRight: 5}} onPress={askAiExpert}>
              <Text style={styles.buttonText}>Ask the AI Expert</Text>
            </TouchableOpacity>
          </View>
          <CustomAlert
              visible={wearOutfitAlert}
              onClose={() => setWearOutfitAlert(false)}
              onSubmit={() => {
                replaceOutfit();
                setWearOutfitAlert(false);
              }}
              question="An outfit is already scheduled for this date. Proceeding will overwrite it. Do you want to continue?"
              button="Yes/No"
            />
          {!loading && <View style={styles.outfitContainer}>
            {isOnePieceEnabled ? (
              <>
                {filteredBodywears.length > 0 ? (
                  <Carousel
                    data={filteredBodywears}
                    layout={"default"}
                    ref={bodywearCarouselRef}
                    renderItem={renderBodywearItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={filteredBodywears.length == 1 ? Dimensions.get('window').width : 150}
                    firstItem={Math.floor(filteredBodywears.length / 2)}
                    onSnapToItem={(index) => setBodywearIndex(index)}
                    inactiveSlideScale={0.6}
                    inactiveSlideOpacity={0.4}
                    inactiveSlideShift={20}
                  />
                ) : (
                  <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 150 }}>
                    <Text style={{ textAlign: 'center', height: 150, width: 150 }}> Not enough bodywears that match the filters</Text>
                  </View>
                )}
                {filteredFootwears.length > 0 ? (
                  <Carousel
                    data={filteredFootwears}
                    layout={"default"}
                    ref={footwearCarouselRef}
                    renderItem={renderFootwearItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={filteredFootwears.length == 1 ? Dimensions.get('window').width : 150}
                    firstItem={Math.floor(filteredFootwears.length / 2)}
                    onSnapToItem={(index) => setFootwearIndex(index)}
                    inactiveSlideScale={0.6}
                    inactiveSlideOpacity={0.4}
                    inactiveSlideShift={20}
                  />
                ) : (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', height: 200, width: 150 }}> Not enough footwears that match the filters</Text>
                  </View>
                )}
              </>
            ) : (
              <>
                {filteredTopwears.length > 0 ? (
                  <Carousel
                    data={filteredTopwears}
                    layout={"default"}
                    ref={topwearCarouselRef}
                    renderItem={renderCarouselItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={filteredTopwears.length == 1 ? Dimensions.get('window').width : 150}
                    firstItem={Math.floor(filteredTopwears.length / 2)}
                    onSnapToItem={(index) => setTopwearIndex(index)}
                    inactiveSlideScale={0.6}
                    inactiveSlideOpacity={0.4}
                    inactiveSlideShift={20}
                  />
                ) : (
                  <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <Text style={{ textAlign: 'center', height: 150, width: 150 }}> Not enough topwears that match the filters</Text>
                  </View>
                )}
                {filteredBottomwears.length > 0 ? (
                  <Carousel
                    data={filteredBottomwears}
                    layout={"default"}
                    ref={bottomwearCarouselRef}
                    renderItem={renderCarouselItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={filteredBottomwears.length == 1 ? Dimensions.get('window').width : 150}
                    firstItem={Math.floor(filteredBottomwears.length / 2)}
                    onSnapToItem={(index) => setBottomwearIndex(index)}
                    inactiveSlideScale={0.6}
                    inactiveSlideOpacity={0.4}
                    inactiveSlideShift={20}
                  />
                ) : (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', height: 150, width: 150 }}> Not enough bottomwears that match the filters</Text>
                  </View>
                )}
                {filteredFootwears.length > 0 ? (
                  <Carousel
                    data={filteredFootwears}
                    layout={"default"}
                    ref={footwearCarouselRef}
                    renderItem={renderCarouselItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={filteredFootwears.length == 1 ? Dimensions.get('window').width : 150}
                    firstItem={Math.floor(filteredFootwears.length / 2)}
                    onSnapToItem={(index) => setFootwearIndex(index)}
                    inactiveSlideScale={0.6}
                    inactiveSlideOpacity={0.4}
                    inactiveSlideShift={20}
                  />
                ) : (
                  <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                    <Text style={{ textAlign: 'center', height: 200, width: 150 }}> Not enough footwears that match the filters</Text>
                  </View>
                )}
              </>
            )}
          </View>}
        </View>
        <View style={{ position: 'absolute', bottom: 20, left: 20 }}>
          <TouchableOpacity style={styles.filerButton} onPress={() => { setIsFilterModalVisible(true) }}>
            <MaterialIcons name="tune" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
          <TouchableOpacity style={styles.button} onPress={openCalendar}>
            <Text style={styles.buttonText}>Save Outfit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
      // width: '100%',
      // height: '100%',
      paddingTop: 10,
      // flex: 1,
      // flexDirection: 'column'
      // alignItems: 'center'
    },
    outfitContainer: {
      // flex: 1,
      // paddingTop: 20,
      marginTop: 40,
      marginBottom: 30,
      // alignItems: 'center'
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    categoryLabel: {
      fontSize: 18,
      marginTop: 20,
    },
    item: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    image: {
      width: 150,
      height: 150,
      marginBottom: 10,
      borderRadius: 12
    },
    button: {
      padding: 10,
      backgroundColor: Colors.purple,
      borderRadius: 5,
    },
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    filerButton: {
      padding: 10,
      backgroundColor: Colors.purple,
      borderRadius: 25,
      margin: 5,
      marginBottom: 0,
    },
    buttonText: {
      color: '#fff',
    },
    calendarView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    filterView: {
      // margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      paddingRight: 10,
      paddingTop: 10,
      paddingLeft: 10,
      paddingBottom: 15,
      // alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalView: {
      margin: 20,
      // height: Dimensions.get('window').height - 200,
      backgroundColor: "white",
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 30,
      alignItems: "center",
      justifyContent: "space-between",
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
    outfitImage: {
      width: 90,
      height: 90,
      borderRadius: 7,
      alignSelf: 'center',
    },
    outfitImageBig: {
      width: 90,
      height: 180,
      borderRadius: 7,
      alignSelf: 'center',
    },
    dropdown: {
      width: '60%',
      borderColor: '#bdbdbd',
    },
    dropdownContainer: {
      borderColor: '#cccccc',
      width: '60%',
      zIndex: 5000
    },
    label: {
      width: '30%',
      marginHorizontal: 10,
      fontSize: 16,
      color: 'black',
    },
  });
  

export default OutfitPicker;
