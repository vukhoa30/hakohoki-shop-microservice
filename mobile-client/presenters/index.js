import { request } from '../utils'
import navigator from '../models/navigations'
import {
    USER_LOG_IN,
    USER_LOG_OUT,
    CATEGORIES_STATE_CHANGE,
    PRODUCT_LIST_STATE_CHANGE,
    PRODUCT_DETAIL_SET_ID,
    PRODUCT_INFORMATION_STATE_CHANGE,
    PRODUCT_FEEDBACK_STATE_CHANGE,
    PRODUCT_REVIEWS_PROCESSING_STATE_CHANGE,
    SAVE_TO_BUFFER

} from './state-modifiers/keys'
import userAction from './state-modifiers/user'
import productAction from './state-modifiers/product'
import bufferAction from './state-modifiers/buffer'
import { SubmissionError } from "redux-form";
import { reduce, assign } from "lodash";
import { NavigationActions } from "react-navigation";
import { AsyncStorage } from "react-native";
import { transform } from "lodash";

function loadUserInfo() {

    return dispatch => {

        AsyncStorage.multiGet(['@User:token', '@User:email', '@User:fullName'], (err, values) => {

            console.log(values)

        })


    }

}

function logIn(token, email, fullName) {

    return dispatch => {

        dispatch(userAction(USER_LOG_IN, { token, email, fullName }))
    }

}

function logOut() {

    return dispatch => {

        AsyncStorage.multiRemove(['@User:token', '@User:email', '@User:fullName'])
        dispatch(userAction(USER_LOG_OUT))
        dispatch(navigator.router.getActionForPathAndParams('Account/LogIn'))

    }

}

function authenticate(values) {

    return new Promise(async (resolve, reject) => {

        let err = `Undefined error, try again later!`
        const { email, password } = values
        try {
            const response = await request('/accounts/authentication', 'POST', { email, password })
            const { status, data } = response
            const { logIn, navigation } = this.props
            const lastScreen = navigation.state.params ? navigation.state.params.lastScreen : null

            switch (status) {
                case 200:
                    logIn(data.token, email, data.account.fullName)
                    AsyncStorage.multiSet([['@User:token', data.token], ['@User:email', email], ['@User:fullName', data.account.fullName]])
                    if (lastScreen === null)
                        navigation.navigate('Profile')
                    else
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
            const response = await request('/accounts/', 'POST', { email, password, fullName })
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

function loadProductFeedback(productID, type) {

    return async dispatch => {

        dispatch(productAction(PRODUCT_FEEDBACK_STATE_CHANGE, { status: 'LOADING' }))
        try {

            const response = await request(`/comments/${productID}`, 'GET')
            const { status, data } = response
            const result = reduce(data, (result, item) => {

                const title = item.reviewScore ? 'reviews' : 'comments'
                result[title].push(item)
                return result

            }, { 'reviews': [], 'comments': [] })

            if (type === 'reviews')
                handleReviewsData(dispatch, result['reviews'])

            if (status === 200)
                return dispatch(productAction(PRODUCT_FEEDBACK_STATE_CHANGE, { status: 'LOADED', reviews: result['reviews'], comments: result['comments'] }))

        } catch (error) {


        }

        dispatch(productAction(PRODUCT_FEEDBACK_STATE_CHANGE, { status: 'LOADING_FAILED' }))


    }

}

function handleReviewsData(dispatch, reviews) {

    if (reviews.length === 0)
        return dispatch(productAction(PRODUCT_REVIEWS_PROCESSING_STATE_CHANGE, { status: 'PROCESSED' }))

    dispatch(productAction(PRODUCT_REVIEWS_PROCESSING_STATE_CHANGE, { status: 'PROCESSING' }))

    const statistic = reduce(reviews, (result, item) => {

        result[item.reviewScore]++
        return result

    }, {
            '5': 0,
            '4': 0,
            '3': 0,
            '2': 0,
            '1': 0
        })

    const totalReviews = reduce(statistic, (result, item, key) => result + item, 0)
    score = Math.round(reduce(statistic, (result, item, key) => result + item * key, 0) / totalReviews)

    dispatch(productAction(PRODUCT_REVIEWS_PROCESSING_STATE_CHANGE, { status: 'PROCESSED', statistic, score, totalReviews }))


}

function makingStatistic(reviews) {

    return dispatch => handleReviewsData(dispatch, reviews)

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
    loadProductFeedback,
    makingStatistic,
    loadUserInfo

}