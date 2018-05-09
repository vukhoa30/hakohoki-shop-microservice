import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
class Breadcrumb extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ol
        className="breadcrumb bg-light border"
        style={{ borderBottomColor: "gray", fontWeight: "bold" }}
      >
        {this.props.routes.map(route => (
          <li
            key={"breadcrumb-" + route.name}
            className={`breadcrumb-item ${route.link ? "" : "active"}`}
            aria-current="page"
          >
            {route.link ? (
              <Link to={route.link}>{route.name}</Link>
            ) : (
              route.name
            )}
          </li>
        ))}
      </ol>
    );
  }
}
const mapStateToProps = state => {
  const { pathname } = state.router.location;
  const { detail: product } = state.product;
  let routes = null;
  if (pathname.includes("dashboard")) {
    routes = [{ name: "Dashboard" }];
  } else if (pathname.includes("product/list")) {
    routes = [{ name: "Product" }, { name: "List" }];
  } else if (
    pathname.includes("product/detail") ||
    pathname.includes("product/feedback")
  ) {
    routes =
      product._id === null
        ? [
            { name: "Product" },
            {
              name: pathname.includes("detail") ? "Detail" : "Feedback"
            }
          ]
        : [
            { name: "Product" },
            {
              name: product.category,
              link: `/main/product/list?category=${product.category}`
            },
            { name: product.name },
            {
              name: pathname.includes("detail") ? "Detail" : "Feedback"
            }
          ];
  } else if (pathname.includes("product/add-product")) {
    routes = [{ name: "Product" }, { name: "Add new product" }];
  } else if (pathname.includes("product/update-product")) {
    routes = [
      { name: "Product" },
      {
        name: product.category,
        link: `/main/product/list?category=${product.category}`
      },
      { name: product.name },
      { name: "Update information" }
    ];
  } else if (pathname.includes("notification")) {
    routes = [{ name: "Notification" }];
  } else if (pathname.includes("bill/list")) {
    routes = [{ name: "Bill" }, { name: "List" }];
  } else if (pathname.includes("account/management")) {
    routes = [{ name: "Account" }, { name: "Management" }];
  } else if (pathname.includes("bill/detail")) {
    routes = [{ name: "Bill" }, { name: "Detail" }];
  } else if (pathname.includes("promotion")) {
    routes = [{ name: "Promotion" }];
  } else if (pathname.includes("subscribe-product")) {
    routes = [{ name: "Subscription" }];
  } else {
    routes = [{ name: "Page not found" }];
  }
  return {
    routes
  };
};
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumb);
