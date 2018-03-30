import { USER_LOG_IN, USER_LOG_OUT } from './keys'

function getAction(type, data) {

    const action = { type }

    switch (type) {

        case USER_LOG_IN:
            action.token = data.token
            action.email = data.email
            break
        case USER_LOG_OUT:
            break

    }

    return action

}

export default getAction