import { AsyncStorage } from "react-native";

const Store = function() {
  this.setAccountInfo = (token, account) =>
    AsyncStorage.multiSet(
      [["@User:token", token], ["@User:account", JSON.stringify(account)]],
      err => console.log(err)
    );
  this.setCartList = cart =>
    AsyncStorage.setItem("@Cart", JSON.stringify(cart));
  this.setWatchList = watchList =>
    AsyncStorage.setItem("@User:watch_list", JSON.stringify(watchList));

  this.clear = () => AsyncStorage.clear();
  this.loadFromCache = function() {
    return new Promise((resolve, reject) => {
      AsyncStorage.multiGet(
        ["@User:token", "@User:account", "@User:watch_list", "@Cart"],
        (err, storage) => {
          let token = null,
            account = null,
            cart = [],
            watchList = [];
          storage.forEach(item => {
            let data = null;
            try {
              if (item[0] === "@User:token") data = item[1];
              data = item[1] !== null ? JSON.parse(item[1]) : null;
            } catch (error) {}
            switch (item[0]) {
              case "@User:token":
                token = data;
                break;
              case "@User:account":
                account = data;
                break;
              case "@User:watch_list":
                watchList = data !== null ? data : [];
                break;
              case "@Cart":
                cart = data !== null ? data : [];
                break;
            }
          });
          resolve({
            token,
            account,
            watchList,
            cart
          });
        }
      );
    });
  };
};

const store = new Store();

export default store;
