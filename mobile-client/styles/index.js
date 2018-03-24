import { StyleSheet } from 'react-native'

const appStyles = StyleSheet.create({

    fullButton: {

        marginLeft: 10,
        marginRight: 10

    },

    center: {
        alignSelf: 'center'
    },

    card: {

        backgroundColor: "#eee",
        borderRadius: 2,
        shadowColor: "#000000",
        borderWidth: 0.5,
        borderColor: 'gray',
        shadowOpacity: 0.3,
        shadowRadius: 1,
        shadowOffset: {
            height: 1,
            width: 0.3,
        }

    },

    price: {

        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#0B5353',
        color: 'white',
        marginBottom: 10,
        fontSize: 12,
        width: '70%'

    },

    iconButton: {
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        margin: 10,
        padding: 10,
    },

    iconButtonTheme1: {
        color: 'white',
        backgroundColor: '#EA8B26'
    },

    iconButtonTheme2: {
        color: 'white',
        backgroundColor: '#478E2D'
    },

    input: {
        fontSize: 12
    },

    whiteText: {
        color: 'white'
    },

    button: {
        borderRadius: 0
    },

    background: {
        backgroundColor: '#e9ebee'
    }

})

export default appStyles