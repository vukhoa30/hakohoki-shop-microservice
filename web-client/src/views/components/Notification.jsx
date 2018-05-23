import React, { Component } from "react";
import { connect } from "react-redux";
import { ListGroupItem } from "react-bootstrap";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { setNotificationAsRead } from "../../api";
import { formatTime } from "../../utils";
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderNotification(notification) {
    const {
      type,
      productId,
      productName,
      commentId,
      id,
      createdAt,
      billId,
      parentId
    } = notification;
    const { token, setNotificationAsRead, history } = this.props;

    switch (type) {
      case "commentPosted":
        return (
          <div
            className="row clickable"
            onClick={() => {
              setNotificationAsRead(id, token);
              history.push(
                `/main/subscribe-product?_v=${new Date().getTime()}&product_id=${productId}&comment_id=${commentId}${
                  parentId ? `&parent_id=${parentId}` : ""
                }`
              );
            }}
          >
            <div className="col-xs-1">
              <img
                src="assets/img/notification.png"
                alt=""
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="col-xs-10">
              <div>
                <h3 style={{ marginTop: 0 }}>
                  <b>NEW FEEDBACK ABOUT PRODUCT</b>
                </h3>
                <small>{formatTime(createdAt)}</small>
              </div>
              <p className="mb-1">
                Some user has give a feedback to product{" "}
                <Link to={`/main/product/detail/${productId}`}>
                  {`${productName}`}(ID: {`${productId}`})
                </Link>
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div
            className="row clickable"
            onClick={() => {
              setNotificationAsRead(id, token);
              history.push("/main/bill/list?selected_bill_id=" + billId);
            }}
          >
            <div className="col-xs-1">
              <img
                src="assets/img/notification.png"
                alt=""
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div className="col-xs-10">
              <div>
                <h3 style={{ marginTop: 0 }}>
                  <b>NEW ORDER</b>
                </h3>
                <small>{formatTime(createdAt)}</small>
              </div>
              <p className="mb-1">New order with ID {billId} was made</p>
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <ListGroupItem>
        {this.renderNotification(this.props.notification)}
      </ListGroupItem>
    );
  }
}
const mapStateToProps = state => ({
  token: state.user.token
});
const mapDispatchToProps = dispatch => ({
  setNotificationAsRead: (notificationId, token) =>
    dispatch(setNotificationAsRead(notificationId, token))
});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Notification)
);
