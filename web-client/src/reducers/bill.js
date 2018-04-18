import { keys } from "../actions";

const { LOADING_UPCOMING_BILL, SEARCHING_BILL, LOADING_COMPLETED_BILL } = keys;

const initialState = {
  upcoming: {
    isLoading: false,
    data: [],
    err: null
  },
  completed: {
    isLoading: false,
    data: [],
    err: null
  },
  search: {
    isLoading: false,
    data: [],
    err: null
  }
};

const handleData = (prevState, action) => {
  const { isLoading, data, err } = action;
  if (isLoading) return { isLoading, data: [], err: null };
  else if (err) return { ...prevState, isLoading, err };
  else return { ...prevState, isLoading, data };
};

const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type, data } = action;
  switch (type) {
    case LOADING_UPCOMING_BILL:
      nextState = { ...state, upcoming: handleData(state.upcoming, action) };
      break;
    case LOADING_COMPLETED_BILL:
      nextState = { ...state, completed: handleData(state.completed, action) };
      break;
    case SEARCHING_BILL:
      nextState = { ...state, search: handleData(state.search, action) };
      break;
  }
  return nextState;
};

export default reducer;
