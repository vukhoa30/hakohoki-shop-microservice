import { gatewayAddress } from "../config";
import { stringify } from "query-string";
import io from "socket.io-client";

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
  return (
    currency.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " VND"
  );
};

export const formatTime = time => {
  const dateObj = new Date(time);
  return dateObj.toLocaleTimeString() + " - " + dateObj.toLocaleDateString();
};

export const parseToQueryString = obj => {
  return stringify(obj);
};

export const reduceString = string => {
  return string.length > 20 ? string.slice(0, 17) + "..." : string;
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
