import { getAction, keys } from "../actions";
import { request, parseToQueryString, convertObjectToArray } from "../utils";
import { reduce, transform } from "lodash";
import { push } from "react-router-redux";
import { resolve } from "url";
import { SubmissionError } from "redux-form";
import { code as errCode } from "./err-code";
const {
  FINISH_LOADING_APP,
  LOADING_PRODUCT,
  LOADING_PRODUCT_LIST,
  LOADING_PRODUCT_FEEDBACK,
  ADD_TOAST,
  LOG_IN,
  LOG_OUT,
  LOADING_UPCOMING_BILL,
  LOADING_COMPLETED_BILL,
  SEARCHING_BILL,
  SELECT_BILL,
  LOADING_ACCOUNTS,
  LOADING_NOTIFICATIONS,
  SET_NOTIFICATION_STATUS,
  LOADING_PROMOTION
} = keys;

const {
  UNKNOWN_ERROR,
  CONNECTION_ERROR,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  DATA_NOT_FOUND
} = errCode;

/* PRODUCT */
export const fetchProductData = async productId => {
  try {
    const { status, data } = await request(
      "/products/info/" + productId,
      "GET",
      {}
    );
    if (status === 200) {
      return Promise.resolve({ ok: true, data });
    }
  } catch (error) {}
  return Promise.resolve({ ok: false });
};
export const loadProductData = productId => {
  return async dispatch => {
    let err = "undefined error";
    dispatch(
      getAction(LOADING_PRODUCT, {
        isLoading: true
      })
    );
    try {
      const { status, data } = await request(
        "/products/info/" + productId,
        "GET",
        {}
      );
      if (status === 200) {
        data.specifications = convertObjectToArray(data.specifications);
        return dispatch(getAction(LOADING_PRODUCT, { isLoading: false, data }));
      }
      err = "Internal server error";
    } catch (error) {
      err = error;
    }

    dispatch(getAction(LOADING_PRODUCT, { isLoading: false, err }));
  };
};

export const loadProductFeedback = productId => {
  return async dispatch => {
    let err = "undefined error";
    dispatch(
      getAction(LOADING_PRODUCT_FEEDBACK, {
        isLoading: true
      })
    );
    try {
      const { status, data } = await request("/comments/" + productId, "GET");
      if (status === 200) {
        const { reviews, comments } = reduce(
          data,
          (result, current) => {
            result[current.reviewScore ? "reviews" : "comments"].push(current);
            return result;
          },
          { reviews: [], comments: [] }
        );
        dispatch(
          getAction(LOADING_PRODUCT_FEEDBACK, {
            isLoading: false,
            reviews,
            comments,
            _id: productId
          })
        );
      }
      err = "Internal server error";
    } catch (error) {
      err = error;
    }

    dispatch(getAction(LOADING_PRODUCT_FEEDBACK, { isLoading: false, err }));
  };
};
export const loadProductList = (query, offset, limit) => {
  return async dispatch => {
    let err = "undefined error";
    dispatch(
      getAction(LOADING_PRODUCT_LIST, {
        isLoading: true,
        needRefreshing: offset === 0
      })
    );
    try {
      if (query === "") query = "?";
      else query += "&";
      const { status, data } = await request(
        "/products/search" + query + `offset=${offset}&limit=${limit}`,
        "GET"
      );
      if (status === 200)
        return dispatch(
          getAction(LOADING_PRODUCT_LIST, { isLoading: false, data })
        );
      err = "Internal server error";
    } catch (error) {
      err = error;
    }

    dispatch(getAction(LOADING_PRODUCT_LIST, { isLoading: false, err }));
  };
};
export const selectProduct = product => {
  return dispatch => {
    product.specifications = convertObjectToArray(product.specifications);
    if (product !== null)
      dispatch(getAction(LOADING_PRODUCT, { isLoading: false, data: product }));
    dispatch(push("/main/product/detail/" + product._id));
  };
};
/* */

export const addProduct = values => {
  console.log(values);
};

export const toast = (message, level) => dispatch =>
  dispatch(
    getAction(ADD_TOAST, {
      data: { _id: new Date().getTime(), message, level }
    })
  );

export const authenticate = async (values, onSubmitSuccess) => {
  let _error = "Undefined error. Try again later!";
  try {
    const { status, data } = await request(
      "/employees/login",
      "POST",
      {},
      values
    );
    if (status === 200) {
      return Promise.resolve(onSubmitSuccess(data.account, data.token));
    } else {
      _error = "Internal server error";
    }
  } catch (error) {
    console.log(error);
    if (error === "CONNECTION_ERROR") _error = "Connection error";
  }
  return Promise.reject(new SubmissionError({ _error }));
};

export const createAccount = async (values, token, onSubmitSuccess) => {
  let err = "Undefined error! Try again later";
  try {
    console.log(values);
    const { status } = await request(
      "/employees/",
      "POST",
      { Authorization: "JWT " + token },
      { ...values, retypePassword: undefined }
    );
    if (status === 200) return Promise.resolve(onSubmitSuccess());
    else if (status === 401) err = "Only manager can create employee account";
    else if (status === 500) err = "Internal server error! Try again later";
  } catch (error) {
    if (error === "CONNECTION_ERROR") err = "Connection error! Try again later";
  }
  return Promise.reject(new SubmissionError({ _error: err }));
};

export const logIn = (account, token) => {
  return dispatch => {
    localStorage.setItem("@User:info", JSON.stringify({ account, token }));
    dispatch(getAction(LOG_IN, { account, token }));
  };
};

export const logOut = url => {
  return dispatch => {
    localStorage.removeItem("@User:info");
    dispatch(getAction(LOG_OUT));
    dispatch(
      push({
        pathname: "/login",
        state: url
          ? {
              from: url
            }
          : undefined
      })
    );
  };
};

export const loadUserInfo = () => {
  return dispatch => {
    const infoString = localStorage.getItem("@User:info");
    if (infoString !== null) {
      try {
        const { account, token } = JSON.parse(infoString);
        console.log(account);
        dispatch(getAction(LOG_IN, { account, token }));
      } catch (error) {}
    }
    setTimeout(() => dispatch(getAction(FINISH_LOADING_APP)), 50);
  };
};

export const searchForBills = (query, billType, token) => {
  return async dispatch => {
    const billAction =
      billType === "pending"
        ? LOADING_UPCOMING_BILL
        : billType === "completed"
          ? LOADING_COMPLETED_BILL
          : SEARCHING_BILL;
    let err = "Undefined error";
    dispatch(getAction(billAction, { isLoading: true }));
    try {
      const { status, data } = await request(`/bills${query}`, "GET", {
        Authorization: "JWT " + token
      });
      if (status === 200)
        return dispatch(
          getAction(billAction, {
            isLoading: false,
            data: data.map(bill => ({
              ...bill,
              totalPrice: bill.specificProducts.reduce(
                (total, product) => total + product.price,
                0
              )
            }))
          })
        );
      else if (status === 401) {
        dispatch(toast(`YOU ARE NOT AUTHORIZED TO LOAD DATA`, "warning"));
        err = "Unauthorized";
      } else if (status === 500) {
        if (data.err === "data not found")
          return dispatch(
            getAction(billAction, {
              isLoading: false,
              data: []
            })
          );
        err = "Internal server error";
      }
    } catch (error) {
      err = error;
    }
    dispatch(getAction(billAction, { isLoading: false, err }));
  };
};

export const selectBill = (bill, token) => {
  return async dispatch => {
    if (!token) {
      dispatch(getAction(SELECT_BILL, { isLoading: true, data: bill }));
      return dispatch(push("/main/bill/detail/" + bill._id));
    }
    dispatch(getAction(SELECT_BILL, { isLoading: true }));
    let err = UNKNOWN_ERROR;
    try {
      const { status, data } = await request("/bills/" + bill._id, "GET", {
        Authorization: "JWT " + token
      });
      if (status === 200)
        return dispatch(
          getAction(SELECT_BILL, {
            isLoading: false,
            data: {
              ...data,
              totalPrice: data.specificProducts.reduce(
                (total, product) => total + product.price,
                0
              )
            }
          })
        );
      else if (status === 401) err = FORBIDDEN;
      else if (status === 500) {
        if (data.err === "data not found") err = DATA_NOT_FOUND;
        else err = INTERNAL_SERVER_ERROR;
      }
    } catch (error) {
      err = error;
    }
    dispatch(getAction(SELECT_BILL, { isLoading: false, err }));
  };
};

export const getBill = async (billId, token) => {
  try {
    const { status, data } = await request("/bills/" + billId, "GET", {
      Authorization: "JWT " + token
    });
    if (status === 200)
      return Promise.resolve({
        ok: true,
        data: {
          ...data,
          totalPrice: data.specificProducts.reduce(
            (total, product) => total + product.price,
            0
          )
        }
      });
    return Promise.resolve({ ok: false, status });
  } catch (error) {}
  return Promise.resolve({ ok: false, status: 500 });
};

export const confirmBill = async (billId, token) => {
  try {
    const { status, data } = await request(
      "/bills/order",
      "PUT",
      {
        Authorization: "JWT " + token
      },
      { billId }
    );
    if (status === 200)
      return Promise.resolve({
        ok: true
      });
    return Promise.resolve({ ok: false, status });
  } catch (error) {
    return Promise.resolve({
      ok: false,
      status: error === "CONNECTION_ERROR" ? 0 : -1
    });
  }
};

export const giveAnswer = async (productId, content, parentId, token) => {
  let _error = "Undefined error. Try again later!";
  try {
    const { status, data } = await request(
      "/comments",
      "POST",
      { Authorization: "JWT " + token },
      {
        productId,
        content,
        parentId
      }
    );
    if (status === 200) {
      return Promise.resolve({ ok: true });
    } else if (status === 401) {
      _error = "You are not authorized to comment";
    } else {
      _error = "Internal server error";
    }
  } catch (error) {
    if (error === "CONNECTION_ERROR") _error = "Connection error";
  }
  return Promise.resolve({ ok: false, _error });
};

export const loadAccounts = token => {
  return async dispatch => {
    dispatch(getAction(LOADING_ACCOUNTS, { isLoading: true }));
    let err = UNKNOWN_ERROR;
    try {
      const { status, data } = await request("/employees", "GET", {
        Authorization: "JWT " + token
      });
      if (status === 200) {
        console.log(data);
        const { managers, employees, receptionists } = transform(
          data,
          (result, account) => {
            if (account.role === "manager") result["managers"].push(account);
            else if (account.role === "receptionist")
              result["receptionists"].push(account);
            else result["employees"].push(account);
            return result;
          },
          {
            employees: [],
            receptionists: [],
            managers: []
          }
        );
        return dispatch(
          getAction(LOADING_ACCOUNTS, {
            isLoading: false,
            managers,
            employees,
            receptionists
          })
        );
      } else if (status === 401) err = FORBIDDEN;
      else err = INTERNAL_SERVER_ERROR;
    } catch (error) {
      err = error;
    }
    dispatch(getAction(LOADING_ACCOUNTS, { isLoading: false, err }));
  };
};

export const setAccountStatus = async (accountStatus, email, token) => {
  let _error = UNKNOWN_ERROR;
  try {
    const { status } = await request(
      "/employees/" + accountStatus,
      "PUT",
      { Authorization: "JWT " + token },
      { email }
    );
    if (status === 200) {
      return Promise.resolve({ ok: true });
    } else if (status === 401) {
      _error = FORBIDDEN;
    } else {
      _error = INTERNAL_SERVER_ERROR;
    }
  } catch (error) {
    _error = error;
  }
  return Promise.resolve({ ok: false, _error });
};

export const loadNotifications = token => {
  return async dispatch => {
    dispatch(getAction(LOADING_NOTIFICATIONS, { isLoading: true }));
    let err = UNKNOWN_ERROR;

    try {
      const { status, data } = await request("/notifications", "GET", {
        Authorization: "JWT " + token
      });
      if (status === 200) {
        return dispatch(
          getAction(LOADING_NOTIFICATIONS, {
            isLoading: false,
            data
          })
        );
      } else if (status === 401) err = FORBIDDEN;
      else err = INTERNAL_SERVER_ERROR;
    } catch (error) {
      err = error;
    }

    dispatch(getAction(LOADING_NOTIFICATIONS, { isLoading: false, err }));
  };
};

export const setNotificationAsRead = (notificationId, token) => {
  return async dispatch => {
    dispatch(
      getAction(SET_NOTIFICATION_STATUS, { notificationId, read: true })
    );

    try {
      const { status } = await request(
        "/notifications/read",
        "PUT",
        {
          Authorization: "JWT " + token
        },
        [notificationId]
      );
      if (status === 200) return;
    } catch (error) {}

    dispatch(
      getAction(SET_NOTIFICATION_STATUS, { notificationId, read: false })
    );
  };
};

export const loadPromotions = () => {
  return async dispatch => {
    dispatch(getAction(LOADING_PROMOTION, { isLoading: true }));
    let err = UNKNOWN_ERROR;

    try {
      const { status, data } = await request("/promotions", "GET");
      if (status === 200) {
        return dispatch(
          getAction(LOADING_PROMOTION, {
            isLoading: false,
            data
          })
        );
      } else err = INTERNAL_SERVER_ERROR;
    } catch (error) {
      err = error;
    }

    dispatch(getAction(LOADING_PROMOTION, { isLoading: false, err }));
  };
};
