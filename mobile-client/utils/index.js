import { gatewayHost, gatewayPort } from "../config";
import { stringify } from "query-string";
import { AlertAndroid, Alert, Platform } from "react-native";
import { Toast } from "native-base";
import io from "socket.io-client";

var gatewayAddress = "http://" + gatewayHost + ":" + gatewayPort;

function updateGateway(host, port) {
  gatewayAddress = "http://" + host + ":" + port;
}

function createSocketConnection(
  onConnect,
  onTimeout,
  onError,
  onMessage,
  onDisconnect
) {
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
}

function alert(type, content, position = 'bottom') {
  const toastType = type === 'success' ? 'default' : type === 'error' ? 'danger' : 'warning'
  Toast.show({
    text: content,
    buttonText: "OK",
    position: "bottom",
    type: toastType,
    position
  });
}

function confirm(title, content, callback) {
  if (Platform.OS === "ios")
    AlertIOS.alert(title, content, [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => callback() }
    ]);
  else
    Alert.alert(title, content, [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => callback() }
    ]);
}

function request(url, method, header, data) {
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
}

function currencyFormat(currency) {
  return currency
    ? currency.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " VND"
    : "0 VND";
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function formatTime(time) {
  const dateObj = new Date(time);
  return dateObj.toLocaleTimeString() + " - " + dateObj.toLocaleDateString();
}

function parseToQueryString(obj) {
  return stringify(obj);
}

function getAction(type, obj) {
  return {
    type,
    ...obj
  };
}

function reduceString(string) {
  return string.length > 20 ? string.slice(0, 17) + "..." : string;
}

function delay(ms) {
  return new Promise(res => setTimeout(() => res(), ms));
}

module.exports = {
  updateGateway,
  request,
  currencyFormat,
  validateEmail,
  formatTime,
  parseToQueryString,
  getAction,
  alert,
  confirm,
  delay,
  createSocketConnection,
  reduceString
};
