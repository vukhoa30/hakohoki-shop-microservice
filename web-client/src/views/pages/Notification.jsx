import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ListGroup, ListGroupItem, Alert } from "react-bootstrap";
import { formatTime } from "../../utils";
import { loadNotifications, toast, setNotificationAsRead } from "../../api";
import Loader from "../components/Loader";
import { code as errCode } from "../../api/err-code";
const {
  UNKNOWN_ERROR,
  CONNECTION_ERROR,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  DATA_NOT_FOUND
} = errCode;
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const { isFirstLoad, loadNotifications, token } = props;
    if (isFirstLoad) loadNotifications(token)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.err !== nextProps.err && nextProps.err !== null) {
      const { toast } = nextProps;
      switch (nextProps.err) {
        case CONNECTION_ERROR:
          toast("PLEASE CHECK YOUR CONNECTION!", "error");
          break;
        case FORBIDDEN:
          toast("AUTHENTICATION FAILED! PLEASE LOG IN AGAIN", "error");
          break;
        case INTERNAL_SERVER_ERROR:
          toast("INTERNAL SERVER ERROR! TRY AGAIN LATER", "error");
          break;
        case UNKNOWN_ERROR:
          toast("UNDEFINED ERROR! TRY AGAIN LATER", "error");
          break;
      }
    }
  }
  render() {
    const {
      isLoading,
      err,
      data: notifications,
      history,
      loadNotifications,
      setNotificationAsRead,
      token
    } = this.props;
    const noNotifications = notifications.length === 0;
    return (
      <div className="container-fluid">
        {isLoading ? (
          <div className="text-center">
            <Loader />
          </div>
        ) : err ? (
          <div className="text-center clickable">
            <Alert bsStyle="danger" onClick={() => loadNotifications(token)}>
              COULD NOT LOAD NOTIFICATIONS. CLICK TO TRY AGAIN!
            </Alert>
          </div>
        ) : noNotifications ? (
          <div className="text-center">
            <p style={{ color: "gray" }}>NO NOTIFICATIONS</p>
          </div>
        ) : (
          <ListGroup>
            {notifications.map(notification => (
              <ListGroupItem
                key={"notification-" + notification._id}
                onClick={() => {
                  setNotificationAsRead(notification._id, token);
                  history.push(
                    "/main/product/feedback/" + notification.productId
                  );
                }}
              >
                <div>
                  <h3>
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
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state.notification,
  token: state.user.token
});
const mapDispatchToProps = dispatch => ({
  toast: (message, level) => dispatch(toast(message, level)),
  loadNotifications: token => dispatch(loadNotifications(token)),
  setNotificationAsRead: (notificationId, token) =>
    dispatch(setNotificationAsRead(notificationId, token))
});
export default connect(mapStateToProps, mapDispatchToProps)(Notification);
