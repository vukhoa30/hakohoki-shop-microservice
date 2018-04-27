import { combineReducers } from "redux";
import product from "./product";
import { reducer as form } from "redux-form";
import toast from "./toast";
import app from "./app";
import user from "./user";
import bill from "./bill";
import account from "./account";
import notification from "./notification";
import promotion from "./promotion";
import statistic from "./statistic";
import connection from "./connection";
import { routerReducer as router } from "react-router-redux";

export default combineReducers({
  product,
  form,
  router,
  toast,
  app,
  user,
  bill,
  account,
  notification,
  statistic,
  connection
});
