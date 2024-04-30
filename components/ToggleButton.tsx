import { TouchableOpacity, View, Text } from "react-native";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

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
    'dark-red': '#8B0000',
    'dark-yellow': '#9B870C',
    'dark-gray': '#A9A9A9',
    pink: '#FFC0CB',
    'dark-blue': '#00008B',
    gray: '#808080',
    green: '#008000',
    yellow: '#FFFF00',
    red: '#FF0000',
    'light-pink': '#FFB6C1'
};

const ToggleButton = ({ label, isActive, onPress, color="" }) => {
    
    return(
        <TouchableOpacity
        style={[color ?  styles.toggleButtonColor : styles.toggleButton, isActive ? styles.activeButton : styles.inactiveButton]}
        onPress={onPress}>
        {color && 
            <View style={styles.colorButtonContainer}>
            <View style={[styles.colorSquare, { backgroundColor: colorMap[color] }]} />
            <Text style={[styles.toggleButtonText, isActive ? styles.activeText : styles.inactiveText]}>
                {label}
            </Text>
            </View>
        }
        {!color &&  
            <Text style={[styles.toggleButtonText, isActive ? styles.activeText : styles.inactiveText]}>
            {label}
            </Text>
        }
        
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    activeText: {
        color: 'white',
    },
      inactiveText: {
        color: 'black',
    },
    toggleButtonText: {
        fontSize: 16,
        textAlign: 'center',
    },
    colorSquare: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 0.6,
        borderColor: '#222222',
        marginRight: 10,
    },
    toggleButtonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
        toggleButton: {
        paddingVertical: 7,
        paddingHorizontal: 11,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: Colors.grey,
        margin: 5,
    },
        toggleButtonColor: {
        paddingVertical: 7,
        paddingHorizontal: 11,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: Colors.grey,
        marginTop: 5,
        marginBottom: 5
    },
    activeButton: {
        backgroundColor: Colors.purple,
    },
    inactiveButton: {
        backgroundColor: 'white',
    },
    colorButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
export default ToggleButton;