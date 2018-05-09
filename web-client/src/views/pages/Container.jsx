import React, { Component } from "react";
import { connect } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { Redirect, Switch } from "react-router-dom";
import { Route } from "react-router";
import { loadUserInfo } from "../../api";
import Toast from "../components/Toast";
import Main from "./Main";
import Login from "./Login";
import Forbidden from "./Forbidden";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.props.loadUserInfo();
  }
  render() {
    const { appLoading, history, isLoggedIn } = this.props;
    return (
      <div>
        <Toast />
        {appLoading ? (
          <div className="cssload-tetrominos" style={{ marginTop: 200 }}>
            <div className="cssload-tetromino cssload-box1" />
            <div className="cssload-tetromino cssload-box2" />
            <div className="cssload-tetromino cssload-box3" />
            <div className="cssload-tetromino cssload-box4" />
          </div>
        ) : (
          <ConnectedRouter history={history}>
            <Switch>
              <Redirect exact path="/" to="/main" />
              <PrivateRoute path="/main" component={Main} valid={isLoggedIn} />
              <Route path="/login" component={Login} />
              <Route path="/forbidden" component={Forbidden} />
            </Switch>
          </ConnectedRouter>
        )}
      </div>
    );
  }
}
const PrivateRoute = ({ component: Component, valid, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      valid ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);
const mapStateToProps = state => ({
  appLoading: state.app.appLoading,
  isLoggedIn: state.user.isLoggedIn
});
const mapDispatchToProps = dispatch => ({
  loadUserInfo: () => dispatch(loadUserInfo())
});
export default connect(mapStateToProps, mapDispatchToProps)(Container);
