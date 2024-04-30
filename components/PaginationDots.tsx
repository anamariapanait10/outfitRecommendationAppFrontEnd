import { View, StyleSheet } from 'react-native';

const PaginationDots = ({ activeIndex, itemCount }) => {
    return (
        <View style={styles.paginationContainer}>
            {Array.from({ length: itemCount }, (_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        { backgroundColor: index === activeIndex ? 'grey' : 'lightgray' }
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 10,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 5,
        marginHorizontal: 4,
    },
});

export default PaginationDots;
