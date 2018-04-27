import { keys } from "../actions";

const { ADD_TOAST } = keys;

const initialState = {
  toast: {
      _id: new Date().getTime(),
      message: 'Welcome to admin page',
      level: 'success'
  }
};

const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type, data } = action;
  if (type === ADD_TOAST) nextState = { toast: data };
  return nextState;
};

export default reducer;
