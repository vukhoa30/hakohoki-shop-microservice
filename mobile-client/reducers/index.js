import { combineReducers } from "redux"
import navReducer from './navReducer'
import userReducer from './userReducer'

const appReducer = combineReducers({
    nav: navReducer,
    user: userReducer
});

export default appReducer