import asyncProcess from './async-process'

const actionType = {

    USER_LOG_IN: 'USER_LOG_IN',
    USER_LOG_OUT: 'USER_LOG_OUT'

}

function getAction(type, params) {

    let action = { type }

    switch (type) {

        case actionType.USER_LOG_IN:
            action.token = params.token
            break

    }

    return action

}

module.exports = {
    ...actionType,
    getAction,
    ...asyncProcess
}