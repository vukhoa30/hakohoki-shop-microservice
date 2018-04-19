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
import CreateAccount from "./Account/CreateAccount";
import BillDetail from "./Bill/Detail";
import { connect } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { parseToQueryString } from "../../utils";
import { logOut } from "../../api";
import Breadcrumb from "../components/Breadcrumb";
import BillList from "./Bill/List";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { match, logOut, role } = this.props;
    return (
      <div>
        {/* Navigation*/}
        <nav
          className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top border border-bottom-2"
          id="mainNav"
        >
          <a className="navbar-brand" href="index.html">
            Start Bootstrap
          </a>
          <button
            className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav navbar-sidenav" id="exampleAccordion">
              <li
                className="nav-item"
                data-toggle="tooltip"
                data-placement="right"
                title="Dashboard"
              >
                <Link to={`${match.url}/dashboard`} className="nav-link">
                  <i
                    className="fa fa-fw fa-dashboard"
                    style={{ marginRight: 10 }}
                  />
                  <span className="nav-link-text text-light">Dashboard</span>
                </Link>
              </li>
              {role === "manager" && (
                <li
                  className="nav-item"
                  data-toggle="tooltip"
                  data-placement="right"
                  title="Accounts"
                >
                  <a
                    className="nav-link nav-link-collapse collapsed"
                    data-toggle="collapse"
                    href="#collapseAccounts"
                    data-parent="#exampleAccordion"
                  >
                    <i
                      className="fa fa-fw fa-wrench"
                      style={{ marginRight: 10 }}
                    />
                    <span className="nav-link-text text-light">Account</span>
                  </a>
                  <ul
                    className="sidenav-second-level collapse"
                    id="collapseAccounts"
                  >
                    <li>
                      <Link
                        to={`${match.url}/account/create-account`}
                        className="text-light"
                      >
                        Create account
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              <li
                className="nav-item"
                data-toggle="tooltip"
                data-placement="right"
                title="Products"
              >
                <a
                  className="nav-link nav-link-collapse collapsed"
                  data-toggle="collapse"
                  href="#collapseProducts"
                  data-parent="#exampleAccordion"
                >
                  <i
                    className="fa fa-fw fa-wrench"
                    style={{ marginRight: 10 }}
                  />
                  <span className="nav-link-text text-light">Product</span>
                </a>
                <ul
                  className="sidenav-second-level collapse"
                  id="collapseProducts"
                >
                  <li>
                    <Link
                      to={`${match.url}/product/list`}
                      className="text-light"
                    >
                      List
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${match.url}/product/add-product`}
                      className="text-light"
                    >
                      Add product
                    </Link>
                  </li>
                </ul>
              </li>
              <li
                className="nav-item"
                data-toggle="tooltip"
                data-placement="right"
                title="Bills"
              >
                <a
                  className="nav-link nav-link-collapse collapsed"
                  data-toggle="collapse"
                  href="#collapseBills"
                  data-parent="#exampleAccordion"
                >
                  <i className="fa fa-fw fa-file" style={{ marginRight: 10 }} />
                  <span className="nav-link-text text-light">Bill</span>
                </a>
                <ul
                  className="sidenav-second-level collapse"
                  id="collapseBills"
                >
                  <li>
                    <Link to={`${match.url}/bill/list`} className="text-light">
                      List
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${match.url}/product/create-bill`}
                      className="text-light"
                    >
                      Create bill
                    </Link>
                  </li>
                </ul>
              </li>
              <li
                className="nav-item"
                data-toggle="tooltip"
                data-placement="right"
                title="Promotion"
              >
                <a
                  className="nav-link nav-link-collapse collapsed"
                  data-toggle="collapse"
                  href="#collapsePromotion"
                  data-parent="#exampleAccordion"
                >
                  <i
                    className="fa fa-fw fa-sitemap"
                    style={{ marginRight: 10 }}
                  />
                  <span className="nav-link-text text-light">Promotion</span>
                </a>
                <ul
                  className="sidenav-second-level collapse"
                  id="collapsePromotion"
                >
                  <li>
                    <Link
                      to={`${match.url}/promotion/list`}
                      className="text-light"
                    >
                      List
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${match.url}/promotion/add-promotion`}
                      className="text-light"
                    >
                      Add promotion
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <ul className="navbar-nav sidenav-toggler">
              <li className="nav-item">
                <a className="nav-link text-center" id="sidenavToggler">
                  <i className="fa fa-fw fa-angle-left" />
                </a>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle mr-lg-2"
                  id="alertsDropdown"
                  href="#"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fa fa-fw fa-bell" style={{ marginRight: 10 }} />
                  <span className="d-lg-none">
                    Alerts
                    <span className="badge badge-pill badge-warning ml-5">
                      6 New
                    </span>
                  </span>
                  <span className="indicator text-warning d-none d-lg-block">
                    <i className="fa fa-fw fa-circle" />
                  </span>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="alertsDropdown"
                >
                  <h6 className="dropdown-header">New Alerts:</h6>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    <span className="text-success">
                      <strong>
                        <i className="fa fa-long-arrow-up fa-fw" />Status Update
                      </strong>
                    </span>
                    <span className="small float-right text-muted">
                      11:21 AM
                    </span>
                    <div className="dropdown-message small">
                      This is an automated server response message. All systems
                      are online.
                    </div>
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    <span className="text-danger">
                      <strong>
                        <i className="fa fa-long-arrow-down fa-fw" />Status
                        Update
                      </strong>
                    </span>
                    <span className="small float-right text-muted">
                      11:21 AM
                    </span>
                    <div className="dropdown-message small">
                      This is an automated server response message. All systems
                      are online.
                    </div>
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    <span className="text-success">
                      <strong>
                        <i className="fa fa-long-arrow-up fa-fw" />Status Update
                      </strong>
                    </span>
                    <span className="small float-right text-muted">
                      11:21 AM
                    </span>
                    <div className="dropdown-message small">
                      This is an automated server response message. All systems
                      are online.
                    </div>
                  </a>
                  <div className="dropdown-divider" />
                  <Link
                    to={`${match.url}/notification`}
                    className="dropdown-item smal"
                  >
                    View all alerts
                  </Link>
                </div>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="modal"
                  data-target="#exampleModal"
                >
                  <i
                    className="fa fa-fw fa-sign-out"
                    style={{ marginRight: 10 }}
                  />Logout
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <div
          className="content-wrapper p-0"
          style={{ backgroundColor: "#eee" }}
        >
          <div className="container-fluid p-0">
            {/* Breadcrumbs*/}
            <Breadcrumb />
            <div className="row">
              <div className="col-12 pb-5">
                <Switch>
                  <Redirect
                    exact
                    path={match.url}
                    to={`${match.url}/dashboard`}
                  />
                  <Route
                    path={`${match.url}/dashboard`}
                    component={Dashboard}
                  />
                  <Route
                    path={`${match.url}/account/create-account`}
                    component={CreateAccount}
                  />
                  <Route
                    path={`${match.url}/product/feedback/:id`}
                    component={ProductFeedback}
                  />
                  <Route
                    path={`${match.url}/product/list`}
                    component={ProductList}
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
                    path={`${match.url}/product/detail/:id`}
                    component={ProductDetail}
                  />
                  <Route path={`${match.url}/bill/list`} component={BillList} />
                  <Route
                    path={`${match.url}/bill/detail/:id`}
                    component={BillDetail}
                  />
                  {/* <Route
                    path={`${match.url}/product`}
                    component={({ match }) => (
                      <div>
                        <Switch>
                         
                          <Route
                            path={`${match.url}/feedback`}
                            component={ProductFeedback}
                          />
                        </Switch>
                      </div>
                    )}
                  /> */}
                  <Route
                    path={`${match.url}/notification`}
                    component={Notification}
                  />
                </Switch>
              </div>
            </div>
          </div>
          {/* /.container-fluid*/}
          {/* /.content-wrapper*/}
          <footer className="sticky-footer">
            <div className="container">
              <div className="text-center">
                <small>Copyright © Your Website 2018</small>
              </div>
            </div>
          </footer>
          {/* Scroll to Top Button*/}
          <a className="scroll-to-top rounded" href="#page-top">
            <i className="fa fa-angle-up" />
          </a>
          {/* Logout Modal*/}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Ready to Leave?
                  </h5>
                  <button
                    className="close"
                    type="button"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure to log out?
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <a
                    className="btn btn-primary"
                    data-dismiss="modal"
                    onClick={() => logOut()}
                    href="javascript:;"
                  >
                    Log out
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Bootstrap core JavaScript*/}
          {/* Core plugin JavaScript*/}
          {/* Custom scripts for all pages*/}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  product: state.product.detail,
  router: state.router,
  role: state.user.role
});
const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut())
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
