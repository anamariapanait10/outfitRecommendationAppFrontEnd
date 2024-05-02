import {View, StyleSheet, Text, Dimensions} from 'react-native';
import Colors from "../constants/Colors";

const SliderMarks = ({ minimumValue, maximumValue, step, style }) => {
    const numberOfMarks = (maximumValue - minimumValue) / step;
    const markWidth = 100 / numberOfMarks; 

    console.log("Minimum Value: ", minimumValue);
    console.log("Maximum Value: ", maximumValue);
    console.log("Step: ", step);
    console.log("Number of Marks: ", numberOfMarks);
    console.log("Mark Width: ", markWidth);
    return (
      <View style={[styles.markContainer, style]}>
        {Array.from({ length: numberOfMarks + 3 }, (_, index) => (
          <View key={index} style={styles.mark}>
            <Text style={styles.markText}>{minimumValue + index * step}</Text>
          </View>
        ))}
      </View>
    );
  };
  
const styles = StyleSheet.create({
    markContainer: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
        borderColor: Colors.purple,
        borderRadius: 10,
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
    }
});

export default SliderMarks;