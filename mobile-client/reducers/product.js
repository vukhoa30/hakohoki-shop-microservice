import {
    SELECT_CATEGORY,
    SELECT_PRODUCT,
    PRODUCT_DATA_LOADING,
    PRODUCT_DATA_LOADED,
    PRODUCT_DATA_LOADING_FAILED,
    PRODUCT_DATA_UPDATE_WATCH_LIST_STATE,
    REVIEW_PRODUCT
}
    from "../actions";


const initialState = {

    category: null,
    productId: null,
    status: 'LOADING',
    data: null

}

function reducer(state = initialState, action) {

    let nextState = state
    const { type, data, existsInWatchlist, productId, category } = action

    switch (type) {

        case SELECT_CATEGORY:
            nextState = { ...initialState, category }
            break
        case SELECT_PRODUCT:
            nextState = { ...initialState, productId }
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
            nextState = { ...state, data: { ...state.data, existsInWatchlist } }
            break
        case REVIEW_PRODUCT:
            nextState = { ...state, status: 'LOADED', data: { ...state.data, reviewedBySelf: true } }
            break

    }

    return nextState

}

export default reducer