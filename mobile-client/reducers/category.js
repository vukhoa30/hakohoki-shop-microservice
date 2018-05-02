import {
  CATEGORY_LOADING,
  CATEGORY_LOADED,
  CATEGORY_LOADING_FAILED
} from "../actions";

const initialState = {
  status: "INIT",
  data: ['Phone','Tablet','Accessory','SIM','Card']
};
const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type, data } = action;
  switch (type) {
    case CATEGORY_LOADING:
      nextState = { ...state, status: "LOADING" };
      break;
    case CATEGORY_LOADED:
      nextState = { status: "LOADED", data };
      break;
    case CATEGORY_LOADING_FAILED:
      nextState = { ...state, status: "LOADING_FAILED" };
      break;
  }
  return nextState;
};
export default reducer;
