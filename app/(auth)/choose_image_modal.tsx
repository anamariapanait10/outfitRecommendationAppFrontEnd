import React, { useState } from "react";
import { Modal, Pressable, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import styles from "../styles";
import Colors from "../../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";



const ChooseImageModal = ({modalVisible, onBackPress, onCameraPress, onGalleryPress, isLoading = false}) => {
    
    return (
        <Modal animationType="slide" visible={modalVisible} transparent={true} >
            <Pressable style={styles.container} onPress={onBackPress}>
                {isLoading && <ActivityIndicator size={70} color={'green'}/>}
                {!isLoading && 
                    <View style={[styles.modalView, {backgroundColor: '#EEE'}]}>
                        <Text style={{marginBottom: 10}}>Add Item</Text>
                        <View style={styles.decisionRow}>
                            <TouchableOpacity onPress={onCameraPress} style={styles.optionButton}>
                                <MaterialCommunityIcons name="camera-outline" size={30} color="black" />
                                <Text>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onGalleryPress} style={styles.optionButton}>
                                <MaterialCommunityIcons name="image-outline" size={30} color="black" />
                                <Text>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}
            </Pressable>
        </Modal>
    );

}

export default ChooseImageModal;