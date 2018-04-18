import { keys } from "../actions";

const { FINISH_LOADING_APP} = keys;

const initialState = {
  appLoading: true
};

const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type } = action;
  if (type === FINISH_LOADING_APP) nextState = { appLoading: false };
  return nextState;
};

export default reducer;
