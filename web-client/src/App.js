import React, { Component } from "react";
import logo from "./logo.svg";
import Main from "./views/pages/Main";
import "./App.css";
import reducer from "./reducers";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { HashRouter as Router, Route } from "react-router-dom";
import thunk from "redux-thunk";

const store = createStore(reducer,applyMiddleware(thunk));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route path="/" component={Main} />
        </Router>
      </Provider>
    );
  }
}

export default App;
