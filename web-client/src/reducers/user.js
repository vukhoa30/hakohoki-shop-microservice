import { keys } from "../actions";

const { LOG_IN, LOG_OUT } = keys;

const initialState = {
  isLoggedIn: false,
  email: null,
  accountId: null,
  fullName: null,
  phone_number: null,
  role: "unknown",
  token: null
};

const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type, account, token } = action;
  switch (type) {
    case LOG_IN:
      nextState = { isLoggedIn: true, ...account, token };
      break;
    case LOG_OUT:
      nextState = initialState;
      break;
  }
  return nextState;
};

export default reducer;
