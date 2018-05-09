export const keys = {
  LOADING_PRODUCT: "LOADING_PRODUCT_DETAIL",
  LOADING_PRODUCT_LIST: "LOADING_PRODUCT_LIST",
  LOADING_PRODUCT_FEEDBACK: "LOADING_PRODUCT_FEEDBACK",

  ADD_TOAST: "ADD_TOAST",

  LOG_IN: "LOG_IN",
  LOG_OUT: "LOG_OUT",

  FINISH_LOADING_APP: "FINISH_LOADING_APP",

  LOADING_UPCOMING_BILL: "LOADING_UPCOMING_BILL",
  LOADING_COMPLETED_BILL: "LOADING_COMPLETED_BILL",
  SEARCHING_BILL: "SEARCHING_BILL",
  SELECT_BILL: "SELECT_BILL",

  LOADING_ACCOUNTS: "LOADING_ACCOUNTS",

  APPEND_NOTIFICATION: "APPEND_NOTIFICATION",
  LOADING_NOTIFICATIONS: "LOADING_NOTIFICATIONS",
  SET_NOTIFICATION_STATUS: "SET_NOTIFICATION_STATUS",

  LOADING_PROMOTION: "LOADING_PROMOTION",

  LOADING_STATISTIC: "LOADING_STATISTIC",

  CONNECTION_SETTING: "CONNECTION_SETTING",
  CONNECTION_FINISH_SETTING: "CONNECTION_FINISH_SETTING",
  CONNECTION_FAILED: "CONNECTION_FAILED",

  LOADING_SUBSCRIBED_PRODUCTS: "LOADING_SUBSCRIBED_PRODUCTS",
  REMOVE_SUBSCRIBED_PRODUCTS: "REMOVE_SUBSCRIBED_PRODUCTS"
};

export const getAction = (type, data) => {
  return {
    type,
    ...data
  };
};
