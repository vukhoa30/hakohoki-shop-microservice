import { keys } from "../actions";

const {
  LOADING_NOTIFICATIONS,
  SET_NOTIFICATION_STATUS,
  APPEND_NOTIFICATION
} = keys;

const initialState = {
  isFirstLoad: true,
  isLoading: false,
  err: null,
  data: []
};

const reducer = (state = initialState, action) => {
  let nextState = state;
  const { type, data, isLoading, err, notificationId, read } = action;
  if (type === LOADING_NOTIFICATIONS) {
    if (isLoading) nextState = { ...state, isLoading, isFirstLoad: false, err: null };
    else if (err) nextState = { ...state, isLoading, err };
    else nextState = { ...state, isLoading, data };
  } else if (type === SET_NOTIFICATION_STATUS) {
    const newNotifications = state.data;
    const index = newNotifications.findIndex(
      notification => notification.id === notificationId
    );
    if (index > -1) {
      newNotifications[index].read = read;
      nextState = { ...state, data: newNotifications };
    }
  } else if (type === APPEND_NOTIFICATION) {
    const newNotifications = [{ ...data }].concat(state.data);
    nextState = { ...state, data: newNotifications };
  }
  return nextState;
};

export default reducer;
