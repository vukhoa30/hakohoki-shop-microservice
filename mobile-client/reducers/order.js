import { ORDERS_LOADING, ORDERS_LOAD_FAILED, ORDERS_LOADED } from "../actions"
import { remove } from 'lodash'

const initialState = {
    status: 'INIT',
    list: []
}

function reducer(state = initialState, action) {

    let nextState = state
    const { type, list } = action

    switch (type) {

        case ORDERS_LOADING:
            nextState = { ...state, status: 'LOADING' }
            break
        case ORDERS_LOAD_FAILED:
            nextState = { ...state, status: 'LOADING_FAILED' }
            break
        case ORDERS_LOADED:
            nextState = { ...state, status: 'LOADED', list }
            break

    }

    return nextState

}

export default reducer