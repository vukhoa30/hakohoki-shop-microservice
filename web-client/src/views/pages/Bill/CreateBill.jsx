import React, { Component } from "react";
import { connect } from "react-redux";
class CreateBill extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return <div />;
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(CreateBill);
