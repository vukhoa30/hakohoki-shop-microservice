import { gatewayAddress } from '../config'

function request(url, method, data) {

    const fullUrl = gatewayAddress + url
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
                        .catch(error => {
                            console.log(error)
                            reject('JSON_PARSE_FAILED')
                        })
                })
            })
            .catch(error => {
                console.log(error)
                reject('CONNECTION_ERROR')
            })
            .then(data => {

                resolve(data)

            })

    })

}

function currencyFormat(currency) {

    return currency.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + ' VND'

}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = {
    request,
    currencyFormat,
    validateEmail
}