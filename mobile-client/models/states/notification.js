import {

    NOTIFICATION_LOADING,
    NOTITICATION_LOADED,
    NOTIFICATION_LOADING_FAILED,
    SET_NOTIFICATION_STATUS

} from "../../presenters/keys";

const initialState = {

    status: 'LOADING',
    list: []

}

const reducer = (state = initialState, action) => {

    let nextState = state
    const { type, data, notificationId, read } = action

    switch (type) {

        case NOTIFICATION_LOADING:
            nextState = { ...state, status: 'LOADING' }
            break
        case NOTITICATION_LOADED:
            nextState = { ...state, status: 'LOADED', list: data }
            break
        case NOTIFICATION_LOADING_FAILED:
            nextState = { ...state, status: 'LOADING_FAILED' }
            break
        case SET_NOTIFICATION_STATUS:
            const notification = nextState.list.find(notification => notification.notificationId === notificationId)
            if (notification) {
                notification.read = read
            }
            break

    }


    return nextState

};

export default reducer