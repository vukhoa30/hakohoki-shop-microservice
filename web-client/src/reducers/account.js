import { keys } from "../actions";

const { LOADING_ACCOUNTS } = keys;

const initialState = {
  isLoading: false,
  managers: [],
  employees: [],
  receptionists: [],
  err: null
};

const reducer = (state = initialState, action) => {
  let nextState = state;
  const { isLoading, type, managers, employees, receptionists, err } = action;
  if (type === LOADING_ACCOUNTS) {
    if (isLoading) nextState = { ...initialState, isLoading };
    else if (err) nextState = { ...state, isLoading, err };
    else nextState = { ...state, isLoading, managers, employees, receptionists };
  }
  return nextState;
};

export default reducer;
