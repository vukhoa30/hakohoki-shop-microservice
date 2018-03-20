import { actionType } from '../actions/userActions'

const initialState = {
    isLoggedIn: false,
    msg: null
}

const userReducer = (state = initialState, action) => {
    const nextState = null

    switch (action.type) {

        case actionType.USER_AUTHENTICATING:
            break
        case actionType.USER_FINISH_AUTHENTICATING:
            break
        case actionType.USER_LOG_OUT:
            break

    }

    return nextState || state;
};

export default userReducer