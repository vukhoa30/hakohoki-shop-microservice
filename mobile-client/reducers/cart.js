import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  REMOVE_ALL,
  MODIFY_CART_PRODUCT,
  CART_LOADING,
  FINISH_LOADING_CART,
  MAKING_ORDER,
  FINISH_MAKING_ORDER
} from "../actions";
import { remove } from "lodash";
import store from "../utils/cache-store";

const initialState = {
  status: "INIT",
  list: []
};

function reducer(state = initialState, action) {
  let nextState = state;
  const { type, data, productId, number, list, addMore } = action;
  let needValidateCart = true;
  switch (type) {
    case ADD_TO_CART:
      nextState = {
        ...state,
        list: state.list.concat({ ...data, amount: number })
      };
      break;
    case REMOVE_FROM_CART:
      nextState = {
        list: remove(state.list, product => product._id !== productId)
      };
      break;
    case REMOVE_ALL:
      nextState = { ...state, list: [], status: "INIT" };
      break;
    case MODIFY_CART_PRODUCT:
      const cartProductIndex = state.list.findIndex(
        cartProduct => cartProduct._id === productId
      );
      if (cartProductIndex > -1) {
        const cartProductList = state.list.splice(0);
        cartProductList[cartProductIndex].amount = number;
        nextState = { ...state, list: cartProductList };
      }
      break;
    case CART_LOADING:
      nextState = { ...state, status: "LOADING" };
      break;
    case FINISH_LOADING_CART:
      nextState = {
        ...state,
        status: "LOADED",
        list: list ? list : state.list
      };
      break;
    case MAKING_ORDER:
      nextState = {
        ...state,
        status: "ORDERING"
      };
      break;
    case FINISH_MAKING_ORDER:
      nextState = {
        ...state,
        status: "LOADED"
      };
      break;
    default:
      needValidateCart = false;
  }
  if (needValidateCart) {
    store.setCartList(nextState.list);
  }

  return nextState;
}

export default reducer;
