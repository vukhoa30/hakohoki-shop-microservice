import { combineReducers } from "redux"
import buffer from './buffer'
import user from './user'
import product from './product'
import navigation from './navigation'
import cart from './cart'
import feedback from './feedback'
import { reducer as form } from 'redux-form';

const appReducer = combineReducers({
    user,
    buffer,
    product,
    navigation,
    cart,
    form,
    feedback
});

export default appReducer