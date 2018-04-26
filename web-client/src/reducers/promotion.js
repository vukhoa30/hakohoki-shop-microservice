import { keys } from "../actions";

const { LOADING_PROMOTION } = keys;

const initialState = {
  isFirstLoad: true,
  isLoading: false,
  err: null,
  data: []
};

const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type, data, isLoading, err } = action;
  if (type === LOADING_PROMOTION) {
    if (isLoading) nextState = { ...initialState, isLoading, isFirstLoad: false };
    else if (err) nextState = { ...state, isLoading, err };
    else nextState = { ...state, isLoading, data };
  }
  return nextState;
};

export default reducer;
