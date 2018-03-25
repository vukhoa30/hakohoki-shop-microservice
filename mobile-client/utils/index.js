import { gatewayAddress } from '../config'

function getFullURL(path) {
    return gatewayAddress + path
}

function request(url, method, data) {

    const fullUrl = getFullURL(url)
    return new Promise((resolve, reject) => {

        fetch(fullUrl, {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                const status = res.status
                return new Promise((resolve, reject) => {
                    res.json()
                        .then(data => resolve({ status, data }))
                        .catch(error => reject('JSON_PARSE_FAILED'))
                })
            })
            .catch(error => reject('CONNECTION_ERROR'))
            .then(data => {

                resolve(data)

            })

    })

}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = {
    request,
    validateEmail
}