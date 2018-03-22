import asyncProcess from './async-process'

const actionType = {

    USER_LOG_IN: 'USER_LOG_IN',
    USER_LOG_OUT: 'USER_LOG_OUT',
    SAVE_EMAIL_TO_CACHE: 'SAVE_EMAIL_TO_CACHE'

}

function getAction(type, params) {

    let action = { type }

    switch (type) {

        case actionType.USER_LOG_IN:
            action.token = params.token
            break
        case actionType.SAVE_EMAIL_TO_CACHE:
            action.email = params.email
            break

    }

    return action

}

module.exports = {
    ...actionType,
    getAction,
    ...asyncProcess
}