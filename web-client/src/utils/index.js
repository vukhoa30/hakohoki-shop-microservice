import { gatewayAddress } from "../config";
import { stringify } from "query-string";
import io from "socket.io-client";
import { chain, transform, reduce } from "lodash";
import { code as errCode } from "../api/err-code";

const {
  UNKNOWN_ERROR,
  CONNECTION_ERROR,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  DATA_NOT_FOUND
} = errCode;

export const request = (url, method, header, data) => {
  const fullUrl = gatewayAddress + url;
  return new Promise((resolve, reject) => {
    fetch(fullUrl, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...header
      },
      body: data ? JSON.stringify(data) : null
    })
      .then(res => {
        const status = res.status;
        return new Promise((resolve, reject) => {
          res
            .json()
            .then(data => resolve({ status, data }))
            .catch(error => {
              console.log(error);
              reject("JSON_PARSE_FAILED");
            });
        });
      })
      .catch(error => {
        console.log(error);
        reject("CONNECTION_ERROR");
      })
      .then(data => {
        console.log(`${method} ${url} - ${data ? data.status : "failed"}`);
        resolve(data);
      });
  });
};

export const currencyFormat = currency => {
  return currency && currency !== null
    ? currency.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " VNĐ"
    : "0 VNĐ";
};

export const formatTime = time => {
  const dateObj = new Date(time);
  return dateObj.toLocaleTimeString() + " - " + dateObj.toLocaleDateString();
};

export const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  return (
    year +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (date < 10 ? "0" + date : date)
  );
};

export const parseToQueryString = obj => {
  return stringify(obj);
};

export const parseToObject = queryString => {
  if (queryString === "") return {};
  const query = queryString.substring(1);
  return chain(query.split("&"))
    .map(function(params) {
      var p = params.split("=");
      return [p[0], decodeURIComponent(p[1])];
    })
    .fromPairs()
    .value();
};

export const convertObjectToArray = obj => {
  return transform(
    obj,
    (result, value, key) => {
      result.push({ name: key, value });
    },
    []
  );
};

export const reduceString = string => {
  return string
    ? string.length > 20
      ? string.slice(0, 17) + "..."
      : string
    : "Unknown product";
};

export const createSocketConnection = (
  onConnect,
  onTimeout,
  onError,
  onMessage,
  onDisconnect
) => {
  const socket = io(gatewayAddress + "/notifications", {
    reconnection: false,
    timeout: 5000
  });

  socket.on("connect", onConnect);
  socket.on("connect_timeout", onTimeout);
  socket.on("connect_error", onError);
  socket.on("message", onMessage);
  socket.on("disconnect", onDisconnect);

  return socket;
};

export const buildNotificationText = (notificationType, additionalData) => {
  switch (notificationType) {
    case UNKNOWN_ERROR:
      return "UNKNOWN ERRORS! TRY AGAIN LATER";
    case FORBIDDEN:
      return "YOU ARE NOT AUTHORIZED TO " + additionalData.functionName;
    case CONNECTION_ERROR:
      return "COULD NOT CONNECT TO SERVER! PLEASE CHECK YOUR CONNECTION";
    case DATA_NOT_FOUND:
      return `NO ${
        additionalData.dataName ? additionalData.dataName : ""
      } DATA FOUND`;
    default:
      return "UNDEFINED ERRORS! TRY AGAIN LATER";
  }
};
