import React from "react";
import { StyleSheet, Text, View } from "react-native";
import thunk from "redux-thunk";
import { reactNavigationReduxMiddleware } from "./api/middleware";
import Container from "./views/screens/Container";
import appReducer from "./reducers";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import { disconnect } from "./api";
import { Root } from "native-base";

const store = createStore(
  appReducer,
  //applyMiddleware(reactNavigationReduxMiddleware, thunk, createLogger({ stateTransformer: state => state.promotion }))
  applyMiddleware(reactNavigationReduxMiddleware, thunk)
);

export default class App extends React.Component {
  componentWillUnmount() {
    disconnect();
  }

  render() {
    return (
      <Provider store={store}>
        <Root>
          <Container />
        </Root>
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
