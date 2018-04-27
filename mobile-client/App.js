import React from "react";
import { StyleSheet, Text, View } from "react-native";
import thunk from "redux-thunk";
import { reactNavigationReduxMiddleware } from "./api/middleware";
import AppNavigation from "./views/screens/AppNavigation";
import Loading from "./views/screens/Loading";
import appReducer from "./reducers";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { disconnect } from "./api";

const store = createStore(
  appReducer,
  //applyMiddleware(reactNavigationReduxMiddleware, thunk, createLogger({ stateTransformer: state => state.cart }))
  applyMiddleware(reactNavigationReduxMiddleware, thunk)
);

export default class App extends React.Component {
  state = {
    appLoaded: false
  };

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ appLoaded: true });
  }

  componentWillUnmount() {
    disconnect();
  }

  render() {
    return (
      <Provider store={store}>
        {this.state.appLoaded ? <AppNavigation /> : <Loading />}
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
