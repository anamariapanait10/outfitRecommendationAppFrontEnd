import {View, StyleSheet, Text, Dimensions} from 'react-native';
import Colors from "../constants/Colors";

const SliderMarks = ({ minimumValue, maximumValue, step, style }) => {
    const numberOfMarks = (maximumValue - minimumValue) / step;

    return (
      <View style={[styles.markContainer, style]}>
        {Array.from({ length: numberOfMarks + 1 }, (_, index) => (
          index !== 0 && index !== numberOfMarks ? (
            <View key={index} style={styles.mark} />
          ) : null
        ))}
      </View>
    );
  };
  
const styles = StyleSheet.create({
    markContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingHorizontal: 20,
        marginTop: 20,
        borderColor: Colors.purple,
        borderRadius: 7,
        borderWidth: 1,
    },
    mark: {
        width: 1,
        height: 10,
        backgroundColor: '#333',
    },
    markText: {
        fontSize: 10,
        textAlign: 'center',
        marginTop: 2,
        color: '#333',
    }
});

export default SliderMarks;