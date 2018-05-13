import React, { Component } from "react";
import { connect } from "react-redux";
import { formatTime, parseToObject } from "../../utils";
class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { selected, comment, select } = this.props;
    return (
      <div
        className="row clickable"
        style={{ width: "100%", marginBottom: 20 }}
        onClick={() => select && select()}
      >
        <div className="col-xs-1">
          {selected && (
            <i
              className="fa fa-caret-right"
              style={{ color: "green", fontSize: 20 }}
            />
          )}
        </div>
        <div className="col-xs-2">
          <img
            src={`assets/img/${
              (comment.userRole ? comment.userRole : "customer") + ".png"
            }`}
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="col-xs-9">
          <p style={{ marginBottom: 0, fontSize: 15 }}>
            <b>{comment.userName ? comment.userName : "UNKNOWN USER"}</b>
            <small className="pull-right" style={{ fontSize: 10 }}>
              {formatTime(comment.createdAt)}
            </small>
          </p>
          <p style={{ fontSize: 12 }}>{comment.content}</p>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Comment);
