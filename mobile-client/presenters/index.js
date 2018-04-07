import { request, parseToQueryString, getAction, delay, alert } from '../utils'
import navigator from '../models/navigations'
import {
    USER_LOG_IN,
    USER_LOG_OUT,

    SELECT_PRODUCT,

    PRODUCT_DATA_LOADING,
    PRODUCT_DATA_LOADED,
    PRODUCT_DATA_LOADING_FAILED,
    PRODUCT_DATA_UPDATING_WATCH_LIST_STATE,
    PRODUCT_DATA_UPDATE_WATCH_LIST_STATE,

    FEEDBACK_LOADING,
    FEEDBACK_LOADED,
    FEEDBACK_LOADING_FAILED,

    GET_ANSWERS,
    ADD_INVALIDATED_COMMENT,
    ADD_TO_CART,
    REMOVE_FROM_CART,
    REMOVE_ALL,
    SAVE_TO_BUFFER,
    WATCH_LIST_LOADING

} from './keys'
import bufferAction from './state-modifiers/buffer'
import { SubmissionError } from "redux-form";
import { reduce, assign, transform } from "lodash";
import { NavigationActions } from "react-navigation";
import { AsyncStorage } from "react-native";

function loadUserInfo() {

    return dispatch => {

        AsyncStorage.multiGet(['@User:token', '@User:email', '@User:fullName'], (err, values) => {

            console.log(values)
            if (values[0][1] === null) return

            const obj = reduce(values, (result, item) => {

                switch (item[0]) {
                    case '@User:token':
                        result['token'] = item[1]
                        break
                    case '@User:email':
                        result['email'] = item[1]
                        break
                    case '@User:fullName':
                        result['fullName'] = item[1]
                        break
                    case '@User:phoneNumber':
                        result['phoneNumber'] = item[1]
                        break
                }

                return result


            }, {

                    token: null,
                    email: null,
                    fullName: null,
                    phoneNumber: null

                })

            dispatch(getAction(USER_LOG_IN, { ...obj }))

        })


    }

}

function logIn(token, email, fullName, phoneNumber) {

    return dispatch => {

        dispatch(getAction(USER_LOG_IN, { token, email, fullName, phoneNumber }))
    }

}

function logOut() {

    return dispatch => {

        AsyncStorage.multiRemove(['@User:token', '@User:email', '@User:fullName'])
        dispatch(getAction(USER_LOG_OUT))
        dispatch(navigator.router.getActionForPathAndParams('Account/LogIn'))

    }

}

function authenticate(values) {

    return new Promise(async (resolve, reject) => {

        let err = `Undefined error, try again later!`
        const { emailOrPhoneNumber, password } = values
        try {
            const response = await request('/accounts/authentication', 'POST', {}, { emailOrPhoneNumber, password })
            const { status, data } = response
            const { logIn, navigation } = this.props
            const lastScreen = navigation.state.params ? navigation.state.params.lastScreen : null
            console.log(data)
            switch (status) {
                case 200:
                    logIn(data.token, email, data.account.fullName, data.account.phoneNumber)
                    AsyncStorage.multiSet([['@User:token', data.token], ['@User:email', email], ['@User:fullName', data.account.fullName], ['@User:phoneNumber', data.account.phoneNumber]], errors => console.log('Error' + errors))
                    navigation.dispatch(NavigationActions.back())
                    return resolve()
                case 401:
                    if (data.msg === 'ACCOUNT NOT ACTIVATED') {
                        navigation.navigate('Activation', { email })
                        err = 'Your account has not been activated yet'
                    }
                    else
                        err = 'Password wrong'
                    break
                case 404:
                    err = 'The account is not existed!'
                    break
                case 500:
                    err = 'Internal server error! Try again later'
                    break
            }



        } catch (error) {

            console.log(error)
            if (error === 'CONNECTION_ERROR')
                err = 'Could not connect to server'
        }

        reject(new SubmissionError({ _error: err }))

    })

}

function enroll(values) {

    return new Promise(async (resolve, reject) => {

        let err = `Undefined error, try again later!`
        const { email, password, fullName, phoneNumber } = values
        try {
            const response = await request('/accounts/', 'POST', {}, { email, password, fullName, phoneNumber })
            const { status, data } = response
            const { navigation } = this.props

            switch (status) {
                case 200:
                    navigation.navigate('Activation', { email })
                    return resolve()
                case 409:
                    err = 'The email was registered'
                case 500:
                    err = 'Internal server error! Try again later'
                    break
            }



        } catch (error) {

            if (error === 'CONNECTION_ERROR')
                err = 'Could not connect to server'
        }

        reject(new SubmissionError({ _error: err }))

    })

}

function activate(values) {

    return new Promise(async (resolve, reject) => {

        let err = `Undefined error, try again later!`
        const { activationCode } = values
        const { navigation } = this.props

        try {
            const response = await request('/accounts/activation', 'POST', {}, { emailOrPhoneNumber: navigation.state.params.email, activationCode })
            const { status, data } = response

            switch (status) {
                case 200:
                    navigation.navigate('LogIn')
                    return resolve()
                case 401:
                    err = 'Activation code is wrong'
                    break
                case 500:
                    err = 'Internal server error! Try again later'
                    break
            }



        } catch (error) {

            if (error === 'CONNECTION_ERROR')
                err = 'Could not connect to server'
        }

        reject(new SubmissionError({ _error: err }))

    })

}

function saveToBuffer(data) {

    return dispatch => dispatch(bufferAction(SAVE_TO_BUFFER, data))

}

function loadNewestProducts() {

    return new Promise(async (resolve, reject) => {

        try {

            const response = await request('/products/latest?offset=0&limit=10', 'GET', {})
            const { status, data } = response

            if (status === 200)
                resolve({ ok: true, list: data })

        } catch (error) {


        }

        resolve({ ok: false })


    })

}

function loadCategories() {

    return new Promise(async (resolve, reject) => {

        try {

            const response = await request('/products/categories', 'GET', {})
            const { status, data } = response

            if (status === 200)
                resolve({ ok: true, list: data.map(item => ({ key: item, name: item })) })

        } catch (error) {


        }

        resolve({ ok: false })


    })

}

function selectCategory(category) {

    return dispatch => dispatch(navigator.router.getActionForPathAndParams('ProductList', { category }))

}

function loadProductList(conditions, offset, limit) {

    return new Promise(async resolve => {

        const url = '/products/' + (conditions.newest ? 'latest?' : 'search?' + parseToQueryString(conditions) + '&')

        try {

            const response = await request(`${url}offset=${offset}&limit=${limit}`, 'GET', {})
            const { status, data } = response
            if (status === 200)
                resolve({ ok: true, data })

        } catch (error) {

        }

        resolve({ ok: false })

    })

}

function selectProduct(productId) {

    return dispatch => {

        dispatch(getAction(SELECT_PRODUCT, { productId }))
        dispatch(navigator.router.getActionForPathAndParams('ProductDetail/ProductInformation'))

    }

}

function loadProductInformation(productId, token) {

    return async dispatch => {

        dispatch(getAction(PRODUCT_DATA_LOADING))

        try {

            const response = await request(`/products/info/${productId}`, 'GET', { Authorization: 'JWT ' + token })
            const { status, data } = response

            if (status === 200) {
                if (data.reviewScore) data.reviewScore = Math.round(data.reviewScore, 1)
                return dispatch(getAction(PRODUCT_DATA_LOADED, { data }))
            }


        } catch (error) {

            console.log(error)

        }

        dispatch(getAction(PRODUCT_DATA_LOADING_FAILED))

    }

}

function loadProductFeedback(productId) {

    return async dispatch => {

        try {

            dispatch(getAction(FEEDBACK_LOADING))
            const response = await request(`/comments/${productId}`, 'GET', {})
            const { status, data } = response

            if (status === 200) {

                const { reviews, comments } = reduce(data, (result, item) => {

                    if (item.reviewScore)
                        result['reviews'].push(item)
                    else
                        result['comments'].push(item)

                    return result

                }, { reviews: [], comments: [] })

                const statistic = reduce(reviews, (result, review) => {

                    result[review.reviewScore]++
                    return result

                }, {
                        '5': 0,
                        '4': 0,
                        '3': 0,
                        '2': 0,
                        '1': 0
                    })

                return dispatch(getAction(FEEDBACK_LOADED, { reviews, comments, originalComments: comments.filter(comment => !comment.parentId), statistic }))
            }


        } catch (error) {

            console.log(error)

        }

        dispatch(getAction(FEEDBACK_LOADING_FAILED))

    }

}

function sendReview(values) {

    return new Promise(async (resolve, reject) => {

        let err = `Undefined error, try again later!`
        const content = values.review
        const reviewScore = this.state.starCount
        const { productId, logOut, token, loadProductFeedback } = this.props
        try {

            const response = await request('/comments', 'POST', { Authorization: 'JWT ' + token }, { productId, content, reviewScore })
            const { status, data } = response

            switch (status) {
                case 200:
                    loadProductFeedback(productId)
                    return resolve()
                case 401:
                    err = 'Authenticate user failed! Please log in again'
                    logOut()
                    break
                case 500:
                    err = 'Internal server error! Try again later'
                    break
            }


        } catch (error) {

            console.log(error)
            if (error === 'CONNECTION_ERROR')
                err = 'Could not connect to server'
        }

        reject(new SubmissionError({ _error: err }))

    })

}

function sendComment(values) {

    return new Promise(async (resolve, reject) => {

        let err = `Undefined error, try again later!`
        try {

            const content = values.comment
            const { token, reset, productId, parentId, loadProductFeedback, logOut } = this.props
            reset()
            const response = await request('/comments', 'POST', { Authorization: 'JWT ' + token }, { productId, content, parentId })
            const { status, data } = response

            switch (status) {
                case 200:
                    loadProductFeedback(productId)
                    return resolve()
                case 401:
                    err = 'Authenticate user failed! Please log in again'
                    logOut()
                    break
                case 500:
                    err = 'Internal server error! Try again later'
                    break
            }



        } catch (error) {

            console.log(error)
            if (error === 'CONNECTION_ERROR')
                err = 'Could not connect to server'
        }

        reject(new SubmissionError({ _error: err }))

    })


}

async function loadAnswers(productId, parentId) {

    try {

        this.setState({ status: 'LOADING' })

        const response = await request(`/comments/${productId}`, 'GET', {})

        const { status, data } = response

        if (status === 200) {
            return this.setState({ status: 'LOADED', replies: data.filter(comment => comment.parentId === parentId) })
        }


    } catch (error) {

    }

    alert('Error', `Can't comment now!`)
    this.setState({ status: 'LOADED' })

}

function setCart(product, type) {

    return dispatch => {

        switch (type) {
            case 'ADD':
                dispatch(getAction(ADD_TO_CART, { data: product }))
                break
            case 'REMOVE':
                dispatch(getAction(REMOVE_FROM_CART, { productID: product._id }))
                break
            case 'REMOVE_ALL':
                dispatch(getAction(REMOVE_ALL))
                break
        }

    }

}

function addOrRemoveProductFromWatchList(productId, token, type, watchList, updateCurrentProduct) {

    return async dispatch => {

        if (token === null) {
            return dispatch(logOut())
        }

        updateCurrentProduct('UPDATING')

        try {

            const response = await request(`/watchlists/${productId}`, type === 'ADD' ? 'POST' : 'DELETE', { Authorization: 'JWT ' + token })
            const { status } = response

            if (status === 200) {

                if (watchList.state === 'LOADED') {
                    dispatch(loadWatchList(token, 0, watchList.list.length))
                }

                alert('Success', type === 'ADD' ? 'Add product to watch list successfully' : 'Remove product from watch list successfully')

                return updateCurrentProduct(type)

            } else if (status === 401) {
                alert('Authentication failed', 'Please log in')
                return dispatch(logOut())
            }

        } catch (error) {

        }

        updateCurrentProduct('FAIL_TO_UPDATE')
        alert('Error', `Could not ${type === 'ADD' ? 'add product to your watch list!' : 'remove product from your watch list!'} Please try again.`)

    }

}

function removeFromWatchlist(productId, token, offset, limit) {

    return async dispatch => {

        console.log(token)
        if (token === null) {
            alert('Authentication failed', 'You need to log in first')
            dispatch(logOut())
            return
        }

        dispatch(getAction(WATCH_LIST_LOADING, { status: 'LOADING' }))

        try {

            let response = await request(`/watchlists/${productId}`, 'DELETE', { Authorization: 'JWT ' + token })
            let { status, data } = response

            if (status === 200) {

                response = await request(`/watchlists?offset=${offset}&limit=${limit}`, 'GET', { Authorization: 'JWT ' + token })
                status = response.status
                data = response.data
                if (status === 200) {

                    alert('Success', 'The product has been removed from your watch list')
                    return dispatch(getAction(WATCH_LIST_LOADING, { status: 'LOADED', data }))

                } else {

                    alert('Errors', 'Some errors occur. Please try again later!')
                }

            } else {

                if (status === 401) {

                    alert('Authentication failed', 'You need to log in first')
                    dispatch(logOut())

                } else {

                    alert('Remove from watch list failed', 'The product may not exist in your watch list')

                }

            }


        } catch (error) {

        }

        dispatch(getAction(WATCH_LIST_LOADING, { status: 'LOADING_FAILED' }))

    }

}

function loadWatchList(token, offset, limit) {

    return async dispatch => {

        dispatch(getAction(WATCH_LIST_LOADING, { status: 'LOADING' }))
        try {

            const response = await request(`/watchlists?offset=${offset}&limit=${limit}`, 'GET', { Authorization: 'JWT ' + token })
            const { status, data } = response

            if (status === 200) {
                return dispatch(getAction(WATCH_LIST_LOADING, { status: 'LOADED', data }))
            }

        } catch (error) {

            console.log(error)

        }

        dispatch(getAction(WATCH_LIST_LOADING, { status: 'LOADING_FAILED' }))
    }

}

module.exports = {

    authenticate,
    enroll,
    activate,
    loadUserInfo,
    saveToBuffer,
    logIn,
    logOut,
    loadCategories,
    loadProductList,
    selectProduct,
    selectCategory,
    loadProductInformation,
    loadProductFeedback,
    sendReview,
    sendComment,
    loadAnswers,
    setCart,
    loadNewestProducts,
    loadWatchList,
    addOrRemoveProductFromWatchList,
    removeFromWatchlist

}