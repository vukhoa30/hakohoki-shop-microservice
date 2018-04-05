import { request, parseToQueryString, getAction, delay, alert } from '../utils'
import navigator from '../models/navigations'
import {
    USER_LOG_IN,
    USER_LOG_OUT,
    SELECT_PRODUCT,
    PRODUCT_LIST_LOADING,
    PRODUCT_DETAIL_LOADING,
    WATCH_LIST_STATUS_FETCHING,
    FEEDBACK_LOADING,
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
                }

                return result


            }, {

                    token: null,
                    email: null,
                    fullName: null

                })

            dispatch(getAction(USER_LOG_IN, { ...obj }))

        })


    }

}

function logIn(token, email, fullName) {

    return dispatch => {

        dispatch(getAction(USER_LOG_IN, { token, email, fullName }))
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
        const { email, password } = values
        try {
            const response = await request('/accounts/authentication', 'POST', {}, { email, password })
            const { status, data } = response
            const { logIn, navigation } = this.props
            const lastScreen = navigation.state.params ? navigation.state.params.lastScreen : null
            console.log(data)
            switch (status) {
                case 200:
                    logIn(data.token, email, data.account.fullName)
                    AsyncStorage.multiSet([['@User:token', data.token], ['@User:email', email], ['@User:fullName', data.account.fullName]], errors => console.log('Error' + errors))
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
        const { email, password, fullName } = values
        try {
            const response = await request('/accounts/', 'POST', {}, { email, password, fullName })
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
            const response = await request('/accounts/activation', 'POST', {}, { email: navigation.state.params.email, activationCode })
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

function search(values) {

    const { q } = values
    const { navigation } = this.props
    navigation.navigate('ProductList', { q })

}

function loadProductList(conditions, offset, limit) {

    return async dispatch => {

        dispatch(getAction(PRODUCT_LIST_LOADING, { status: 'LOADING', firstLoad: offset === 0 }))

        const url = '/products/' + (conditions.newest ? 'latest?' : 'search?' + parseToQueryString(conditions) + '&')

        try {

            const response = await request(`${url}offset=${offset}&limit=${limit}`, 'GET', {})
            const { status, data } = response

            console.log(data)
            if (status === 200)
                return dispatch(getAction(PRODUCT_LIST_LOADING, { status: 'LOADED', data, conditions }))

        } catch (error) {

        }

        dispatch(getAction(PRODUCT_LIST_LOADING, { status: 'LOADING_FAILED' }))

    }

}

function selectProduct(productID) {

    return dispatch => {

        dispatch(getAction(SELECT_PRODUCT, { productID }))
        dispatch(navigator.router.getActionForPathAndParams('ProductDetail/ProductInformation'))

    }

}

function loadProductInformation(productID, token) {

    return async dispatch => {
        dispatch(getAction(PRODUCT_DETAIL_LOADING, { status: 'LOADING' }))

        try {

            const response = await request(`/products/info/${productID}`, 'GET', { Authorization: 'JWT ' + token })
            const { status, data } = response

            if (status === 200) {

                if (data.reviewScore) data.reviewScore = Math.round(data.reviewScore, 1)
                return dispatch(getAction(PRODUCT_DETAIL_LOADING, { status: 'LOADED', data }))
            }


        } catch (error) {

            console.log(error)

        }

        dispatch(getAction(PRODUCT_DETAIL_LOADING, { status: 'LOADING_FAILED' }))

    }

}

function loadProductFeedback(productID, needDelay = false) {

    return async dispatch => {
        dispatch(getAction(FEEDBACK_LOADING, { status: 'LOADING' }))
        try {

            if (needDelay)
                await delay(3000)
            const response = await request(`/comments/${productID}`, 'GET', {})
            const { status, data } = response

            if (status === 200) {

                const { reviews, notFilteredComments } = reduce(data, (result, item) => {

                    if (item.reviewScore)
                        result['reviews'].push(item)
                    else
                        result['notFilteredComments'].push(item)

                    return result

                }, { reviews: [], notFilteredComments: [] })

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

                const comments = notFilteredComments.filter(comment => !comment.parentId)

                comments.forEach(comment => {

                    comment.reply = notFilteredComments.filter(cmt => cmt.parentId === comment.id)

                })

                return dispatch(getAction(FEEDBACK_LOADING, { status: 'LOADED', reviews, comments, statistic }))

            }


        } catch (error) {

            console.log(error)

        }

        dispatch(getAction(FEEDBACK_LOADING, { status: 'LOADING_FAILED' }))

    }

}

function sendReview(values) {

    return new Promise(async (resolve, reject) => {

        let err = `Undefined error, try again later!`
        const content = values.review
        const reviewScore = this.state.starCount
        const { productID: productId, logOut, navigation, token } = this.props
        try {

            const response = await request('/comments', 'POST', { Authorization: 'JWT ' + token }, { productId, content, reviewScore })
            const { status, data } = response

            switch (status) {
                case 200:
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
            const { productId, logOut, navigation, token, parentId, fullName, reset } = this.props
            if (parentId) reset()
            const response = await request('/comments', 'POST', { Authorization: 'JWT ' + token }, { productId, content, parentId })
            const { status, data } = response

            switch (status) {
                case 200:
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

function getAnswer(commentID) {

    return dispatch => {

        dispatch(getAction(GET_ANSWERS, { commentID }))
        dispatch(navigator.router.getActionForPathAndParams('Answers'))

    }

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

function setWatchList(productId, type, token, needToUpdateWatchList) {

    return async dispatch => {

        console.log(token)
        if (token === null) {
            alert('Authentication failed', 'You need to log in first')
            dispatch(logOut())
            return
        }

        dispatch(getAction(WATCH_LIST_STATUS_FETCHING, { isFetching: true }))

        try {

            let response = await request(`/watchlists/${productId}`, type === 'ADD' ? 'POST' : 'DELETE', { Authorization: 'JWT ' + token })
            let { status, data } = response

            if (status === 200) {

                if (needToUpdateWatchList){
                }
                response = await request(`/products/info/${productId}`, 'GET', { Authorization: 'JWT ' + token })
                status = response.status
                data = response.data
                if (status === 200) {

                    if (data.reviewScore) data.reviewScore = Math.round(data.reviewScore, 1)
                    if (type === 'ADD')
                        alert('Success', 'The product has been watched')
                    else
                        alert('Success', 'The product has been removed from your watch list')
                    return dispatch(getAction(PRODUCT_DETAIL_LOADING, { status: 'LOADED', data }))

                } else {

                    alert('Errors', 'Some errors occur. Please try again later!')
                }

            } else {

                if (status === 401) {

                    alert('Authentication failed', 'You need to log in first')
                    dispatch(logOut())

                } else {

                    if (type === 'ADD')
                        alert('Add to watch list failed', 'The product may exist in your watch list')
                    else
                        alert('Remove from watch list failed', 'The product may not exist in your watch list')

                }

            }


        } catch (error) {

        }

        dispatch(getAction(WATCH_LIST_STATUS_FETCHING, { isFetching: false }))

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
    getAnswer,
    setCart,
    search,
    loadNewestProducts,
    loadWatchList,
    setWatchList,
    removeFromWatchlist

}