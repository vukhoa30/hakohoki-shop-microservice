import { USER_LOG_IN, getAction } from './index'
import { AsyncStorage } from 'react-native'

function checkUserSession() {

    return async (dispatch) => {

        try {
            const token = await AsyncStorage.getItem('@User:token');
            if (token !== null) {
                dispatch(getAction(USER_LOG_IN))
            }
        } catch (error) {
            // Error retrieving data
        }
    }

}

module.exports = {
    checkUserSession
}