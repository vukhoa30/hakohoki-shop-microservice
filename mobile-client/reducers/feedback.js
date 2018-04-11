import {

    SELECT_PRODUCT,
    FEEDBACK_LOADING,
    FEEDBACK_LOADED,
    FEEDBACK_LOADING_FAILED

} from "../actions";

const initialState = {

    productId: null,
    status: 'LOADING',
    reviews: [],
    questions: [],
    answers: [],
    statistic: {
        '5': 0,
        '4': 0,
        '3': 0,
        '2': 0,
        '1': 0
    }

}

function reducer(state = initialState, action) {

    let nextState = state
    const { type, reviews, questions, answers, productId, statistic } = action

    switch (type) {

        case SELECT_PRODUCT:
            nextState = { ...initialState, productId }
            break
        case FEEDBACK_LOADING:
            nextState = { ...state, status: 'LOADING' }
            break
        case FEEDBACK_LOADING_FAILED:
            nextState = { ...state, status: 'LOADING_FAILED' }
            break
        case FEEDBACK_LOADED:
            nextState = { ...state, status: 'LOADED', reviews, questions, answers, statistic }
            break

    }

    return nextState

}

export default reducer