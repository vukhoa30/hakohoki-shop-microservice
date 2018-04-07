import {
    SELECT_PRODUCT,
    PRODUCT_DATA_LOADING,
    PRODUCT_DATA_LOADED,
    PRODUCT_DATA_LOADING_FAILED,
    PRODUCT_DATA_UPDATING_WATCH_LIST_STATE,
    PRODUCT_DATA_UPDATE_WATCH_LIST_STATE
}
    from "../../presenters/keys";


const initialState = {

    productId: null,
    status: 'LOADING',
    data: null

}

function reducer(state = initialState, action) {

    let nextState = state
    const { type, data, existInWatchList, productId } = action

    switch (type) {

        case SELECT_PRODUCT:
            nextState = { ...initialState, productId  }
            break
        case PRODUCT_DATA_LOADING:
            nextState = { ...state, status: 'LOADING' }
            break
        case PRODUCT_DATA_LOADING_FAILED:
            nextState = { ...state, status: 'LOADING_FAILED' }
            break
        case PRODUCT_DATA_LOADED:
            nextState = { ...state, status: 'LOADED', data }
            break
        case PRODUCT_DATA_UPDATE_WATCH_LIST_STATE:
            nextState = { ...state, status: 'WATCH_LIST_UPDATING' }
            break
        case PRODUCT_DATA_UPDATE_WATCH_LIST_STATE:
            nextState = { ...state, status: 'LOADED', data: { ...state.data, existInWatchList } }
            break

    }

    return nextState

}

export default reducer