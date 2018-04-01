import {
    NEWEST_PRODUCT_STATE_CHANGE,
    CATEGORIES_STATE_CHANGE,
    PRODUCT_LIST_STATE_CHANGE,
    PRODUCT_DETAIL_SET_ID,
    PRODUCT_INFORMATION_STATE_CHANGE,
    PRODUCT_FEEDBACK_STATE_CHANGE,
    PRODUCT_REVIEWS_PROCESSING_STATE_CHANGE
}
    from "../../presenters/state-modifiers/keys";

const initialState = {

    newestList: getListState('LOADING'),
    categories: getListState('LOADING'),
    productList: getListState('LOADING'),
    selectedProductID: null,
    productInformation: {
        status: 'LOADING',
        data: null
    },
    productFeedback: {
        status: 'LOADING',
        reviews: [],
        comments: []
    },
    productFeedbackStatistic: {
        status: 'PROCESSING',
        score: 0,
        totalReviews: 0,
        statistic: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        }
    }
}

function getListState(status, data) {

    const obj = { status, data: [] }
    if (data)
        obj.data = data
    return obj

}


function reducer(state = initialState, action) {

    let nextState = state
    const { type, status, data, reviews, comments, score, statistic, productID, totalReviews } = action

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
            nextState = { ...state, selectedProductID: productID , productInformation: initialState.productInformation, productFeedback: initialState.productFeedback, productFeedbackStatistic: initialState.productFeedbackStatistic }
            break
        case PRODUCT_INFORMATION_STATE_CHANGE:
            nextState = { ...state, productInformation: { status, data } }
            break
        case PRODUCT_FEEDBACK_STATE_CHANGE:
            nextState = { ...state, productFeedback: { status, reviews, comments } }
            break
        case PRODUCT_REVIEWS_PROCESSING_STATE_CHANGE:
            nextState = {
                ...state, productFeedbackStatistic: {
                    status: 'PROCESSING',
                    score: score ? score : 0,
                    totalReviews: totalReviews ? totalReviews: 0,
                    statistic: statistic ? statistic : {
                        5: 0,
                        4: 0,
                        3: 0,
                        2: 0,
                        1: 0
                    }
                }
            }
            break

    }

    return nextState

}

export default reducer