import {
    USER_LOG_IN,
    LOADING_NEWEST_PRODUCTS,
    LOADING_NEWEST_PRODUCTS_SUCCEEDED,
    LOADING_NEWEST_PRODUCTS_FAILED,

    getAction

} from './action-config'
import { request } from '../utils'
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

function loadNewestProducts() {

    return async (dispatch) => {

        dispatch(getAction(LOADING_NEWEST_PRODUCTS))
        try {

            const response = await request('/products/latest', 'GET')
            switch (response.status) {

                case 500:
                    return dispatch(getAction(LOADING_NEWEST_PRODUCTS_FAILED))
                default:
                    dispatch(getAction(LOADING_NEWEST_PRODUCTS_SUCCEEDED, response.data))

            }

        } catch (error) {
            console.log(error)
            dispatch(getAction(LOADING_NEWEST_PRODUCTS_FAILED))
        }
    }

}

module.exports = {
    checkUserSession,
    loadNewestProducts
}