import React from "react";
import ReactDOM from "react-dom";
import { Route } from "react-router";
import { Link, Redirect, Switch, withRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProductList from "./Product/List";
import ProductDetail from "./Product/Detail";
import AddProduct from "./Product/AddProduct";
import Notification from "./Notification";
import ProductFeedback from "./Product/Feedback";
import AccountManager from "./Account/AccountManager";
import BillDetail from "./Bill/Detail";
import { connect } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { parseToQueryString } from "../../utils";
import { logOut } from "../../api";
import Breadcrumb from "../components/Breadcrumb";
import BillList from "./Bill/List";
import { Badge, Modal } from "react-bootstrap";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logOutConfirmDialog: false
    };
  }
  render() {
    const { match, logOut, role, location, fullName } = this.props;
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
              <li
                className={
                  location.pathname.includes("product") ? "active" : ""
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
            </ul>
          </div>
        </div>
        <div className="main-panel">
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
                      <Badge style={{ backgroundColor: "red" }}>5</Badge>
                      <b className="fa fa-caret-down" />
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a href="#">Notification 1</a>
                      </li>
                      <li>
                        <a href="#">Notification 2</a>
                      </li>
                      <li>
                        <a href="#">Notification 3</a>
                      </li>
                      <li>
                        <a href="#">Notification 4</a>
                      </li>
                      <li>
                        <a href="#">Another notification</a>
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
            <Redirect exact path={match.url} to={`${match.url}/dashboard`} />
            <Route path={`${match.url}/dashboard`} component={Dashboard} />
            <Route
              path={`${match.url}/account/management`}
              component={AccountManager}
            />
            <Route path={`${match.url}/product/list`} component={ProductList} />
            <Route
              path={`${match.url}/product/detail/:id`}
              component={ProductDetail}
            />
            <Route
              path={`${match.url}/product/add-product`}
              component={AddProduct}
            />
            <Route
              path={`${match.url}/product/update-product/:id`}
              component={AddProduct}
            />
            <Route
              path={`${match.url}/product/feedback/:id`}
              component={ProductFeedback}
            />
            <Route path={`${match.url}/bill/list`} component={BillList} />
            <Route
              path={`${match.url}/bill/detail/:id`}
              component={BillDetail}
            />
          </div>
          <footer className="footer">
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
          </footer>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  product: state.product.detail,
  router: state.router,
  role: state.user.role,
  fullName: state.user.fullName
});
const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut())
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
