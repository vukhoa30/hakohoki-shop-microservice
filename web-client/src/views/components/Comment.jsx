import React, { Component } from "react";
import { connect } from "react-redux";
import { formatTime, parseToObject } from "../../utils";
import { Badge } from "react-bootstrap";
class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { selected, comment, select, info } = this.props;
    return (
      <div
        className="card row clickable"
        style={{ width: "100%", margin: 0, marginBottom: 20, padding: 10, borderWidth: 1, borderStyle: 'solid', borderColor: selected ? 'blue' : 'transparent' }}
        onClick={() => select && select()}
      >
        <div className="col-xs-2">
          <img
            src={`assets/img/${(comment.userRole
              ? comment.userRole
              : "customer") + ".png"}`}
            alt=""
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="col-xs-9">
          <p style={{ marginBottom: 0, fontSize: 15 }}>
            <b>{comment.userName ? comment.userName : "UNKNOWN USER"}</b>
            {info && (
              <small
                className="pull-right"
                style={{ color: "orange", fontWeight: "bold" }}
              >
              {
                info.count === 0 ? 'NEW' : <Badge style={{ backgroundColor: 'orange', color: 'white' }}>{info.count}</Badge>
              }
              </small>
            )}
          </p>
          <small style={{ fontSize: 10, display: "block" }}>
            {formatTime(comment.createdAt)}
          </small>
          <p style={{ fontSize: 12 }}>{comment.content}</p>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Comment);
