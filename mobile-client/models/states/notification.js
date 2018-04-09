import {

    NOTIFICATION_LOADING,
    NOTIFICATION_LOADED,
    NOTIFICATION_LOADING_FAILED,
    SET_NOTIFICATION_STATUS,
    APPEND_NOTIFICATION,
    CONNECTION_STATUS_SETTING

} from "../../presenters/keys";

const initialState = {

    status: 'LOADING',
    list: [],
    connectionStatus: 'NOT_CONNECTED'

}

const reducer = (state = initialState, action) => {

    let nextState = state
    const { type, data, notificationId, read, connectionStatus } = action

    switch (type) {

        case NOTIFICATION_LOADING:
            nextState = { ...state, status: 'LOADING' }
            break
        case NOTIFICATION_LOADED:
            nextState = { ...state, status: 'LOADED', list: data }
            break
        case NOTIFICATION_LOADING_FAILED:
            nextState = { ...state, status: 'LOADING_FAILED' }
            break
        case SET_NOTIFICATION_STATUS:
            const notificationIndex = state.list.findIndex(notification => notification._id === notificationId)
            if (notificationIndex > -1) {
                const notificationList = state.list.splice(0)
                notificationList[notificationIndex].read = read
                nextState = { ...state, list: notificationList }
            }
            break
        case APPEND_NOTIFICATION:
            nextState = { ...state, list: state.list.concat(data) }
            break
        case CONNECTION_STATUS_SETTING:
            nextState = { ...state, connectionStatus }
            break

    }


    return nextState

};

export default reducer