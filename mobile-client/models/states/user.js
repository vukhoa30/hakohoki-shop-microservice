import { USER_LOG_IN, USER_LOG_OUT } from "../../presenters/state-modifiers/keys";

const initialState = {
    isLoggedIn: false,
    token: null,
    email: null,
}

function reducer(state = initialState, action) {

    let nextState = state
    const { token, email, type } = action

    switch (type) {

        case USER_LOG_IN:
            nextState = { ...state, isLoggedIn: true, email, token }
            break
        case USER_LOG_OUT:
            nextState = initialState
            break

    }

    return nextState

}

export default reducer