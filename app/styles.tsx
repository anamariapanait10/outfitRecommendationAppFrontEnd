import { Dimensions, StyleSheet } from 'react-native';

const cardMargin = 3;
const cardPadding = 2;

export default StyleSheet.create({
    container: {
        width: '100%'
        // add your styles here
    },
    card: {
        backgroundColor: '#FFF',
        borderColor: '#DDD',
        borderRadius: 4,
        borderWidth: 0.5,
        margin: cardMargin,
        padding: cardPadding,
        justifyContent: 'center',
        alignItems: 'center',
        width: (Dimensions.get('window').width - cardMargin * 6) / 3,
    },
    image: {
        width: '80%',
        margin: 4,
        borderRadius: 10,
        height: 100,
    },
    title: {
        fontSize: 16,
        color: '#6c47ff',
        width: '100%',
    },
    filterBar: {

    },
    decisionRow: {
    
    },
    optionButton: {
    
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      buttonOpen: {
        backgroundColor: '#F194FF',
      },
      buttonClose: {
        backgroundColor: '#2196F3',
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
      details_container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 20,
      },
      details_image: {
        width: 300,
        height: 300,
        borderRadius: 20,
      },
      detailsContainer: {
        marginTop: 20,
      },
      detailText: {
        fontSize: 16,
        marginBottom: 10,
      },
      detailLabel: {
        fontWeight: 'bold',
        color: '#6c47ff',
      },
      deleteIconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10, 
      },
});