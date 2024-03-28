import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const SpinnerOverlay = ({ isVisible }) => {
  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={isVisible}
      onRequestClose={() => {
        console.log('Modal has been closed.');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" animating={isVisible} color={'#000040'}/>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF60',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF00',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default SpinnerOverlay;
