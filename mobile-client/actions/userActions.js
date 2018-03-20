exports.actionType = {

    USER_AUTHENTICATING: 'USER_AUTHENTICATION',
    USER_FINISH_AUTHENTICATING: 'USER_FINISH_AUTHENTICATING',
    USER_LOG_OUT: 'USER_LOG_OUT'

}

exports.getAction = (type, params) => {

    let action = { type }

    switch (type) {

        case actionType.USER_AUTHENTICATING:
            return Object.assign({}, action, { username: params.email, password: params.password })
        case actionType.USER_FINISH_AUTHENTICATING:
            return Object.assign({}, action, { token: params.token, msg: params.msg })

    }

    return action

}