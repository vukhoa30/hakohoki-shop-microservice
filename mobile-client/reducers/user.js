import { USER_LOG_IN, USER_LOG_OUT } from "../actions";

const initialState = {
    isLoggedIn: false,
    token: null,
    account: {
        name: 'Unknown',
        email: 'Unknown',
        phoneNumber: 'Unknown'
    }
}

function reducer(state = initialState, action) {

    let nextState = state
    const { type, token, account } = action

    switch (type) {

        case USER_LOG_IN:
            nextState = { ...state, isLoggedIn: true, token, account }
            break
        case USER_LOG_OUT:
            nextState = initialState
            break

    }

    return nextState

}

export default reducer