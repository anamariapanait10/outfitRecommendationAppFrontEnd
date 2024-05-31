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

const ToggleButton = ({ label, isActive, onPress, color="", fixedSize='45%' }) => {
    
    return(
        <TouchableOpacity
        style={[color ?  styles.toggleButtonColor : styles.toggleButton, isActive ? styles.activeButton : styles.inactiveButton, fixedSize != '' ? {width: fixedSize} : null]}
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
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={[{ textAlign: 'center' }, styles.toggleButtonText, isActive ? styles.activeText : styles.inactiveText]}>
                {label}
                </Text>
            </View>
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
        marginRight: 6,
    },
    toggleButtonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    toggleButton: {
        paddingVertical: 7,
        paddingHorizontal: 4,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.grey,
        margin: 2,
    },
    toggleButtonColor: {
        paddingVertical: 4,
        paddingHorizontal: 7,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.grey,
        marginTop: 2,
        marginBottom: 2,
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
    },
});
export default ToggleButton;