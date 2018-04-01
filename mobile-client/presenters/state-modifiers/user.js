import { USER_LOG_IN, USER_LOG_OUT } from './keys'

function getAction(type, data) {

    const action = { type }

    console.log(data)
    switch (type) {

        case USER_LOG_IN:
            action.token = data.token
            action.email = data.email
            action.fullName = data.fullName
            break
        case USER_LOG_OUT:
            break

    }

    return action

}

export default getAction