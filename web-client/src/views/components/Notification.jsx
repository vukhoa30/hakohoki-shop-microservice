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
  render() {
    const { token, notification, setNotificationAsRead, history } = this.props;
    return (
      <ListGroupItem
        onClick={() => {
          setNotificationAsRead(notification.id, token);
          history.push(
            `/main/subscribe-product?_v=${new Date().getTime()}&product_id=${
              notification.productId
            }&comment_id=${notification.commentId}`
          );
        }}
      >
        <div className="row">
          <div className="col-xs-1">
            <img src="assets/img/notification.png" alt="" style={{ width: '100%', height: 'auto' }} />
          </div>
          <div className="col-xs-10">
            <div>
              <h3 style={{ marginTop: 0 }}>
                <b>NEW FEEDBACK ABOUT PRODUCT</b>
              </h3>
              <small>{formatTime(notification.createdAt)}</small>
            </div>
            <p className="mb-1">
              Some user has give a feedback to product{" "}
              <Link to={`/main/product/detail/${notification.productId}`}>
                {`${notification.productName}`}(ID:{" "}
                {`${notification.productId}`})
              </Link>
            </p>
          </div>
        </div>
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
