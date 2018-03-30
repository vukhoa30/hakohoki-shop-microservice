import { } from './keys'

function getAction(type, data) {

    const action = { type, ...data }

    return action

}

export default getAction