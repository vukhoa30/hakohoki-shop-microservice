import { request } from '../utils'
import navigator from '../models/navigations'
import {
    USER_LOG_IN,
    USER_LOG_OUT,
    CATEGORIES_STATE_CHANGE,
    PRODUCT_LIST_STATE_CHANGE,
    PRODUCT_DETAIL_SET_ID,
    PRODUCT_INFORMATION_STATE_CHANGE,
    PRODUCT_REVIEWS_AND_COMMENTS_STATE_CHANGE,
    SAVE_TO_BUFFER

} from './state-modifiers/keys'
import userAction from './state-modifiers/user'
import productAction from './state-modifiers/product'
import bufferAction from './state-modifiers/buffer'
import { SubmissionError } from "redux-form";

function logIn(token, email) {

    return dispatch => {

        console.log(USER_LOG_IN)
        dispatch(userAction(USER_LOG_IN, { token, email }))
        dispatch(navigator.router.getActionForPathAndParams('Main/Profile'))
    }

}

function logOut() {

    return dispatch => {

        dispatch(userAction(USER_LOG_OUT))
        dispatch(navigator.router.getActionForPathAndParams('LogIn'))

    }

}

function authenticate(values) {

    return new Promise(async (resolve, reject) => {

        console.log('Authentication function')
        let err = `Undefined error, try again later!`
        const { email, password } = values
        try {
            const response = await request('/accounts/authentication', 'POST', { email, password })
            const { status, data } = response
            const { logIn, navigation } = this.props
            const lastScreen = navigation.state.params ? navigation.state.params.lastScreen : null

            switch (status) {
                case 200:
                    logIn(data.token, email)
                    if (lastScreen)
                        navigation.navigate('Profile')
                    else
                        navigation.navigate(lastScreen)
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

            if (error === 'CONNECTION_ERROR')
                err = 'Could not connect to server'
        }

        reject(new SubmissionError({ _error: err }))

    })

}

function enroll(values) {

    return new Promise(async (resolve, reject) => {

        let err = `Undefined error, try again later!`
        const { email, password } = values
        try {
            const response = await request('/accounts/', 'POST', { email, password })
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
            const response = await request('/accounts/activation', 'POST', { email: navigation.state.params.email, activationCode })
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

function loadNewestProductList() {


}

function saveToBuffer(data) {

    return dispatch => dispatch(bufferAction(SAVE_TO_BUFFER, data))

}

function loadCategories() {

    return async dispatch => {

        dispatch(productAction(CATEGORIES_STATE_CHANGE, { status: 'LOADING' }))
        try {

            const response = await request('/products/categories', 'GET')
            const { status, data } = response

            if (status === 200)
                return dispatch(productAction(CATEGORIES_STATE_CHANGE, { status: 'LOADED', data: data.map(item => ({ key: item, name: item })) }))

        } catch (error) {


        }

        dispatch(productAction(CATEGORIES_STATE_CHANGE, { status: 'LOADING_FAILED' }))


    }

}

function loadProductList(category, offset = 0) {

    return async dispatch => {

        dispatch(productAction(PRODUCT_LIST_STATE_CHANGE, { status: 'LOADING' }))
        try {

            console.log('category = ' + category)
            const response = await request(`/products/search?category=${category}&offset=${offset}&limit=10`, 'GET')
            const { status, data } = response

            if (status === 200)
                return dispatch(productAction(PRODUCT_LIST_STATE_CHANGE, { status: 'LOADED', data }))

        } catch (error) {


        }

        dispatch(productAction(PRODUCT_LIST_STATE_CHANGE, { status: 'LOADING_FAILED' }))


    }

}

function loadProductDetail(productID) {

    return dispatch => {

        dispatch(productAction(PRODUCT_DETAIL_SET_ID, { productID }))
        dispatch(navigator.router.getActionForPathAndParams('ProductDetail/ProductInformation'))

    }

}

function loadProductInformation(productID) {


    return async dispatch => {

        dispatch(productAction(PRODUCT_INFORMATION_STATE_CHANGE, { status: 'LOADING' }))
        try {

            const response = await request(`/products/info/${productID}`, 'GET')
            const { status, data } = response

            if (status === 200)
                return dispatch(productAction(PRODUCT_INFORMATION_STATE_CHANGE, { status: 'LOADED', data }))

        } catch (error) {


        }

        dispatch(productAction(PRODUCT_INFORMATION_STATE_CHANGE, { status: 'LOADING_FAILED' }))


    }


}

function loadProductReviewsAndComments(productID) {

    return dispatch => {

        const reviews = []
        const comments = []

        dispatch(productAction(PRODUCT_REVIEWS_AND_COMMENTS_STATE_CHANGE, { status: 'LOADING' }))
        setTimeout(() => {
            dispatch(productAction(PRODUCT_REVIEWS_AND_COMMENTS_STATE_CHANGE, { status: 'LOADED', reviews, comments }))
        }, 500)


    }

}


module.exports = {

    authenticate,
    enroll,
    activate,
    loadNewestProductList,
    saveToBuffer,
    logIn,
    logOut,
    loadCategories,
    loadProductList,
    loadProductDetail,
    loadProductInformation,
    loadProductReviewsAndComments,

}