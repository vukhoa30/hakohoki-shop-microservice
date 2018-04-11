import { ADD_TO_CART, REMOVE_FROM_CART, REMOVE_ALL } from "../actions"
import { remove } from 'lodash'

const initialState = {
    list: []
}

function reducer(state = initialState, action) {

    let nextState = state
    const { type, data, productID } = action

    switch (type) {

        case ADD_TO_CART:
            nextState = { list: state.list.concat(data) }
            break
        case REMOVE_FROM_CART:
            nextState = { list: remove(state.list, product => product._id !== productID) }
            break
        case REMOVE_ALL:
            nextState = initialState
            break

    }

    return nextState

}

export default reducer