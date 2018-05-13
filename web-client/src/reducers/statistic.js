import { keys } from "../actions";

const { LOADING_STATISTIC } = keys;

const initialState = {
  hasData: false,
  isLoading: false,
  billCount: 0,
  revenue: 0,
  soldProductCount: 0,
  categories: [],
  err: null
};

const reducer = (state = initialState, action) => {
  let nextState = state;
  const {
    type,
    isLoading,
    billCount,
    revenue,
    soldProductCount,
    categories,
    err
  } = action;
  if (type === LOADING_STATISTIC) {
    if (isLoading) nextState = { ...state, isLoading, err: null };
    else if (err) nextState = { ...state, isLoading, err };
    else
      nextState = {
        ...state,
        isLoading,
        billCount,
        revenue,
        soldProductCount,
        categories,
        hasData: true
      };
  }
  return nextState;
};

export default reducer;
