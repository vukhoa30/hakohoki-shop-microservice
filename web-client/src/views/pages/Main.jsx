import React from "react";
import ReactDOM from "react-dom";
import { Route } from "react-router";
import { Link, Redirect, Switch, withRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProductList from "./Product/List";
import ProductDetail from "./Product/Detail";
import AddProduct from "./Product/AddProduct";
import NotificationPage from "./Notification";
import AccountManager from "./Account/AccountManager";
import BillDetail from "./Bill/Detail";
import Promotion from "./Promotion";
import Subscription from "./Subscription";
import ProtectedRoute from "../components/ProtectedRoute";
import { connect } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { parseToQueryString, formatTime } from "../../utils";
import {
  logOut,
  setNotificationAsRead,
  loadNotifications,
  loadStatistic,
  connectToServer
} from "../../api";
import Breadcrumb from "../components/Breadcrumb";
import BillList from "./Bill/List";
import { Badge, Modal } from "react-bootstrap";
import Loader from "../components/Loader";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logOutConfirmDialog: false
    };
    const { notification, token, loadNotifications, loadStatistic } = props;
    // loadNotifications(this.props.token);
    // loadStatistic(token);
  }
  render() {
    const {
      match,
      logOut,
      role,
      location,
      fullName,
      notification,
      token,
      setNotificationAsRead,
      connection,
      accountId,
      connectToServer,
      history
    } = this.props;
    const { isConnecting, isConnected } = connection;
    const notifications = notification.data.slice(0, 5);
    const notificationUnreadCount = notifications.filter(
      notification => !notification.read
    ).length;
    return (
      <div className="wrapper">
        <Modal show={this.state.logOutConfirmDialog}>
          <Modal.Header>
            <Modal.Title>READY TO LOG OUT?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure to log out?</p>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-warning btn-fill"
              onClick={() => {
                this.setState({ logOutConfirmDialog: false });
                logOut();
              }}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-default"
              onClick={() => this.setState({ logOutConfirmDialog: false })}
            >
              No
            </button>
          </Modal.Footer>
        </Modal>
        <div
          className="sidebar"
          data-background-color="white"
          data-active-color="danger"
        >
          {/*
        Tip 1: you can change the color of the sidebar's background using: data-background-color="white | black"
        Tip 2: you can change the color of the active button using the data-active-color="primary | info | success | warning | danger"
      */}
          <div className="sidebar-wrapper">
            <div className="logo">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <img
                  src={`assets/img/${role + ".png"}`}
                  style={{ width: 100, height: 100 }}
                />
              </div>
              <a href="javascript:;" className="simple-text">
                {fullName}
              </a>
              <a href="javascript:;" className="simple-text">
                <b>{role}</b>
              </a>
            </div>
            <ul className="nav">
              {role === "manager" || role === "employee" && (
                <li
                  className={
                    location.pathname.includes("dashboard") ? "active" : ""
                  }
                >
                  <Link to={`${match.url}/dashboard`}>
                    <i className="ti-pie-chart" />
                    <p>Dashboard</p>
                  </Link>
                </li>
              )}
              {role === "manager" || role === "employee" && (
                <li
                  className={
                    location.pathname.includes("account") ? "active" : ""
                  }
                >
                  <Link to={`${match.url}/account/management`}>
                    <i className="fa fa-user" />
                    <p>Account</p>
                  </Link>
                </li>
              )}
              <li
                className={
                  location.pathname.includes("subscribe-product")
                    ? "active"
                    : ""
                }
              >
                <Link to={`${match.url}/subscribe-product`}>
                  <i className="fa fa-certificate" />
                  <p>Subscription</p>
                </Link>
              </li>
              <li
                className={
                  location.pathname.includes("/product") ? "active" : ""
                }
              >
                <Link to={`${match.url}/product/list`}>
                  <i className="fa fa-product-hunt" />
                  <p>Product</p>
                </Link>
              </li>
              <li
                className={location.pathname.includes("bill") ? "active" : ""}
              >
                <Link to={`${match.url}/bill/list`}>
                  <i className="fa fa-file" />
                  <p>Bill</p>
                </Link>
              </li>
              <li
                className={
                  location.pathname.includes("promotion") ? "active" : ""
                }
              >
                <Link to={`${match.url}/promotion`}>
                  <i className="fa fa-bomb" />
                  <p>Promotion</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="main-panel">
          <div
            className="text-center clickable"
            style={{ width: "100%", paddingTop: 10 }}
          >
            {isConnecting ? (
              <Loader />
            ) : (
                !isConnected && (
                  <p
                    style={{ color: "red" }}
                    onClick={() => connectToServer(accountId)}
                  >
                    COULD NOT CONNECT TO SERVER. CLICK TO TRY AGAIN
                </p>
                )
              )}
          </div>
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar bar1" />
                  <span className="icon-bar bar2" />
                  <span className="icon-bar bar3" />
                </button>
                <a className="navbar-brand" href="#">
                  <Breadcrumb />
                </a>
              </div>
              <div className="collapse navbar-collapse">
                <ul className="nav navbar-nav navbar-right">
                  <li className="dropdown">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <i className="fa fa-bell" style={{ color: "orange" }} />
                      {notificationUnreadCount > 0 && (
                        <Badge style={{ backgroundColor: "red" }}>
                          {notificationUnreadCount}
                        </Badge>
                      )}
                      <b className="fa fa-caret-down" />
                    </a>
                    <ul className="dropdown-menu">
                      {notifications.map(notification => (
                        <li key={"notification-" + notification.id}>
                          <Link
                            to={
                              notification.type === "commentPosted"
                                ? `${
                                match.url
                                }/subscribe-product?_v=${new Date().getTime()}&product_id=${
                                notification.productId
                                }&comment_id=${notification.commentId}${
                                notification.parentId
                                  ? `&parent_id=${notification.parentId}`
                                  : ""
                                }`
                                : `${match.url}/bill/list?selected_bill_id=` +
                                notification.billId
                            }
                            onClick={() =>
                              setNotificationAsRead(notification.id, token)
                            }
                            style={{
                              padding: 20,
                              whiteSpace: "normal",
                              width: 400
                            }}
                          >
                            <div className="row">
                              <div className="col-xs-2">
                                <img
                                  src="assets/img/notification.png"
                                  alt=""
                                  style={{ width: "100%", height: "auto" }}
                                />
                              </div>
                              <div
                                className="col-xs-10"
                                style={{
                                  fontWeight: notification.read
                                    ? "none"
                                    : "bold",
                                  flex: 6
                                }}
                              >
                                {notification.type === "commentPosted" ? (
                                  <b>
                                    New comment about product{" "}
                                    {notification.productName}
                                  </b>
                                ) : (
                                    <b>New order was made</b>
                                  )}
                                <small style={{ display: "block" }}>
                                  {formatTime(notification.createdAt)}
                                </small>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link to={`${match.url}/notification`}>
                          View other notifications ...
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a
                      href="javascript:;"
                      onClick={() =>
                        this.setState({ logOutConfirmDialog: true })
                      }
                    >
                      <i className="fa fa-sign-out" />
                      <p>Log out</p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className="content">
            <Switch>
              <Redirect
                exact
                path={match.url}
                to={
                  role === "manager"
                    ? `${match.url}/dashboard`
                    : role === "receptionist"
                      ? `${match.url}/bill/list`
                      : `${match.url}/subscribe-product`
                }
              />
              <ProtectedRoute
                path={`${match.url}/dashboard`}
                component={Dashboard}
                isAuthorized={() => role === "manager" || role === "employee"}
              />
              <ProtectedRoute
                path={`${match.url}/account/management`}
                component={AccountManager}
                isAuthorized={() => role === "manager" || role === "employee"}
              />
              <Route
                path={`${match.url}/product/list`}
                component={ProductList}
              />
              <Route
                path={`${match.url}/product/detail/:id`}
                component={ProductDetail}
              />
              <Route
                path={`${match.url}/subscribe-product`}
                component={Subscription}
              />
              <ProtectedRoute
                path={`${match.url}/product/add-product`}
                component={AddProduct}
                isAuthorized={() => role === "manager" || role === "employee"}
              />
              <ProtectedRoute
                path={`${match.url}/product/update-product/:id`}
                component={AddProduct}
                isAuthorized={() => role === "manager" || role === "employee"}
              />
              <Route path={`${match.url}/bill/list`} component={BillList} />
              <Route
                path={`${match.url}/bill/detail/:id`}
                component={BillDetail}
              />
              <Route path={`${match.url}/promotion`} component={Promotion} />
              <Route
                path={`${match.url}/notification`}
                component={NotificationPage}
              />
              <Route
                component={props => (
                  <div class="container-fluid">
                    <h1>OOPS!</h1>
                    <hr />
                    <p>It looks like that page no longer exists</p>
                  </div>
                )}
              />
            </Switch>
          </div>
          {/* <footer className="footer">
            <div className="container-fluid">
              <nav className="pull-left">
                <ul>
                  <li>
                    <a href="#">Home</a>
                  </li>
                </ul>
              </nav>
              <div className="copyright pull-right">
                © , made with <i className="fa fa-heart heart" /> by{" "}
                <a href="http://www.creative-tim.com">Creative Tim</a>
              </div>
            </div>
          </footer> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  product: state.product.detail,
  router: state.router,
  role: state.user.role,
  fullName: state.user.fullName,
  notification: state.notification,
  token: state.user.token,
  accountId: state.user.accountId,
  connection: state.connection
});
const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut()),
  setNotificationAsRead: (notificationId, token) =>
    dispatch(setNotificationAsRead(notificationId, token)),
  loadNotifications: token => dispatch(loadNotifications(token)),
  loadStatistic: token => dispatch(loadStatistic(token)),
  connectToServer: accountId => dispatch(connectToServer(accountId))
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
