function request(url, method, data) {

    return new Promise((resolve, reject) => {

        fetch(url, {
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
                        .catch(error => reject({ msg: 'UNDEFINED_ERROR' }))
                })
            })
            .catch(error => reject({ msg: 'CONNECTION_ERROR' }))
            .then(data => {

                resolve(data)

            })

    })

}

function getResult(code, data) {

    return { code, data }

}

module.exports = {
    request,
    getResult
}