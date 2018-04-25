import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Loader from "../components/Loader";
import {
  formatTime,
  currencyFormat,
  request,
  parseToQueryString
} from "../../utils";
import { loadPromotions, toast } from "../../api";
import DatePicker from "react-datepicker";
import { Checkbox, Modal } from "react-bootstrap";
import { differenceWith, uniqWith } from "lodash";
import moment from "moment";
class Promotion extends Component {
  constructor(props) {
    super(props);
    this.form = {
      selectedProductIds: []
    };
    this.state = {
      selectedPromotion: null,
      start: moment(),
      end: null,
      showProductPicker: false,
      selectedProducts: [],
      promotionRate: 30,
      currentPicture: "",
      search: {
        q: undefined,
        category: undefined,
        isSearching: false,
        products: [],
        err: null
      },
      isSubmittingForm: false
    };
    const { loadPromotions } = this.props;
    loadPromotions();
  }
  async search(productName, category) {
    const query = parseToQueryString({
      q: productName.value === "" ? undefined : productName.value,
      category: category.value === "all" ? undefined : category.value
    });
    try {
      this.setState({ search: { ...query, isSearching: true, products: [] } });
      const { status, data } = await request(
        "/products/search?" + query + "&offset=0&limit=10",
        "GET"
      );
      if (status === 200)
        return this.setState({
          search: { isSearching: false, err: null, products: data, ...query }
        });
    } catch (error) {}
    this.setState({
      search: { isSearching: false, err: "Error", products: [], ...query }
    });
  }
  async loadMore() {
    const oldArray = this.state.search.products;
    this.setState({ search: { ...this.state.search, isSearching: true } });
    try {
      const query = parseToQueryString({
        q: this.state.search.q,
        category: this.state.search.category
      });
      const { status, data } = await request(
        "/products/search?" + query + `&offset=${oldArray.length}&limit=10`,
        "GET"
      );
      if (status === 200)
        return this.setState({
          search: {
            ...this.state.search,
            isSearching: false,
            err: null,
            products: oldArray.concat(data)
          }
        });
    } catch (error) {}
    this.setState({
      search: { ...this.state.search, isSearching: false, err: "Error" }
    });
  }
  render() {
    const {
      isLoading,
      data,
      err,
      loadPromotions,
      history,
      handleSubmit,
      submitting,
      toast,
      token
    } = this.props;
    const {
      selectedPromotion,
      search,
      showProductPicker,
      selectedProducts
    } = this.state;
    const { isSearching, products, err: searchErr } = search;
    return (
      <div className="container-fluid">
        <Modal width={800} show={showProductPicker}>
          <Modal.Header>
            <Modal.Title>PRODUCTS</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const { productName, category } = this.form;
                  this.search(productName, category);
                }}
              >
                <div className="row">
                  <div className="col-xs-8 form-group">
                    <input
                      ref={ref => (this.form.productName = ref)}
                      type="text"
                      className="form-control border-input"
                      placeholder="Search for product name"
                    />
                  </div>
                  <div className="col-xs-4 form-group">
                    <select
                      ref={ref => (this.form.category = ref)}
                      className="form-control border-input"
                    >
                      <option value="all" defaultValue>
                        All products
                      </option>
                      <option value="phone">Phone</option>
                      <option value="tablet">Tablet</option>
                      <option value="accessory">Accessory</option>
                      <option value="SIM">SIM</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>
                </div>
                <div className="text-right" style={{ width: "100%" }}>
                  <button
                    className="btn btn-primary btn-fill"
                    disabled={isSearching}
                    type="submit"
                  >
                    {isSearching ? (
                      <i className="fa fa-circle-o-notch fa-spin" />
                    ) : (
                      "SEARCH"
                    )}
                  </button>
                </div>
              </form>
              <div style={{ overflowY: "auto", height: 400, marginTop: 20 }}>
                <div
                  className="text-center"
                  style={{
                    position: "absolute",
                    width: "100%"
                  }}
                >
                  {!isSearching &&
                    (products.length === 0 && (
                      <p style={{ color: "gray" }}>NO PRODUCT FOUND</p>
                    ))}
                </div>
                {differenceWith(
                  uniqWith(products, (a, b) => a._id === b._id),
                  selectedProducts,
                  (productA, productB) => productA._id === productB._id
                ).map(product => (
                  <div
                    className="row clickable"
                    key={"searched-product-" + product._id}
                    // onClick={() =>
                    //   history.push("/main/product/detail/" + product._id)
                    // }
                  >
                    <div
                      className="col-xs-4"
                      style={{ paddingTop: 10, paddingBottom: 10 }}
                    >
                      <img
                        src={product.mainPicture}
                        alt="Product picture"
                        style={{ width: 100, height: 100 }}
                      />
                    </div>
                    <div className="col-xs-6">
                      <h3 className="display-4" style={{ color: "red" }}>
                        {product.name}
                      </h3>
                      <p
                        style={{
                          color: "blue",
                          fontSize: 20,
                          marginBottom: 0
                        }}
                      >
                        {currencyFormat(
                          product.promotionPrice
                            ? product.promotionPrice
                            : product.price
                        )}
                      </p>
                      <small
                        style={{
                          textDecorationLine: "line-through",
                          color: product.promotionPrice ? "gray" : "white"
                        }}
                      >
                        {product.promotionPrice
                          ? currencyFormat(product.price)
                          : "None"}
                      </small>
                    </div>
                    <div className="col-xs-1">
                      <input
                        className="form-control"
                        type="checkbox"
                        onClick={({ target }) => {
                          const checked = target.checked;
                          const { selectedProductIds } = this.form;
                          if (checked) selectedProductIds.push(product._id);
                          else
                            selectedProductIds.splice(
                              selectedProductIds.findIndex(
                                productId => productId === product._id
                              ),
                              1
                            );
                        }}
                      />
                    </div>
                  </div>
                ))}
                {isSearching ? (
                  <div className="text-center" style={{ width: "100%" }}>
                    <Loader />
                  </div>
                ) : searchErr !== null ? (
                  <div className="alert alert-danger">
                    SEARCHING ERROR! CLICK TO TRY AGAIN
                  </div>
                ) : (
                  products.length > 0 && (
                    <div
                      className="text-center"
                      style={{ width: "100%", marginTop: 50 }}
                    >
                      <button
                        className="btn btn-default"
                        onClick={() => this.loadMore()}
                      >
                        LOAD MORE ...
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-primary btn-fill"
              onClick={() => {
                const { selectedProductIds } = this.form;
                this.setState({
                  showProductPicker: false,
                  selectedProducts: products
                    .filter(product =>
                      selectedProductIds.find(id => id === product._id)
                    )
                    .map(product => ({
                      ...product,
                      currentPrice: product.promotionPrice
                        ? product.promotionPrice
                        : product.price
                    }))
                });
                this.form.selectedProductIds = [];
              }}
            >
              Select
            </button>
            <button
              type="button"
              className="btn btn-default"
              onClick={() => {
                this.setState({ showProductPicker: false });
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
        <div className="row">
          <div className="col-md-5 col-xs-12">
            <h3>PROMOTIONS</h3>
            <div
              className="list-group"
              style={{ overflowY: "auto", height: 600 }}
            >
              <div
                className="text-center"
                style={{
                  position: "absolute",
                  width: "100%"
                }}
              >
                {isLoading ? (
                  <Loader />
                ) : (
                  <p style={{ color: "gray" }}>NO PROMOTIONS FOUND</p>
                )}
              </div>
              {data.length > 0 && (
                <div className="card">
                  {data.map((promotion, index) => (
                    <a
                      key={"promotion-" + index}
                      href="javascript:;"
                      className={`list-group-item list-group-item-action flex-column align-items-start ${
                        this.state.selectedPromotion === promotion
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        this.setState({ selectedPromotion: promotion })
                      }
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1" style={{ fontWeight: "bold" }}>
                          {promotion.name}
                        </h5>
                        <small>
                          {formatTime(promotion.start_at)} -{" "}
                          {formatTime(promotion.end_at)}
                        </small>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-7 col-xs-12">
            <h3 className="mt-2 mb-2">PROMOTION DETAIL</h3>
            <div style={{ overflowY: "auto", height: 600 }}>
              <div
                className="text-center"
                style={{
                  position: "absolute",
                  width: "100%"
                }}
              >
                {selectedPromotion === null && (
                  <p style={{ color: "gray" }}>NO PROMOTION SELECTED</p>
                )}
              </div>
              {selectedPromotion !== null && (
                <div className="container-fluid">
                  <img
                    src={selectedPromotion.poster_url}
                    alt="Promotion poster"
                    style={{ width: "100%", height: "auto" }}
                  />
                  <h2>
                    <b>{selectedPromotion.name}</b>
                  </h2>
                  <small>
                    {formatTime(selectedPromotion.start_at)} -{" "}
                    {formatTime(selectedPromotion.end_at)}
                  </small>
                  <h3>
                    <b>PRODUCTS</b>
                  </h3>
                  {selectedPromotion.products.map(product => (
                    <div
                      className="row clickable"
                      key={"product-" + product._id}
                      onClick={() =>
                        history.push("/main/product/detail/" + product._id)
                      }
                    >
                      <div
                        className="col-xs-4"
                        style={{ paddingTop: 10, paddingBottom: 10 }}
                      >
                        <img
                          src={product.mainPicture}
                          alt="Product picture"
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      <div className="col-xs-7">
                        <h3 className="display-4" style={{ color: "red" }}>
                          {product.name}
                        </h3>
                        <p>
                          <text
                            style={{
                              textDecorationLine: "line-through",
                              color: "gray"
                            }}
                          >
                            {currencyFormat(product.price)}
                          </text>{" "}
                          -> {currencyFormat(product.promotionPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <h3>CREATE PROMOTION</h3>
        <form
          name="promotion_form"
          onSubmit={async e => {
            e.preventDefault();
            if (this.state.isSubmittingForm) return;
            if (selectedProducts.length === 0)
              return toast("PLEASE SELECT SOME PRODUCTS", "error");
            const { name, start, end, sendNotification, sendMail } = e.target;
            const obj = {
              name: name.value,
              start: start.value,
              end: end.value,
              sendNotification: sendNotification.checked,
              posterUrl: this.state.currentPicture,
              sendMail: sendMail.checked,
              products: selectedProducts.map(product => ({
                product_id: product._id,
                new_price:
                  product.currentPrice -
                  this.state.promotionRate * product.currentPrice / 100
              }))
            };
            console.log(obj);
            this.setState({ isSubmittingForm: true });
            let err = "UNDEFINED ERROR! TRY AGAIN LATER";
            try {
              const { status } = await request(
                "/promotions",
                "POST",
                { Authorization: "JWT " + token },
                obj
              );
              if (status === 200) {
                toast("ADD PROMOTION SUCCESSFULLY", "success");
                loadPromotions();
                return this.setState({
                  isSubmittingForm: false,
                  selectedPromotion: null
                });
              } else if (status === 401) {
                err = "AUTHENTICATION FAILED. PLEASE CHECK YOUR ACCOUNT ROLE!";
              }
            } catch (error) {}
            toast(err, "error");
            this.setState({ isSubmittingForm: false });
          }}
        >
          <div className="form-group row">
            <label
              className="col-sm-3 col-form-label font-weight-bold text-right"
              style={{ paddingTop: 10 }}
            >
              POSTER
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                name="poster"
                className="form-control border-input"
                placeholder="Enter picture URL"
                value={this.state.currentPicture}
                onChange={({ target }) =>
                  this.setState({ currentPicture: target.value })
                }
                required
              />
              {this.state.currentPicture !== "" ? (
                <img
                  src={this.state.currentPicture}
                  alt=""
                  style={{ width: "100%", height: "auto" }}
                />
              ) : (
                <p>Please enter picture url on the textbox above</p>
              )}
            </div>
          </div>
          <div className="form-group row">
            <label
              className="col-sm-3 col-form-label font-weight-bold text-right"
              style={{ paddingTop: 10 }}
            >
              NAME
            </label>
            <div className="col-sm-9">
              <input
                type="text"
                name="name"
                placeholder="Enter promotion name"
                className="form-control border-input"
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              className="col-sm-3 col-form-label font-weight-bold text-right"
              style={{ paddingTop: 10 }}
            >
              START TIME
            </label>
            <div className="col-sm-9">
              <DatePicker
                name="start"
                selected={this.state.start}
                onChange={date => this.setState({ start: date })}
                className="form-control border-input"
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label
              className="col-sm-3 col-form-label font-weight-bold text-right"
              style={{ paddingTop: 10 }}
            >
              END TIME
            </label>
            <div className="col-sm-9">
              <DatePicker
                name="end"
                selected={this.state.end}
                onChange={date => this.setState({ end: date })}
                className="form-control border-input"
                required
              />
              <Checkbox name="sendNotification" defaultChecked>
                Send notification to users
              </Checkbox>
              <Checkbox name="sendMail" defaultChecked>
                Send notification to users through email
              </Checkbox>
            </div>
          </div>
          <div className="form-group row">
            <label
              className="col-sm-3 col-form-label font-weight-bold text-right"
              style={{ paddingTop: 10 }}
            >
              PROMOTION RATE
            </label>
            <div className="col-sm-3">
              <input
                type="number"
                className="form-control border-input"
                value={this.state.promotionRate}
                onChange={({ target }) =>
                  this.setState({
                    promotionRate: target.value === "" ? 100 : target.value
                  })
                }
                required
              />
            </div>
            <div className="col-sm-1">
              <h5>%</h5>
            </div>
          </div>
          <div className="form-group row">
            <label
              className="col-sm-3 col-form-label font-weight-bold text-right"
              style={{ paddingTop: 10 }}
            >
              PRODUCTS
            </label>
            <div className="col-sm-9">
              {this.state.selectedProducts.map((product, index) => (
                <div
                  className="row clickable"
                  key={"selected-product-" + product._id}
                  // onClick={() =>
                  //   history.push("/main/product/detail/" + product._id)
                  // }
                >
                  <div
                    className="col-xs-2"
                    style={{ paddingTop: 10, paddingBottom: 10 }}
                  >
                    <img
                      src={product.mainPicture}
                      alt="Product picture"
                      style={{ width: 100, height: 100 }}
                    />
                  </div>
                  <div className="col-xs-8">
                    <h3 className="display-4" style={{ color: "red" }}>
                      {product.name}
                    </h3>
                    <p>
                      {currencyFormat(product.currentPrice)} ->{" "}
                      <b>
                        {currencyFormat(
                          product.currentPrice -
                            this.state.promotionRate *
                              product.currentPrice /
                              100
                        )}
                      </b>
                    </p>
                  </div>
                  <div className="col-xs-1">
                    <i
                      className="fa fa-remove fa-2x"
                      style={{ color: "red" }}
                      onClick={() => {
                        const newArray = selectedProducts;
                        newArray.splice(index, 1);
                        this.setState({ selectedProducts: newArray });
                      }}
                    />
                  </div>
                </div>
              ))}
              <button
                className="btn btn-default btn-fill"
                type="button"
                onClick={() =>
                  this.setState({ showProductPicker: true, marginTop: 50 })
                }
              >
                <i className="fa fa-plus" />
              </button>
            </div>
          </div>
          <div className="text-center">
            <button
              className="btn btn-success btn-fill"
              type="submit"
              disabled={this.state.isSubmittingForm}
            >
              {this.state.isSubmittingForm ? (
                <i className="fa fa-circle-o-notch" />
              ) : (
                "ADD PROMOTION"
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state.promotion,
  token: state.user.token
});
const mapDispatchToProps = dispatch => ({
  loadPromotions: () => dispatch(loadPromotions()),
  toast: (message, level) => dispatch(toast(message, level))
});
const ReduxForm = reduxForm({
  form: "promotion_form",
  touchOnBlur: false,
  enableReinitialize: true,
  onSubmitFail: () => {},
  validate: values => {
    const errors = {};
    console.log(values);
    return errors;
  }
})(Promotion);

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
