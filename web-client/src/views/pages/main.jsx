import React from "react";
import ReactDOM from "react-dom";
import { Route, Link, Redirect, withRouter, Switch } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProductList from "./Product/List";
import AddProduct from "./Product/AddProduct";
import { connect } from "react-redux";

const Main = props => {
  let routes = ["Dashboard"];
  switch (props.location.pathname) {
    case "/product/list":
      routes = ["Product", "List"];
      break;
    case "/product/add-product":
      routes = ["Product", "Add new product"];
      break;
    default:
      break;
  }

  console.log(routes);
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
              <Link to="/dashboard" className="nav-link">
                <i
                  className="fa fa-fw fa-dashboard"
                  style={{ marginRight: 10 }}
                />
                <span className="nav-link-text text-light">Dashboard</span>
              </Link>
            </li>
            <li
              className="nav-item"
              data-toggle="tooltip"
              data-placement="right"
              title="Components"
            >
              <a
                className="nav-link nav-link-collapse collapsed"
                data-toggle="collapse"
                href="#collapseComponents"
                data-parent="#exampleAccordion"
              >
                <i className="fa fa-fw fa-wrench" style={{ marginRight: 10 }} />
                <span className="nav-link-text text-light">Product</span>
              </a>
              <ul
                className="sidenav-second-level collapse"
                id="collapseComponents"
              >
                <li>
                  <Link to="/product/list" className="text-light">
                    List
                  </Link>
                </li>
                <li>
                  <Link to="/product/add-product" className="text-light">
                    Add product
                  </Link>
                </li>
              </ul>
            </li>
            <li
              className="nav-item"
              data-toggle="tooltip"
              data-placement="right"
              title="Example Pages"
            >
              <a
                className="nav-link nav-link-collapse collapsed"
                data-toggle="collapse"
                href="#collapseExamplePages"
                data-parent="#exampleAccordion"
              >
                <i className="fa fa-fw fa-file" style={{ marginRight: 10 }} />
                <span className="nav-link-text text-light">Bill</span>
              </a>
              <ul
                className="sidenav-second-level collapse"
                id="collapseExamplePages"
              >
                <li>
                  <Link to="/bill/list" className="text-light">
                    List
                  </Link>
                </li>
                <li>
                  <Link to="/bill/create-bill" className="text-light">
                    Create bill
                  </Link>
                </li>
              </ul>
            </li>
            <li
              className="nav-item"
              data-toggle="tooltip"
              data-placement="right"
              title="Menu Levels"
            >
              <a
                className="nav-link nav-link-collapse collapsed"
                data-toggle="collapse"
                href="#collapseMulti"
                data-parent="#exampleAccordion"
              >
                <i
                  className="fa fa-fw fa-sitemap"
                  style={{ marginRight: 10 }}
                />
                <span className="nav-link-text text-light">Promotion</span>
              </a>
              <ul className="sidenav-second-level collapse" id="collapseMulti">
                <li>
                  <Link to="/promotion/list" className="text-light">
                    List
                  </Link>
                </li>
                <li>
                  <Link to="/promotion/add-promotion" className="text-light">
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
                  <span className="badge badge-pill badge-warning ml-5">6 New</span>
                </span>
                <span className="indicator text-warning d-none d-lg-block">
                  <i className="fa fa-fw fa-circle" />
                </span>
              </a>
              <div className="dropdown-menu" aria-labelledby="alertsDropdown">
                <h6 className="dropdown-header">New Alerts:</h6>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="#">
                  <span className="text-success">
                    <strong>
                      <i className="fa fa-long-arrow-up fa-fw" />Status Update
                    </strong>
                  </span>
                  <span className="small float-right text-muted">11:21 AM</span>
                  <div className="dropdown-message small">
                    This is an automated server response message. All systems
                    are online.
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item" href="#">
                  <span className="text-danger">
                    <strong>
                      <i className="fa fa-long-arrow-down fa-fw" />Status Update
                    </strong>
                  </span>
                  <span className="small float-right text-muted">11:21 AM</span>
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
                  <span className="small float-right text-muted">11:21 AM</span>
                  <div className="dropdown-message small">
                    This is an automated server response message. All systems
                    are online.
                  </div>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item small" href="#">
                  View all alerts
                </a>
              </div>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                <i className="fa fa-fw fa-sign-out" style={{ marginRight: 10 }} />Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="content-wrapper p-0" style={{ backgroundColor: "#eee" }}>
        <div className="container-fluid p-0">
          {/* Breadcrumbs*/}
          <ol
            className="breadcrumb bg-light border"
            style={{ borderBottomColor: "gray" }}
          >
            {routes.map(route => (
              <li
                key={"breadcrumb-" + route}
                className="breadcrumb-item active"
                aria-current="page"
              >
                {route}
              </li>
            ))}
          </ol>
          <div className="row">
            <div className="col-12 pb-5">
              <Switch>
                <Redirect exact path="/" to="/dashboard" />
                <Route path="/dashboard" component={Dashboard} />
                <Route path="/product/list" component={ProductList} />
                <Route path="/product/add-product" component={AddProduct} />
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
                Select "Logout" below if you are ready to end your current
                session.
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <a className="btn btn-primary" href="login.html">
                  Logout
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
};

export default withRouter(Main);
