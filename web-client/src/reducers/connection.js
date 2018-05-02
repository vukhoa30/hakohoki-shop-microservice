import { keys } from "../actions";
const {
  CONNECTION_SETTING,
  CONNECTION_FINISH_SETTING,
  CONNECTION_FAILED
} = keys;
const intialState = {
  isConnected: false,
  isConnecting: false
};
const reducer = (state = intialState, action) => {
  let nextState = state;
  const { type } = action;
  switch (type) {
    case CONNECTION_SETTING:
      nextState = { ...state, isConnecting: true };
      break;
    case CONNECTION_FINISH_SETTING:
      nextState = { isConnecting: false, isConnected: true };
      break;
    case CONNECTION_FAILED:
      nextState = { isConnecting: false, isConnected: false };
      break;
  }
  return nextState;
};
export default reducer;
