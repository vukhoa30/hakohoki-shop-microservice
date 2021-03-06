const keys = {

    APP_LOADED: 'APP_LOADED',
    UPDATE_SERVER_ADDRESS: 'UPDATE_SERVER_ADDRESS',
    SERVER_ADDRESS_SET_UP: 'SERVER_ADDRESS_SET_UP',

    USER_LOG_IN: 'USER_LOG_IN',
    USER_LOG_OUT: 'USER_LOG_OUT',

    CATEGORY_LOADING: 'CATEGORY_LOADING',
    CATEGORY_LOADED: 'CATEGORY_LOADED',
    CATEGORY_LOADING_FAILED: 'CATEGORY_LOADING_FAILED',

    PUSH_NEW_PRODUCT_SESSION: 'CREATE_NEW_PRODUCT_SESSION',
    REMOVE_PRODUCT_SESSION: 'REMOVE_PRODUCT_SESSION',
    SELECT_CATEGORY: 'SELECT_CATEGORY',
    SELECT_PRODUCT: 'SELECT_PRODUCT',
    PRODUCT_DATA_LOADING: 'PRODUCT_DATA_LOADING',
    PRODUCT_DATA_LOADED: 'PRODUCT_DATA_LOADED',
    PRODUCT_DATA_LOADING_FAILED: 'PRODUCT_DATA_LOADING_FAILED',
    PRODUCT_DATA_UPDATE_WATCH_LIST_STATE: 'PRODUCT_DATA_UPDATE_WATCH_LIST_STATE',
    REVIEW_PRODUCT: 'REVIEW_PRODUCT',


    PUSH_NEW_FEEDBACK: 'PUSH_NEW_FEEDBACK',
    REMOVE_FEEDBACK_SESSION: 'REMOVE_FEEDBACK_SESSION',
    FEEDBACK_LOADING: 'FEEDBACK_LOADING',
    FEEDBACK_LOADING_FAILED: 'FEEDBACK_LOADING_FAILED',
    FEEDBACK_LOADED: 'FEEDBACK_LOADED',

    NOTIFICATION_LOADING: 'NOTIFICATION_LOADING',
    NOTIFICATION_LOADING_FAILED: 'NOTIFICATION_LOADING_FAILED',
    NOTIFICATION_LOADED: 'NOTIFICATION_LOADED',
    SET_NOTIFICATION_STATUS: 'SET_NOTIFICATION_STATUS',
    APPEND_NOTIFICATION: 'APPEND_NOTIFICATION',
    CONNECTION_STATUS_SETTING: 'CONNECTION_STATUS_SETTING',

    MAKING_ORDER: 'MAKING_ORDER',
    FINISH_MAKING_ORDER: 'FINISH_MAKING_ORDER',
    CART_LOADING: 'CART_LOADING',
    FINISH_LOADING_CART: 'FINISH_LOADING_CART',
    ADD_TO_CART: 'ADD_TO_CART',
    MODIFY_CART_PRODUCT: 'MODIFY_CART_PRODUCT',
    REMOVE_FROM_CART: 'REMOVE_FROM_CART',
    REMOVE_ALL: 'REMOVE_ALL',

    PROMOTION_LOADING: 'PROMOTION_LOADING',
    PROMOTION_LOADING_FAILED: 'PROMOTION_LOADING_FAILED',
    PROMOTION_LOADED: 'PROMOTION_LOADED',

    SAVE_TO_BUFFER: 'SAVE_TO_BUFFER',

    WATCH_LIST_LOADING: 'WATCH_LIST_LOADING',
    UPDATE_WATCH_LIST: 'UPDATE_WATCH_LIST',

    ORDERS_LOADING: 'LOADING_ORDERS',
    ORDERS_LOADED: 'ORDERS_LOADED',
    ORDERS_LOAD_FAILED: 'ERRORS_ON_ORDERS'

}

function getAction(type, data) {
    return { type, ...data }
}

module.exports = {
    ...keys,
    getAction
}