import { SAVE_EMAIL_TO_CACHE, USER_LOG_IN } from '../actions'
const initialState = {
    email: null
}

const cacheReducer = (state = initialState, action) => {
    let nextState = null
    switch (action.type) {

        case SAVE_EMAIL_TO_CACHE: 
            nextState = { ...state, email: action.email }
            break
        case USER_LOG_IN:
            nextState = { ...state, email: null }
            break

    }

    return nextState || state;
};

export default cacheReducer