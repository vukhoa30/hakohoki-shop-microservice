import { USER_LOG_IN, USER_LOG_OUT } from '../actions'
const initialState = {
    isLoggedIn: false,
    token: null
}

const userReducer = (state = initialState, action) => {
    let nextState = null
    switch (action.type) {

        case USER_LOG_IN:
            nextState = { ...state, isLoggedIn: true, token: action.token }
            break
        case USER_LOG_OUT:
            nextState = { ...state, isLoggedIn: false, token: null }
            break

    }

    return nextState || state;
};

export default userReducer