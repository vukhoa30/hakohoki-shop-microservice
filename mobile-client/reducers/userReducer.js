import { USER_LOG_IN, USER_LOG_OUT } from '../actions'
import { AsyncStorage } from 'react-native'
const initialState = {
    isLoggedIn: false,
    token: null
}

const userReducer = (state = initialState, action) => {
    let nextState = null
    switch (action.type) {

        case USER_LOG_IN:
            nextState = { ...state, isLoggedIn: true, token: action.token }
            if (action.token) {
                AsyncStorage.setItem('@User:token', action.token)
            }
            break
        case USER_LOG_OUT:
            nextState = { ...state, isLoggedIn: false, token: null }
            AsyncStorage.removeItem('@User:token')
            break

    }

    return nextState || state;
};

export default userReducer