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
        info: {
            status: 'LOADING',
            data: null
        },
        feedback: {
            status: 'LOADING',
            reviews: [],
            comments: [],
            statistic: {
                '5': 0,
                '4': 0,
                '3': 0,
                '2': 0,
                '1': 0
            },
            questions: []
        }
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

function getProductDetail(action, oldData) {

    const { dataType, status } = action

    if (dataType === 'info') {

        const { data } = action
        return {
            ...oldData,
            info: {
                status,
                data: data ? data : null
            }
        }

    } else {

        const { reviews, comments, statistic, questions } = action

        return {
            ...oldData,
            feedback: {
                status,
                reviews: reviews ? reviews : [],
                comments: comments ? comments : [],
                statistic: statistic ? statistic : {
                    '5': 0,
                    '4': 0,
                    '3': 0,
                    '2': 0,
                    '1': 0
                },
                questions: questions ? questions : []
            }
        }

    }

}


function reducer(state = initialState, action) {

    let nextState = state

    switch (action.type) {

        case PRODUCT_LIST_LOADING:
            nextState = { ...state, list: getProductList(action, state.list) }
            break
        case SELECT_PRODUCT:
            nextState = { ...state, current: { ...initialState.current, id: action.productID } }
            break
        case PRODUCT_DETAIL_LOADING:
            nextState = { ...state, current: getProductDetail(action, state.current) }
            break
    }


    return nextState

}

export default reducer