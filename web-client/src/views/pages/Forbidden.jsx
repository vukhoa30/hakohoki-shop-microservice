import React, { Component } from "react";
import { connect } from "react-redux";
class Forbidden extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { history } = this.props;
    return (
      <div className="container-fluid">
        <h1>YOU ARE NOT AUTHORIZED TO ACCESS THIS PAGE</h1>
        <button className="btn btn-default btn-fill">
          <i
            className="fa fa-arrow-left"
            style={{ marginRight: 10 }}
            onClick={() => history.push("/")}
          />
          GET BACK
        </button>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Forbidden);
