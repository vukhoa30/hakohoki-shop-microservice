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
                const code = res.status
                return new Promise((resolve, reject) => {
                    res.json()
                        .then(data => resolve({ code, data }))
                        .catch(error => reject({ msg: 'UNDEFINED_ERROR' }))
                })
            })
            .catch(error => reject({ msg: 'CONNECTION_ERROR' }))
            .then(data => {

                resolve(data)

            })

    })

}

function handleError(error) {

    if (error.msg === 'CONNECTION_ERROR')
        return { msg: 'Lỗi kết nối' }
    return unknownError

}

const unknownError = { msg: 'Lỗi không xác định' }

function getNotificationText(msg) {
    return { msg }
}

module.exports = {
    request,
    handleError,
    unknownError,
    getNotificationText
}