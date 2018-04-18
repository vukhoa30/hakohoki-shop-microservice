import { getAction, keys } from "../actions";
import { request, parseToQueryString, convertObjectToArray } from "../utils";
import { reduce, transform } from "lodash";
import { push } from "react-router-redux";
import { resolve } from "url";
import { SubmissionError } from "redux-form";

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
  SEARCHING_BILL
} = keys;

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
            comments
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
export const selectProduct = (product, viewType) => {
  return dispatch => {
    product.specifications = convertObjectToArray(product.specifications);
    if (product !== null)
      dispatch(getAction(LOADING_PRODUCT, { isLoading: false, data: product }));
    dispatch(
      push({
        pathname: "/main/product/" + viewType + `/${product._id}`
      })
    );
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
        console.log(token);
        dispatch(getAction(LOG_IN, { account, token }));
      } catch (error) {}
    }
    setTimeout(() => dispatch(getAction(FINISH_LOADING_APP)), 2000);
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
