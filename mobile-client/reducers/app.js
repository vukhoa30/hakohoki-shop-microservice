import { UPDATE_SERVER_ADDRESS, APP_LOADED } from "../actions";
import { gatewayHost, gatewayPort } from "../config";
const initialState = {
  isAppLoaded: false,
  gateway: {
    host: gatewayHost,
    port: gatewayPort
  }
};
const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type, gatewayHost, gatewayPort } = action;
  switch (type) {
    case APP_LOADED:
      nextState = { ...state, isAppLoaded: true }
      break;
    case UPDATE_SERVER_ADDRESS:
      nextState = {
        ...state,
        gateway: {
          host: gatewayHost,
          port: gatewayPort
        }
      };
      break;
  }
  return nextState;
};
export default reducer;
