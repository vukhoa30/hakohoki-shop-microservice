import {
    SELECT_PRODUCT,
    PRODUCT_LIST_LOADING,
    PRODUCT_DETAIL_LOADING,
}
    from "../../presenters/keys";


const initialState = {

    list: {
        status: 'LOADING',
        data: [],
        conditions: null
    },
    current: {
        id: null,
        status: 'LOADING',
        data: null
    }
}

function getProductList(action, oldData) {

    const { status, data, conditions, firstLoad } = action

    switch (status) {
        case 'LOADING':
            return firstLoad ? { ...oldData, status, data: [] } : { ...oldData, status }
        case 'LOADING_FAILED':
            return { ...oldData, status }
        default:
            return { status, conditions, data: oldData.data.concat(data) }
    }

}

function reducer(state = initialState, action) {

    let nextState = state

    const { type, status, data } = action

    switch (type) {

        case PRODUCT_LIST_LOADING:
            nextState = { ...state, list: getProductList(action, state.list) }
            break
        case SELECT_PRODUCT:
            nextState = { ...state, current: { ...initialState.current, id: action.productID } }
            break
        case PRODUCT_DETAIL_LOADING:
            nextState = { ...state, current: { ...state.current, status, data } }
            break
    }


    return nextState

}

export default reducer