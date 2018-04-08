import { WATCH_LIST_LOADING } from "../../presenters/keys";

const initialState = {
    status: 'INIT',
    list: [],
    needToUpdate: false
}

function reducer(state = initialState, action) {

    let nextState = state
    const { type, status, data } = action

    switch (type) {

        case WATCH_LIST_LOADING:
            if (status === 'LOADED')
                nextState = { ...state, status, list: state.list.concat(data) }
            else
                nextState = { ...state, status }
            break

    }

    return nextState

}

export default reducer