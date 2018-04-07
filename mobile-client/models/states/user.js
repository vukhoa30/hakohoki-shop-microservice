import { USER_LOG_IN, USER_LOG_OUT } from "../../presenters/keys";

const initialState = {
    isLoggedIn: false,
    fullName: null,
    token: null,
    email: null,
    phoneNumber: null
}

function reducer(state = initialState, action) {

    let nextState = state
    const { token, email, type, fullName, phoneNumber } = action

    switch (type) {

        case USER_LOG_IN:
            nextState = { ...state, isLoggedIn: true, email, token, fullName, phoneNumber }
            break
        case USER_LOG_OUT:
            nextState = initialState
            break

    }

    return nextState

}

export default reducer