import { SAVE_TO_BUFFER } from './keys'

function getAction(type, data) {

    const action = { type }

    switch (type) {

        case SAVE_TO_BUFFER:
            action.data = data
            break

    }

    return action

}

export default getAction