import {
  request,
  parseToQueryString,
  delay,
  alert,
  createSocketConnection,
  updateGateway
} from "../utils";
import navigator from "../navigations";
import {
  getAction,
  UPDATE_SERVER_ADDRESS,
  USER_LOG_IN,
  USER_LOG_OUT,
  CATEGORY_LOADING,
  CATEGORY_LOADED,
  CATEGORY_LOADING_FAILED,
  SELECT_PRODUCT,
  SELECT_CATEGORY,
  PRODUCT_DATA_LOADING,
  PRODUCT_DATA_LOADED,
  PRODUCT_DATA_LOADING_FAILED,
  PRODUCT_DATA_UPDATE_WATCH_LIST_STATE,
  REVIEW_PRODUCT,
  FEEDBACK_LOADING,
  FEEDBACK_LOADED,
  FEEDBACK_LOADING_FAILED,
  NOTIFICATION_LOADING,
  NOTIFICATION_LOADING_FAILED,
  NOTIFICATION_LOADED,
  SET_NOTIFICATION_STATUS,
  APPEND_NOTIFICATION,
  CONNECTION_STATUS_SETTING,
  CART_LOADING,
  FINISH_LOADING_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  REMOVE_ALL,
  MAKING_ORDER,
  FINISH_MAKING_ORDER,
  MODIFY_CART_PRODUCT,
  PROMOTION_LOADING,
  PROMOTION_LOADING_FAILED,
  PROMOTION_LOADED,
  SAVE_TO_BUFFER,
  WATCH_LIST_LOADING
} from "../actions";

import { SubmissionError } from "redux-form";
import { reduce, assign, transform } from "lodash";
import { NavigationActions } from "react-navigation";
import { AsyncStorage } from "react-native";

var socket = null;

function updateServerAddress(host, port, isLoggedIn, accountId) {
  return dispatch => {
    updateGateway(host, port);
    if (socket !== null) {
      socket.disconnect();
      dispatch(connectToServer(accountId));
    }
    dispatch(
      getAction(UPDATE_SERVER_ADDRESS, { gatewayHost: host, gatewayPort: port })
    );
  };
}

function navigate(path, params) {
  return dispatch =>
    dispatch(navigator.router.getActionForPathAndParams(path, params));
}

function disconnect() {
  if (socket !== null) socket.disconnect();
}

function connectToServer(accountId) {
  return async dispatch => {
    dispatch(
      getAction(CONNECTION_STATUS_SETTING, { connectionStatus: "CONNECTING" })
    );
    socket = createSocketConnection(
      () => {
        console.log("Connected");
        if (socket !== null) {
          socket.emit("give-accountid", accountId);
          dispatch(
            getAction(CONNECTION_STATUS_SETTING, {
              connectionStatus: "CONNECTED"
            })
          );
        }
      },
      () => {
        console.log("Connection timeout");
        dispatch(
          getAction(CONNECTION_STATUS_SETTING, {
            connectionStatus: "NOT_CONNECTED"
          })
        );
      },
      () => {
        console.log("Connection error");
        dispatch(
          getAction(CONNECTION_STATUS_SETTING, {
            connectionStatus: "NOT_CONNECTED"
          })
        );
      },
      data => {
        console.log(data);
        dispatch(getAction(APPEND_NOTIFICATION, { data }));
      },
      () => {
        console.log("Disconnected");
        dispatch(
          getAction(CONNECTION_STATUS_SETTING, {
            connectionStatus: "NOT_CONNECTED"
          })
        );
        socket = null;
      }
    );
  };
}

function loadUserInfo() {
  return dispatch => {
    AsyncStorage.multiGet(["@User:token", "@User:account"], (err, values) => {
      console.log(values);
      if (values[0][1] === null) return;

      const { token, accountString } = reduce(
        values,
        (result, item) => {
          switch (item[0]) {
            case "@User:token":
              result["token"] = item[1];
              break;
            case "@User:account":
              result["accountString"] = item[1];
              break;
          }

          return result;
        },
        {
          token: null,
          accountString: null
        }
      );

      let account = {
        name: "Unknown",
        email: "Unknown",
        phoneNumber: "Unknown"
      };

      try {
        account = JSON.parse(accountString);
      } catch (error) {
        console.log(error);
      }

      dispatch(logIn(token, account));
    });
  };
}

function logIn(token, account) {
  return dispatch => {
    dispatch(connectToServer(account.accountId));
    dispatch(loadNotifications(token));
    dispatch(loadCart(token));
    dispatch(getAction(USER_LOG_IN, { token, account }));
  };
}

function logOut() {
  return dispatch => {
    if (socket !== null) socket.disconnect();
    AsyncStorage.multiRemove(["@User:token", "@User:account"]);
    dispatch(getAction(USER_LOG_OUT));
    dispatch(navigator.router.getActionForPathAndParams("Account/LogIn"));
  };
}

function authenticate(values) {
  return new Promise(async (resolve, reject) => {
    let err = `Undefined error, try again later!`;
    const { emailOrPhoneNo, password } = values;
    try {
      const response = await request(
        "/accounts/authentication",
        "POST",
        {},
        { emailOrPhoneNo, password }
      );
      const { status, data } = response;
      const { logIn, navigation } = this.props;
      const lastScreen = navigation.state.params
        ? navigation.state.params.lastScreen
        : null;
      switch (status) {
        case 200:
          logIn(data.token, data.account);
          AsyncStorage.multiSet(
            [
              ["@User:token", data.token],
              ["@User:account", JSON.stringify(data.account)]
            ],
            errors => console.log("Error" + errors)
          );
          navigation.dispatch(NavigationActions.back());
          return resolve();
        case 401:
          if (data.msg === "ACCOUNT NOT ACTIVATED") {
            navigation.navigate("Activation", { emailOrPhoneNo });
            err = "Your account has not been activated yet";
          } else err = "Password wrong";
          break;
        case 404:
          err = "The account is not existed!";
          break;
        case 500:
          err = "Internal server error! Try again later";
          break;
      }
    } catch (error) {
      console.log(error);
      if (error === "CONNECTION_ERROR") err = "Could not connect to server";
    }

    reject(new SubmissionError({ _error: err }));
  });
}

function enroll(values) {
  return new Promise(async (resolve, reject) => {
    let err = `Undefined error, try again later!`;
    const { email, password, fullName, phoneNumber } = values;
    try {
      const response = await request(
        "/accounts/",
        "POST",
        {},
        { email, password, fullName, phoneNumber }
      );
      const { status, data } = response;
      const { navigation } = this.props;

      switch (status) {
        case 200:
          navigation.navigate("Activation", { email });
          return resolve();
        case 409:
          err = "The email was registered";
          break;
        case 500:
          err = "Internal server error! Try again later";
          break;
      }
    } catch (error) {
      if (error === "CONNECTION_ERROR") err = "Could not connect to server";
    }

    reject(new SubmissionError({ _error: err }));
  });
}

function activate(values) {
  return new Promise(async (resolve, reject) => {
    let err = `Undefined error, try again later!`;
    const { activationCode } = values;
    const { navigation } = this.props;

    try {
      const response = await request(
        "/accounts/activation",
        "POST",
        {},
        {
          emailOrPhoneNo: navigation.state.params.emailOrPhoneNo,
          activationCode
        }
      );
      const { status, data } = response;

      switch (status) {
        case 200:
          navigation.navigate(NavigationActions.back());
          return resolve();
        case 401:
          err = "Activation code is wrong";
          break;
        case 500:
          err = "Internal server error! Try again later";
          break;
      }
    } catch (error) {
      if (error === "CONNECTION_ERROR") err = "Could not connect to server";
    }

    reject(new SubmissionError({ _error: err }));
  });
}

function saveToBuffer(data) {
  return dispatch => dispatch(getAction(SAVE_TO_BUFFER, { data }));
}

function loadCategories() {
  return async dispatch => {
    try {
      dispatch(getAction(CATEGORY_LOADING));
      const response = await request("/products/categories", "GET", {});
      const { status, data } = response;

      if (status === 200) return dispatch(getAction(CATEGORY_LOADED, { data }));
      resolve({
        ok: true,
        list: data.map(item => {
          let icon = "info";

          switch (item) {
            case "Phone":
              icon = "md-phone-portrait";
              break;
            case "Tablet":
              icon = "md-tablet-portrait";
              break;
            case "Accessory":
              icon = "md-headset";
              break;
            case "SIM":
              icon = "ios-card";
              break;
            case "Card":
              icon = "md-card";
              break;
          }

          return {
            name: item,
            icon
          };
        })
      });
    } catch (error) {}

    dispatch(getAction(CATEGORY_LOADING_FAILED));
  };
}

function selectCategory(category) {
  return dispatch => {
    dispatch(getAction(SELECT_CATEGORY, { category }));
  };
}

function loadProductList(conditions, offset, limit) {
  return new Promise(async resolve => {
    if (conditions.category === "All") conditions.category = undefined;
    const url =
      "/products/" +
      (conditions.category === "Latest"
        ? "latest?"
        : "search?" + parseToQueryString(conditions) + "&");

    try {
      const response = await request(
        `${url}offset=${offset}&limit=${limit}`,
        "GET",
        {}
      );
      const { status, data } = response;
      if (status === 200) resolve({ ok: true, data });
    } catch (error) {}

    resolve({ ok: false });
  });
}

function selectProduct(productId) {
  return dispatch => {
    dispatch(getAction(SELECT_PRODUCT, { productId }));
    dispatch(
      navigator.router.getActionForPathAndParams("ProductDetail/Information")
    );
  };
}

function loadProductInformation(productId, token) {
  return async dispatch => {
    dispatch(getAction(PRODUCT_DATA_LOADING));

    try {
      const response = await request(`/products/info/${productId}`, "GET", {
        Authorization: "JWT " + token
      });
      const { status, data } = response;

      if (status === 200) {
        if (data.reviewScore)
          data.reviewScore = Math.round(data.reviewScore, 1);
        return dispatch(getAction(PRODUCT_DATA_LOADED, { data }));
      }
    } catch (error) {
      console.log(error);
    }

    dispatch(getAction(PRODUCT_DATA_LOADING_FAILED));
  };
}

function loadProductFeedback(productId) {
  return async dispatch => {
    try {
      dispatch(getAction(FEEDBACK_LOADING));
      const response = await request(`/comments/${productId}`, "GET", {});
      const { status, data } = response;

      if (status === 200) {
        const { reviews, comments } = reduce(
          data,
          (result, item) => {
            if (item.reviewScore) result["reviews"].push(item);
            else result["comments"].push(item);

            return result;
          },
          { reviews: [], comments: [] }
        );

        const statistic = reduce(
          reviews,
          (result, review) => {
            result[review.reviewScore]++;
            return result;
          },
          {
            "5": 0,
            "4": 0,
            "3": 0,
            "2": 0,
            "1": 0
          }
        );

        const { questions, answers } = reduce(
          comments,
          (result, comment) => {
            result[comment.parentId ? "answers" : "questions"].push(comment);
            return result;
          },
          {
            questions: [],
            answers: []
          }
        );

        return dispatch(
          getAction(FEEDBACK_LOADED, {
            reviews,
            comments,
            questions,
            answers,
            statistic
          })
        );
      }
    } catch (error) {
      console.log(error);
    }

    dispatch(getAction(FEEDBACK_LOADING_FAILED));
  };
}

function reviewProduct() {
  return dispatch => dispatch(getAction(REVIEW_PRODUCT));
}

function sendReview(values) {
  return new Promise(async (resolve, reject) => {
    let err = `Undefined error, try again later!`;
    const content = values.review;
    const reviewScore = this.state.starCount;
    const {
      productId,
      logOut,
      token,
      loadProductFeedback,
      loadProductInformation,
      reviewProduct
    } = this.props;
    try {
      const response = await request(
        "/comments",
        "POST",
        { Authorization: "JWT " + token },
        { productId, content, reviewScore }
      );
      const { status, data } = response;

      switch (status) {
        case 200:
          loadProductFeedback(productId);
          loadProductInformation(productId, token);
          reviewProduct();
          return resolve();
        case 401:
          err = "Authenticate user failed! Please log in again";
          logOut();
          break;
        case 500:
          err = "Internal server error! Try again later";
          break;
      }
    } catch (error) {
      console.log(error);
      if (error === "CONNECTION_ERROR") err = "Could not connect to server";
    }

    reject(new SubmissionError({ _error: err }));
  });
}

async function sendComment(values) {
  let hasError = false;
  let err = `Undefined error, try again later!`;
  this.setState({ submitting: true });
  try {
    const content = this.state.comment;
    const {
      token,
      productId,
      parentId,
      loadProductFeedback,
      logOut
    } = this.props;
    const response = await request(
      "/comments",
      "POST",
      { Authorization: "JWT " + token },
      { productId, content, parentId }
    );
    const { status, data } = response;

    switch (status) {
      case 200:
        loadProductFeedback(productId);
        this.setState({ comment: "" });
        break;
      case 401:
        err = "Authenticate user failed! Please log in again";
        logOut();
        hasError = true;
        break;
      case 500:
        err = "Internal server error! Try again later";
        hasError = true;
        break;
    }
  } catch (error) {
    hasError = true;
    console.log(error);
    if (error === "CONNECTION_ERROR") err = "Could not connect to server";
  }
  if (hasError) alert("Error", err);
  this.setState({ submitting: false });
}

async function loadAnswers(productId, parentId) {
  try {
    this.setState({ status: "LOADING" });

    const response = await request(`/comments/${productId}`, "GET", {});

    const { status, data } = response;

    if (status === 200) {
      return this.setState({
        status: "LOADED",
        replies: data.filter(comment => comment.parentId === parentId)
      });
    }
  } catch (error) {}

  alert("Error", `Can't comment now!`);
  this.setState({ status: "LOADED" });
}

function loadCart(token) {
  return async dispatch => {
    try {
      dispatch(getAction(CART_LOADING));
      const { status, data } = await request("/carts", "GET", {
        Authorization: "JWT " + token
      });
      if (status === 200)
        return dispatch(getAction(FINISH_LOADING_CART, { list: data }));
    } catch (error) {}

    dispatch(getAction(FINISH_LOADING_CART));
  };
}

function setCart(token, product, type, amount) {
  return async dispatch => {
    try {
      dispatch(getAction(CART_LOADING));
      const method =
        type === "ADD" ? "POST" : type === "REMOVE" ? "DELETE" : "PUT";
      const actionKey =
        type === "ADD"
          ? ADD_TO_CART
          : type === "REMOVE"
            ? REMOVE_FROM_CART
            : MODIFY_CART_PRODUCT;
      const data = {
        productId: product._id,
        amount
      };
      if (token === null)
        dispatch(
          getAction(actionKey, {
            productId: product._id,
            number: amount,
            data: product
          })
        );
      else {
        const { status } = await request(
          "/carts",
          method,
          { Authorization: "JWT " + token },
          data
        );
        if (status === 200)
          dispatch(
            getAction(actionKey, {
              productId: product._id,
              number: amount,
              data: product
            })
          );
      }
    } catch (error) {}
    dispatch(getAction(FINISH_LOADING_CART));
  };
}

function updateWatchListStateOfProduct(existsInWatchlist) {
  return async dispatch => {
    dispatch(
      getAction(PRODUCT_DATA_UPDATE_WATCH_LIST_STATE, { existsInWatchlist })
    );
  };
}

async function updateWatchList(type) {
  const {
    product,
    token,
    logOut,
    loadWatchList,
    watchList,
    updateWatchListStateOfProduct
  } = this.props;
  this.setState({ isWatchListUpdating: true });

  if (token === null) {
    logOut();
  }

  try {
    const response = await request(
      `/watchlists/${product._id}`,
      type === "ADD" ? "POST" : "DELETE",
      { Authorization: "JWT " + token }
    );
    const { status } = response;

    if (status === 200) {
      if (watchList.length > 0) {
        loadWatchList(token, 0, watchList.length);
      }
      updateWatchListStateOfProduct(type === "ADD");
      alert(
        "Success",
        type === "ADD"
          ? "Add product to watch list successfully"
          : "Remove product from watch list successfully"
      );
    } else if (status === 401) {
      alert("Authentication failed", "Please log in");
      return logOut();
    } else {
      alert(
        "Error",
        `Could not ${
          type === "ADD"
            ? "add product to your watch list!"
            : "remove product from your watch list!"
        } Please try again.`
      );
    }
  } catch (error) {}

  this.setState({ isWatchListUpdating: false });
}

function removeFromWatchlist(productId, token, offset, limit) {
  return async dispatch => {
    if (token === null) {
      alert("Authentication failed", "You need to log in first");
      dispatch(logOut());
      return;
    }

    dispatch(getAction(WATCH_LIST_LOADING, { status: "LOADING" }));

    try {
      let response = await request(`/watchlists/${productId}`, "DELETE", {
        Authorization: "JWT " + token
      });
      let { status, data } = response;

      if (status === 200) {
        response = await request(
          `/watchlists?offset=${offset}&limit=${limit}`,
          "GET",
          { Authorization: "JWT " + token }
        );
        status = response.status;
        data = response.data;
        if (status === 200) {
          alert("Success", "The product has been removed from your watch list");
          return dispatch(
            getAction(WATCH_LIST_LOADING, { status: "LOADED", data })
          );
        } else {
          alert("Errors", "Some errors occur. Please try again later!");
        }
      } else {
        if (status === 401) {
          alert("Authentication failed", "You need to log in first");
          dispatch(logOut());
        } else {
          alert(
            "Remove from watch list failed",
            "The product may not exist in your watch list"
          );
        }
      }
    } catch (error) {}

    dispatch(getAction(WATCH_LIST_LOADING, { status: "LOADING_FAILED" }));
  };
}

function loadWatchList(token, offset, limit) {
  return async dispatch => {
    dispatch(getAction(WATCH_LIST_LOADING, { status: "LOADING" }));
    try {
      const response = await request(
        `/watchlists?offset=${offset}&limit=${limit}`,
        "GET",
        { Authorization: "JWT " + token }
      );
      const { status, data } = response;

      if (status === 200) {
        return dispatch(
          getAction(WATCH_LIST_LOADING, { status: "LOADED", data })
        );
      }
    } catch (error) {
      console.log(error);
    }

    dispatch(getAction(WATCH_LIST_LOADING, { status: "LOADING_FAILED" }));
  };
}

function loadNotifications(token) {
  return async dispatch => {
    dispatch(getAction(NOTIFICATION_LOADING));
    try {
      const response = await request("/notifications", "GET", {
        Authorization: "JWT " + token
      });
      const { status, data } = response;

      if (status === 200) {
        return dispatch(getAction(NOTIFICATION_LOADED, { status, data }));
      } else if (status === 401) {
        dispatch(logOut());
        alert("Authentication failed", "Please log in again!");
      }
    } catch (error) {}
    dispatch(getAction(NOTIFICATION_LOADING_FAILED));
  };
}

function makeNotificationAsRead(token, notificationId) {
  return async dispatch => {
    console.log(notificationId);
    dispatch(
      getAction(SET_NOTIFICATION_STATUS, { notificationId, read: true })
    );

    try {
      const response = await request(
        "/notifications/read",
        "PUT",
        { Authorization: "JWT " + token },
        [notificationId]
      );
      const { status } = response;

      if (status === 200) {
        return;
      } else if (status === 401) {
        dispatch(logOut());
        alert("Authentication failed", "Please log in again!");
      }
    } catch (error) {
      console.log(error);
    }

    dispatch(
      getAction(SET_NOTIFICATION_STATUS, { notificationId, read: false })
    );
  };
}

function viewAnswers(productId, commentId) {
  return async dispatch => {
    console.log("Get here");
    if (!commentId) return;
    dispatch(loadProductFeedback(productId));
    dispatch(
      NavigationActions.navigate({
        routeName: "Answers",
        params: { parentId: commentId, productId }
      })
    );
  };
}

function loadPromotion() {
  return async dispatch => {
    dispatch(getAction(PROMOTION_LOADING));

    try {
      const response = await request("/promotions", "GET", {});
      const { status, data } = response;

      if (status === 200)
        return dispatch(getAction(PROMOTION_LOADED, { list: data }));
    } catch (error) {
      console.log(error);
    }

    dispatch(getAction(PROMOTION_LOADING_FAILED));
  };
}

function makeOrder(productList, token) {
  return async dispatch => {
    dispatch(getAction(MAKING_ORDER));
    let err = "Could not make order now! Try again later";
    try {
      const { status } = await request(
        "/bills/order",
        "POST",
        { Authorization: "JWT " + token },
        productList
      );
      if (status === 200) {
        alert(
          "Success",
          "Order successfully! We will contact you soon to confirm your order"
        );
        return dispatch(getAction(REMOVE_ALL));
      } else if (status === 401)
        err = "Authentication failed! Please log in again";
    } catch (error) {
      if (error === "CONNECTION_ERROR")
        err = "Could not connect to server! Try again later";
    }
    alert("Error", err);
    dispatch(getAction(FINISH_MAKING_ORDER));
  };
}

module.exports = {
  updateServerAddress,
  navigate,
  connectToServer,
  authenticate,
  enroll,
  activate,
  loadUserInfo,
  saveToBuffer,
  logIn,
  logOut,
  loadCategories,
  loadProductList,
  selectProduct,
  selectCategory,
  loadProductInformation,
  loadProductFeedback,
  reviewProduct,
  sendReview,
  sendComment,
  loadAnswers,
  setCart,
  loadWatchList,
  updateWatchListStateOfProduct,
  updateWatchList,
  removeFromWatchlist,
  makeNotificationAsRead,
  loadNotifications,
  viewAnswers,
  loadPromotion,
  loadCart,
  disconnect,
  makeOrder
};
