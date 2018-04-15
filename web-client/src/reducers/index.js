import { combineReducers } from "redux";
import product from "./product"
import { reducer as form } from 'redux-form'

export default combineReducers({

    product,
    form

})