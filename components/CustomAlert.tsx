import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

const CustomAlert = ({ visible, onClose, onSubmit, question, button="Yes/No" }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.centeredView}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <TouchableOpacity
          style={styles.modalView}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        > 
          <Text style={{textAlign: 'center'}}>{question}</Text>
          { button === "Yes/No" ? 
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
                <Text style={styles.textStyle}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.buttonDelete]} onPress={onSubmit}>
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
            </View> 
            : button === "Close" ?
              <TouchableOpacity style={[styles.button, styles.buttonClose, {marginTop: 30}]} onPress={onClose}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
              : button === "See calendar/Close" ?
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={[styles.button, styles.buttonDelete, {marginTop: 30}]} onPress={onClose}>
                    <Text style={styles.textStyle}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, styles.buttonClose, {marginTop: 30}]} onPress={onSubmit}>
                    <Text style={styles.textStyle}>See Calendar</Text>
                  </TouchableOpacity>
                </View>
              : null
          }         
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalView: {
    margin: 20,
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10
  },
  buttonClose: {
    backgroundColor: Colors.light_purple,
    paddingLeft: 19,
    paddingRight: 19
  },
  buttonDelete: {
    backgroundColor: Colors.light_grey,
    paddingLeft: 16,
    paddingRight: 16
  },
  textStyle: {
    color: "black",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18
  }
});

export default CustomAlert;
