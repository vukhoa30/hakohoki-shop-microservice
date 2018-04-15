import React, { Component } from "react";
import { connect } from "react-redux";
import ProductShowcase from "../../components/ProductShowcase";
class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="bg-primary card" style={{ padding: 10 }}>
          <div className="card-body">
            <form>
              <div className="form-group">
                <input
                  style={{ padding: 10, margin: 5 }}
                  type="text"
                  className="form-control"
                  id="formGroupExampleInput"
                  placeholder="Search for product"
                />
              </div>
            </form>
            <ul className="list-inline">
              <li className="list-inline-item" style={{ marginRight: 20 }}>
                <i
                  className="fa fa-mobile text-light"
                  style={{ fontSize: 20, marginRight: 10 }}
                />
                <small className="text-light" style={{ fontSize: 20 }}>
                  Phone
                </small>
              </li>
              <li className="list-inline-item" style={{ marginRight: 20 }}>
                <i
                  className="fa fa-tablet text-light"
                  style={{ fontSize: 20, marginRight: 10 }}
                />
                <small className="text-light" style={{ fontSize: 20 }}>
                  Tablet
                </small>
              </li>
              <li className="list-inline-item" style={{ marginRight: 20 }}>
                <i
                  className="fa fa-headphones text-light"
                  style={{ fontSize: 20, marginRight: 10 }}
                />
                <small className="text-light" style={{ fontSize: 20 }}>
                  Accessory
                </small>
              </li>
              <li className="list-inline-item" style={{ marginRight: 20 }}>
                <i
                  className="fa fa-file-o text-light"
                  style={{ fontSize: 20, marginRight: 10 }}
                />
                <small className="text-light" style={{ fontSize: 20 }}>
                  SIM
                </small>
              </li>
              <li className="list-inline-item" style={{ marginRight: 20 }}>
                <i
                  className="fa fa-credit-card-alt text-light"
                  style={{ fontSize: 20, marginRight: 10 }}
                />
                <small className="text-light" style={{ fontSize: 20 }}>
                  Card
                </small>
              </li>
            </ul>
          </div>
        </div>
        {/* <p style={{ color: "gray" }} className="mt-5" >NO PRODUCT FOUND</p> */}
        <div className="row mt-5">
          <div className="col-sm-4 col-lg-3">
            <ProductShowcase product={null} />
          </div>
          <div className="col-sm-4 col-lg-3">
            <ProductShowcase product={null} />
          </div>
          <div className="col-sm-4 col-lg-3">
            <ProductShowcase product={null} />
          </div>
          <div className="col-sm-4 col-lg-3">
            <ProductShowcase product={null} />
          </div>
          <div className="col-sm-4 col-lg-3">
            <ProductShowcase product={null} />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state.product.list
});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
