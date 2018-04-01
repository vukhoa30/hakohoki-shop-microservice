import { USER_LOG_IN, USER_LOG_OUT } from "../../presenters/state-modifiers/keys";

const initialState = {
    isLoggedIn: false,
    fullName: null,
    token: null,
    email: null,
}

function reducer(state = initialState, action) {

    let nextState = state
    const { token, email, type, fullName } = action

    switch (type) {

        case USER_LOG_IN:
            nextState = { ...state, isLoggedIn: true, email, token, fullName }
            break
        case USER_LOG_OUT:
            nextState = initialState
            break

    }

    return nextState

}

export default reducer