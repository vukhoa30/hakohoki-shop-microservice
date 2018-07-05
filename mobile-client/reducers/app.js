import { UPDATE_SERVER_ADDRESS, APP_LOADED, SERVER_ADDRESS_SET_UP } from "../actions";
import { gatewayHost, gatewayPort } from "../config";
const initialState = {
  serverSetUp: false,
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
    case SERVER_ADDRESS_SET_UP:
      nextState = { ...state, serverSetUp: true }
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
