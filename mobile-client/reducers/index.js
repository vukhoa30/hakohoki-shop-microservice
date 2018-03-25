import { combineReducers } from "redux"
import navReducer from './navReducer'
import userReducer from './userReducer'
import cacheReducer from './cacheReducer'
import dataReducer from './dataReducer'
import { reducer as formReducer } from 'redux-form';

const appReducer = combineReducers({
    nav: navReducer,
    user: userReducer,
    form: formReducer,
    cache: cacheReducer,
    data: dataReducer
});

export default appReducer