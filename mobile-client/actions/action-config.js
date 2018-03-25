const actionType = {

    USER_LOG_IN: 'USER_LOG_IN',
    USER_LOG_OUT: 'USER_LOG_OUT',
    SAVE_EMAIL_TO_CACHE: 'SAVE_EMAIL_TO_CACHE',

    LOADING_NEWEST_PRODUCTS: 'LOAD_NEWEST_PRODUCTS',
    LOADING_NEWEST_PRODUCTS_SUCCEEDED: 'LOAD_NEWEST_PRODUCTS_SUCCEEDED',
    LOADING_NEWEST_PRODUCTS_FAILED: 'LOAD_NEWEST_PRODUCTS_FAILED'

}

function getAction(type, data) {

    let action = { type }

    switch (type) {

        case actionType.USER_LOG_IN:
            action.token = data
            break
        case actionType.SAVE_EMAIL_TO_CACHE:
            action.email = data
            break
        case actionType.LOADING_NEWEST_PRODUCTS_SUCCEEDED:
            action.data = data
            break

    }

    return action

}

module.exports = {
    ...actionType,
    getAction
}
