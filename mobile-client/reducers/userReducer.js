import { USER_LOG_IN, USER_LOG_OUT } from '../actions'
import { AsyncStorage } from 'react-native'

const initialState = {
    isLoggedIn: false
}

const userReducer = (state = initialState, action) => {
    let nextState = null
    switch (action.type) {

        case USER_LOG_IN:
            nextState = { ...state, isLoggedIn: true }
            const token = action.token
            if (token) {
                AsyncStorage.setItem('@User:token', token, error => console.log(error))
            }
            break
        case USER_LOG_OUT:
            nextState = { ...state, isLoggedIn: false }
            AsyncStorage.removeItem('@User:token', error => console.log(error))
            break

    }

    return nextState || state;
};

export default userReducer