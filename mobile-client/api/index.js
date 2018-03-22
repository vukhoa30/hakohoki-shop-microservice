import { request, getResult } from '../utils'
import { gatewayAddress } from '../config'

function getFullURL(path) {
    return gatewayAddress + path
}

async function authenticate(email, password) {

    try {
        const response = await request(getFullURL('/accounts/authentication'), 'POST', { email, password })
        switch (response.status) {
            case 200:
                return getResult('OK', { token: response.data.token })
            case 404:
                if (response.data.msg === 'ACCOUNT NOT FOUND')
                    return getResult('ACCOUNT_NOT_FOUND')
                else
                    return getResult('UNDEFINED_ERROR')
            case 401:
                if (response.data.msg === 'PASSWORD WRONG')
                    return getResult('PASSWORD_WRONG')
                return getResult('ACCOUNT_NOT_AUTHORIZED')
            case 500:
                return getResult('INTERNAL_SERVER_ERROR')
            default:
                return getResult('UNDEFINED_ERROR')
        }
    } catch (error) {
        return getResult(error)
    }

}

async function enroll(email, password) {

    try {
        const response = await request(getFullURL('/accounts'), 'POST', { email, password })
        switch (response.status) {
            case 200:
                return getResult('OK')
            case 409:
                return getResult('ACCOUNT_EXISTED')
            case 500:
                return getResult('INTERNAL_SERVER_ERROR')
            default:
                return getResult('UNDEFINED_ERROR')
        }
    } catch (error) {
        return getResult(error)
    }

}

async function authorize(email, authCode) {

    try {
        const response = await request(getFullURL('/accounts/authorization'), 'POST', { email, authCode })
        switch (response.status) {
            case 200:
                return getResult('OK')
            case 401:
                return getResult('AUTHORIZATION_CODE_NOT_MATCH')
            case 500:
                return getResult('INTERNAL_SERVER_ERROR')
            default:
                return getResult('UNDEFINED_ERROR')
        }
    } catch (error) {
        return getResult(error)
    }

}


module.exports = {
    authenticate,
    enroll,
    authorize
}