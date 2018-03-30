import { SAVE_TO_BUFFER } from "../../presenters/state-modifiers/keys";

const initialState = {

    data: null

}

function reducer(state = initialState, action) {

    let nextState = state
    const { type, data } = action

    switch (type) {

        case SAVE_TO_BUFFER:
            nextState = { data }
            break

    }

    return nextState

}

export default reducer