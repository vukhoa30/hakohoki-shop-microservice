import { PROMOTION_LOADING, PROMOTION_LOADING_FAILED, PROMOTION_LOADED } from "../actions"
import { remove } from 'lodash'

const initialState = {
    status: 'LOADING',
    list: []
}

function reducer(state = initialState, action) {

    let nextState = state
    const { type, list } = action

    switch (type) {

        case PROMOTION_LOADING:
            nextState = { ...state, status: 'LOADING' }
            break
        case PROMOTION_LOADING_FAILED:
            nextState = { ...state, status: 'LOADING_FAILED' }
            break
        case PROMOTION_LOADED:
            nextState = { ...state, status: 'LOADED', list }
            break

    }

    return nextState

}

export default reducer