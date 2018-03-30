import {
    NEWEST_PRODUCT_STATE_CHANGE,
    CATEGORIES_STATE_CHANGE,
    PRODUCT_LIST_STATE_CHANGE,
    PRODUCT_DETAIL_SET_ID,
    PRODUCT_INFORMATION_STATE_CHANGE,
    PRODUCT_REVIEWS_AND_COMMENTS_STATE_CHANGE,
}
    from "../../presenters/state-modifiers/keys";

const initialState = {

    newestList: getListState('LOADING'),
    categories: getListState('LOADING'),
    productList: getListState('LOADING'),
    productDetail: {
        productID: null,
        information: {
            status: 'LOADING',
            data: null
        },
        reviewsAndComments: {
            status: 'LOADING',
            reviews: [],
            comments: []
        }
    },
}

function getListState(status, data) {

    const obj = { status, data: [] }
    if (data)
        obj.data = data
    return obj

}

function reducer(state = initialState, action) {

    let nextState = state
    const { type, status, data, reviews, comments } = action

    switch (type) {

        case NEWEST_PRODUCT_STATE_CHANGE:
            nextState = { ...state, newestList: getListState(status, data) }
            break
        case CATEGORIES_STATE_CHANGE:
            nextState = { ...state, categories: getListState(status, data) }
            break
        case PRODUCT_LIST_STATE_CHANGE:
            nextState = { ...state, productList: getListState(status, data) }
            break
        case PRODUCT_DETAIL_SET_ID:
            nextState = { ...state, productDetail: { ...state.productDetail, productID: action.productID } }
            break
        case PRODUCT_INFORMATION_STATE_CHANGE:
            nextState = { ...state, productDetail: { ...state.productDetail, information: { status, data } } }
            break
        case PRODUCT_REVIEWS_AND_COMMENTS_STATE_CHANGE:
            nextState = { ...state, productDetail: { ...state.productDetail, reviewsAndComments: { status, reviews: reviews ? reviews : [], comments: comments ? comments : [] } } }
            break

    }

    return nextState

}

export default reducer