import { gatewayHost, gatewayPort } from "../config";
import { stringify } from "query-string";
import { AlertAndroid, Alert, Platform, Dimensions } from "react-native";
import { Toast } from "native-base";
import io from "socket.io-client";

var { width, height } = Dimensions.get("window");
var platform = Platform.OS;

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

function alert(type, content, position = "bottom") {
  const toastType =
    type === "success" ? "default" : type === "error" ? "danger" : "warning";
  Toast.show({
    text: content,
    buttonText: "OK",
    position: "bottom",
    type: toastType,
    position,
    duration: 3000
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
  return new Promise(async (resolve, reject) => {
    try {
      let response = await fetch(fullUrl, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...header
        },
        body: data ? JSON.stringify(data) : null
      });
      console.log(method + " " + url + " - " + response.status);
      let responseJson = await response.json();
      return resolve({ status: response.status, data: responseJson });
    } catch (error) {
      console.log(error);
      console.log(method + " " + url);
      reject(error);
    }
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

function formatTime(curTime) {
  const dateObj = new Date(curTime);
  const today = new Date();
  let time = Math.round((today.getTime() - dateObj.getTime()) / 60000);
  let unit = "minute";
  let loop = true;
  let i = 0;
  while (i++ < 4 && loop) {
    switch (unit) {
      case "minute":
        if (time < 60) loop = false;
        else {
          time = Math.round(time / 60);
          unit = "hour";
        }
        break;
      case "hour":
        if (time < 24) loop = false;
        else {
          time = Math.round(time / 24);
          unit = "day";
        }
        break;
      case "day":
        if (time < 30) loop = false;
        else {
          time = Math.round(time / 30);
          unit = "month";
        }
        break;
      case "month":
        if (time < 12) loop = false;
        else {
          time = Math.round(time / 12);
          unit = "year";
        }
        break;
    }
  }
  return unit === "minute" && time === 0
    ? "Just now"
    : time + " " + unit + (time > 1 ? "s" : "") + " ago";
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

function formatProduct(product) {
  return {
    ...product,
    price: currencyFormat(product.price),
    promotionPrice: product.promotionPrice
      ? currencyFormat(product.promotionPrice)
      : undefined
  };
}

module.exports = {
  width,
  height,
  platform,
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
  reduceString,
  formatProduct
};
