import { keys } from "../actions";
const { LOADING_SUBSCRIBED_PRODUCTS, REMOVE_SUBSCRIBED_PRODUCTS } = keys;
const initialState = {
  isLoading: false,
  err: null,
  data: []
};
const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type, isLoading, err, data } = action;
  switch (type) {
    case LOADING_SUBSCRIBED_PRODUCTS:
      if (isLoading) nextState = { ...state, isLoading: true, err: null };
      else if (err) nextState = { ...state, isLoading: false, err };
      else nextState = { ...state, isLoading: false, data };
      break;
    case REMOVE_SUBSCRIBED_PRODUCTS:
      break;
  }
  return nextState;
};
export default reducer;
