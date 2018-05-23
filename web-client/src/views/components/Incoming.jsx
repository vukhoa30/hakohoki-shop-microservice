import React, { Component } from "react";
import { connect } from "react-redux";
class IncomingIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div class="lds-ripple" {...this.props}>
        <div />
        <div />
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(IncomingIcon);
