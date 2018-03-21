import { request, handleError, unknownError, getNotificationText } from '../utils'
import { serverHost } from '../config'

function getFullURL(path) {
    return serverHost + path
}

async function authenticate(email, password) {

    try {
        const response = await request(getFullURL('/authentication'), 'POST', { email, password })
        switch (response.code) {
            case 200:
                return { token: response.data.token }
            case 404:
                if (response.data.msg === 'ACCOUNT NOT FOUND')
                    return getNotificationText('Email chưa được đăng ký')
                else
                    return unknownError
                break
            case 401:
                if (response.data.msg === 'PASSWORD WRONG')
                    return getNotificationText('Mật khẩu sai')
                return getNotificationText('Tài khoản chưa được xác thực')
            default:
                return unknownError
        }
    } catch (error) {
        return handleError(error)
    }

}

async function enroll(email, password) {

}

module.exports = {
    authenticate,
    enroll
}