import {
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'

const reactNavigationReduxMiddleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
)

const obj = {

    reactNavigationReduxMiddleware

}

module.exports = obj