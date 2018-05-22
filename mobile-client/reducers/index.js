import { combineReducers } from "redux"
import app from './app'
import buffer from './buffer'
import user from './user'
import product from './product'
import navigation from './navigation'
import cart from './cart'
import feedback from './feedback'
import watchList from './watch-list'
import notification from './notification'
import promotion from './promotion'
import category from './category'
import order from './order'
import { reducer as form } from 'redux-form';

const appReducer = combineReducers({
    app,
    user,
    buffer,
    product,
    navigation,
    notification,
    cart,
    form,
    feedback,
    watchList,
    promotion,
    category,
    order
});

export default appReducer