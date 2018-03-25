import {

    LOADING_NEWEST_PRODUCTS,
    LOADING_NEWEST_PRODUCTS_SUCCEEDED,
    LOADING_NEWEST_PRODUCTS_FAILED
}
    from '../actions'

const initialState = {

    newestProducts: {
        state: 'LOADING',
        data: []
    }

}

const dataReduccer = (state = initialState, action) => {
    let nextState = null
    switch (action.type) {

        case LOADING_NEWEST_PRODUCTS:
            nextState = { ...state, newestProducts: { state: 'LOADING' } }
            break
        case LOADING_NEWEST_PRODUCTS_SUCCEEDED:
            nextState = { ...state, newestProducts: { state: 'LOADED', data: action.data } }
            break
        case LOADING_NEWEST_PRODUCTS_FAILED:
            nextState = { ...state, newestProducts: { state: 'LOADING_FAILED' } }
            break

    }

    return nextState || state;
};

export default dataReduccer