import React, { Component } from "react";
import logo from "./logo.svg";
import Container from "./views/pages/Container";
import "./App.css";
import reducer from "./reducers";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { routerMiddleware } from "react-router-redux";
import { createHashHistory } from "history";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";

const history = createHashHistory();

export const store = createStore(
  reducer,
  applyMiddleware(routerMiddleware(history), thunk, createLogger())
);

class App extends Component {
  componentDidCatch(error) {
    console.log("Some error occurs");
    console.log(error);
  }
  render() {
    return (
      <Provider store={store}>
        <Container history={history} />
      </Provider>
    );
  }
}

export default App;
