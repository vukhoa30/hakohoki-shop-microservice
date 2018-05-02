import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";
class ProtectedRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { path, component: Component, isAuthorized } = this.props;
    return (
      <Route
        render={props =>
          isAuthorized() ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: "/forbidden", state: { from: path } }} />
          )
        }
      />
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
