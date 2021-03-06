import React, { Component } from "react";
import { connect } from "react-redux";
class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // return <i className="lds-dual-ring" {...this.props} />;
    return (
      <div className="lds-ellipsis">
        <div />
        <div />
        <div />
        <div />
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Loader);
