import {
    SELECT_PRODUCT,
    PRODUCT_LIST_LOADING,
    PRODUCT_DETAIL_LOADING,
    WATCH_LIST_STATUS_FETCHING
}
    from "../../presenters/keys";


const initialState = {

    list: {
        status: 'INIT',
        data: [],
        conditions: null
    },
    current: {
        id: null,
        status: 'INIT',
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

    const { type, status, data, isAddedToWatchList, isFetching } = action

    switch (type) {

        case PRODUCT_LIST_LOADING:
            nextState = { ...state, list: getProductList(action, state.list) }
            break
        case SELECT_PRODUCT:
            nextState = { ...state, current: { ...initialState.current, id: action.productID, status: 'INIT' } }
            break
        case PRODUCT_DETAIL_LOADING:
            nextState = { ...state, current: { ...state.current, status, data } }
            break
        case WATCH_LIST_STATUS_FETCHING:
            nextState = { ...state, current: { ...state.current, status:  isFetching ? 'WATCH_LIST_STATUS_FETCHING' : 'LOADED' } }
     
    }


    return nextState

}

export default reducer