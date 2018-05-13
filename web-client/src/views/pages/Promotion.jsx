import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import Loader from "../components/Loader";
import {
  formatTime,
  currencyFormat,
  request,
  parseToQueryString,
  getToday
} from "../../utils";
import { loadPromotions, toast, selectProduct } from "../../api";
import DatePicker from "react-datepicker";
import { Checkbox, Modal } from "react-bootstrap";
import { differenceWith, uniqWith } from "lodash";
import moment from "moment";
import ProductSelector from "../components/ProductSelector";
import ImagePicker from "../components/ImagePicker.jsx";

class Promotion extends Component {
  constructor(props) {
    super(props);
    this.prices = {};
    this.state = {
      selectedPromotion: null,
      showDialog: false,
      selectedProducts: [],
      promotionPoster: null,
      productSelectorMode: "all",
      currentProcessingProduct: null,
      submitting: false
    };
    const { loadPromotions } = this.props;
    loadPromotions();
  }
  // async search(productName, category) {
  //   const query = parseToQueryString({
  //     q: productName.value === "" ? undefined : productName.value,
  //     category: category.value === "all" ? undefined : category.value
  //   });
  //   try {
  //     this.setState({ search: { ...query, isSearching: true, products: [] } });
  //     const { status, data } = await request(
  //       "/products/search?" + query + "&offset=0&limit=10",
  //       "GET"
  //     );
  //     if (status === 200)
  //       return this.setState({
  //         search: { isSearching: false, err: null, products: data, ...query }
  //       });
  //   } catch (error) {}
  //   this.setState({
  //     search: { isSearching: false, err: "Error", products: [], ...query }
  //   });
  // }
  // async loadMore() {
  //   const oldArray = this.state.search.products;
  //   this.setState({ search: { ...this.state.search, isSearching: true } });
  //   try {
  //     const query = parseToQueryString({
  //       q: this.state.search.q,
  //       category: this.state.search.category
  //     });
  //     const { status, data } = await request(
  //       "/products/search?" + query + `&offset=${oldArray.length}&limit=10`,
  //       "GET"
  //     );
  //     if (status === 200)
  //       return this.setState({
  //         search: {
  //           ...this.state.search,
  //           isSearching: false,
  //           err: null,
  //           products: oldArray.concat(data)
  //         }
  //       });
  //   } catch (error) {}
  //   this.setState({
  //     search: { ...this.state.search, isSearching: false, err: "Error" }
  //   });
  // }

  validate(data) {
    console.log(data);
    const { toast } = this.props;
    const start = new Date(data.start);
    const end = new Date(data.end);

    if (data.poster_url === null) {
      toast("PLEASE SELECT POSTER IMAGE", "error");
      return false;
    }

    if (start.getTime() >= end.getTime()) {
      toast("INVALID PROMOTION DURATION TIME", "error");
      return false;
    }

    for (let index = 0; index < data.products.length; index++) {
      const element = data.products[index];
      if (element.new_price && Number(element.new_price) <= 0) {
        toast("INVALID PRODUCT PRICE! PLEASE CHECK YOUR INPUT AGAIN", "error");
        return false;
      }
    }

    return true;
  }

  async submit(data) {
    const { toast, loadPromotions, token } = this.props;
    this.setState({ submitting: true });
    try {
      const { status } = await request(
        "/promotions",
        "POST",
        { Authorization: "JWT " + token },
        data
      );
      if (status === 200) {
        toast("NEW PROMOTION CREATED!", "success");
        this.setState({
          selectedProducts: [],
          promotionPoster: null
        });
        this.createPromotionForm.reset();
        loadPromotions();
      } else if (status === 401)
        toast("YOU ARE NOT AUTHORIZED TO CREATE PROMOTION", "error");
      else toast("INTERNAL SERVER ERROR! TRY AGAIN LATER", "error");
    } catch (error) {
      if (error === "CONNECTION_ERROR")
        toast("CONNECTION ERROR! TRY AGAIN LATER", "error");
      else toast("UNDEFINED ERROR! TRY AGAIN LATER", "error");
    }
    this.setState({ submitting: false });
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
      token,
      role,
      selectProduct
    } = this.props;
    const {
      selectedPromotion,
      selectedProducts,
      showDialog,
      productSelectorMode,
      currentProcessingProduct
      // search,
      // showProductPicker,
      // selectedProducts
    } = this.state;
    return (
      <div className="container-fluid">
        <ProductSelector
          open={showDialog}
          close={() => this.setState({ showDialog: false })}
          displayCondition={product =>
            productSelectorMode === "all"
              ? !selectedProducts.find(
                  selectedProduct => selectedProduct._id === product._id
                )
              : currentProcessingProduct._id !== product._id &&
                !currentProcessingProduct.giftProducts.find(
                  selectedProduct => selectedProduct._id === product._id
                )
          }
          jobName="SELECT PRODUCTS"
          doJob={products => {
            if (productSelectorMode === "all")
              this.setState({
                selectedProducts: this.state.selectedProducts.concat(
                  products.map(product => ({ ...product, giftProducts: [] }))
                )
              });
            else {
              const giftProducts = currentProcessingProduct.giftProducts.concat(
                products
              );
              const currentProductIndex = selectedProducts.findIndex(
                product => product._id === currentProcessingProduct._id
              );
              if (currentProductIndex > -1) {
                const newSelectedProducts = selectedProducts;
                newSelectedProducts[
                  currentProductIndex
                ].giftProducts = giftProducts;
                this.setState({
                  selectedProduct: newSelectedProducts,
                  productSelectorMode: "all",
                  currentProcessingProduct: null
                });
              }
            }
          }}
        />
        {/* <Modal width={800} show={showProductPicker}>
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
        </Modal> */}
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
                      className={`row list-group-item list-group-item-action flex-column align-items-start ${
                        this.state.selectedPromotion === promotion
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        this.setState({ selectedPromotion: promotion })
                      }
                    >
                      <div className="col-xs-3">
                        <img
                          src="assets/img/promotion.png"
                          alt=""
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      <div className="col-xs-9">
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1" style={{ fontWeight: "bold" }}>
                            {promotion.name}
                          </h5>
                          <small>
                            {formatTime(promotion.start_at)} -{" "}
                            {formatTime(promotion.end_at)}
                          </small>
                        </div>
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
                      className="clickable product-showcase"
                      onClick={() => selectProduct(product)}
                      key={"product-" + product._id}
                      style={{
                        marginBottom: 20,
                        paddingTop: 20,
                        paddingBottom: 20,
                        width: "100%",
                        display: "flex"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <img
                          src={
                            product.mainPicture
                              ? product.mainPicture
                              : "assets/img/unknown.png"
                          }
                          alt=""
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                      <div style={{ flex: 3, paddingLeft: 10 }}>
                        <p style={{ marginBottom: 0 }}>
                          <b style={{ color: "red" }}>{product.name}</b>
                        </p>
                        <small>ID: {product._id}</small>
                        {product.promotionPrice ? (
                          <div>
                            <h5 style={{ color: "red", marginBottom: 0 }}>
                              {currencyFormat(product.promotionPrice)}
                            </h5>
                            <small
                              style={{ textDecorationLine: "line-through" }}
                            >
                              {currencyFormat(product.price)}
                            </small>
                          </div>
                        ) : (
                          <h5 style={{ color: "red" }}>
                            {currencyFormat(product.price)}
                          </h5>
                        )}
                        <div style={{ width: "100%" }}>
                          {!product.giftProducts ||
                          product.giftProducts.length === 0 ? (
                            <p
                              className="text-center"
                              style={{ color: "gray" }}
                            >
                              NO ATTACHED PRODUCTS
                            </p>
                          ) : (
                            <div className="panel panel-default">
                              <div className="panel-body">
                                {product.giftProducts.map(
                                  (giftProduct, giftIndex) => (
                                    <div
                                      className="clickable product-showcase"
                                      onClick={e => {
                                        e.stopPropagation();
                                        selectProduct(giftProduct);
                                      }}
                                      key={
                                        "gift-product-" +
                                        product._id +
                                        "-" +
                                        giftProduct._id
                                      }
                                      style={{
                                        marginBottom: 20,
                                        paddingTop: 20,
                                        paddingBottom: 20,
                                        width: "100%",
                                        display: "flex"
                                      }}
                                    >
                                      <div style={{ flex: 1 }}>
                                        <img
                                          src={
                                            giftProduct.mainPicture
                                              ? giftProduct.mainPicture
                                              : "assets/img/unknown.png"
                                          }
                                          alt=""
                                          style={{
                                            width: "100%",
                                            height: "auto"
                                          }}
                                        />
                                      </div>
                                      <div style={{ flex: 3, padding: 10 }}>
                                        <p style={{ marginBottom: 0 }}>
                                          <b style={{ color: "red" }}>
                                            {giftProduct.name}
                                          </b>
                                        </p>
                                        <small>ID: {giftProduct._id}</small>
                                        <h5 style={{ fontWeight: "bold" }}>
                                          {currencyFormat(
                                            giftProduct.promotionPrice
                                              ? giftProduct.promotionPrice
                                              : giftProduct.price
                                          )}{" "}
                                        </h5>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {role === "manager" && (
          <div>
            <h3>CREATE PROMOTION</h3>
            <form
              ref={ref => (this.createPromotionForm = ref)}
              onSubmit={async e => {
                e.preventDefault();
                const {
                  name,
                  start,
                  end,
                  sendNotification,
                  sendMail
                } = e.target;
                const products = selectedProducts.map(product => ({
                  product_id: product._id,
                  new_price:
                    this.prices[product._id].value !== ""
                      ? this.prices[product._id].value
                      : undefined,
                  giftIds: product.giftProducts.map(
                    giftProduct => giftProduct._id
                  )
                }));
                const data = {
                  name: name.value,
                  posterUrl: this.state.promotionPoster,
                  start: start.value,
                  end: end.value,
                  sendNotification: sendNotification.checked,
                  sendMail: sendMail.checked,
                  products
                };

                return this.validate(data) && this.submit(data);
              }}
            >
              <div className="row">
                <div className="col-xs-5">
                  <div className="form-group">
                    <label>Promotion name:</label>
                    <input
                      placeholder="Enter promotion name"
                      type="text"
                      className="form-control border-input"
                      id="promotionName"
                      name="name"
                      required
                    />
                  </div>
                  <ImagePicker
                    instruction="CHOOSE PROMOTION IMAGE"
                    image={this.state.promotionPoster}
                    changeImage={url => this.setState({ promotionPoster: url })}
                  />
                  <div className="checkbox">
                    <label>
                      <input
                        type="checkbox"
                        value=""
                        defaultChecked
                        name="sendNotification"
                      />Send notification to user in client app
                    </label>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" value="" name="sendMail" />Send to
                      user mail
                    </label>
                  </div>
                  <div className="row">
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label>From</label>
                        <input
                          type="date"
                          className="form-control"
                          name="start"
                          required
                          defaultValue={getToday()}
                        />
                      </div>
                    </div>
                    <div className="col-xs-6">
                      <div className="form-group">
                        <label>To</label>
                        <input
                          type="date"
                          className="form-control"
                          name="end"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xs-7">
                  <h4 style={{ marginTop: 0 }}>
                    SELECTED PRODUCTS
                    <button
                      type="button"
                      className="btn btn-default btn-fill pull-right"
                      onClick={() =>
                        this.setState({
                          showDialog: true,
                          productSelectorMode: "all"
                        })
                      }
                    >
                      <i className="fa fa-plus" />
                      ADD PRODUCT
                    </button>
                  </h4>
                  {selectedProducts.length === 0 ? (
                    <p
                      className="text-center"
                      style={{ marginTop: 50, color: "gray" }}
                    >
                      NO PRODUCT SELECTED
                    </p>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 500,
                        overflowY: "auto"
                      }}
                    >
                      {selectedProducts.map((product, index) => (
                        <div
                          key={"product-" + product._id}
                          style={{
                            marginBottom: 20,
                            paddingTop: 20,
                            paddingBottom: 20,
                            width: "100%",
                            display: "flex"
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <img
                              src={
                                product.mainPicture
                                  ? product.mainPicture
                                  : "assets/img/unknown.png"
                              }
                              alt=""
                              style={{ width: "100%", height: "auto" }}
                            />
                          </div>
                          <div style={{ flex: 3, padding: 10 }}>
                            <p style={{ marginBottom: 0 }}>
                              <b style={{ color: "red" }}>{product.name}</b>
                              <i
                                className="fa fa-remove clickable pull-right"
                                style={{ color: "orange" }}
                                onClick={() => {
                                  const newSelectedProducts = selectedProducts;
                                  newSelectedProducts.splice(index, 1);
                                  this.setState({
                                    selectedProducts: newSelectedProducts
                                  });
                                }}
                              />
                            </p>
                            <small>ID: {product._id}</small>
                            <div className="row">
                              <div className="col-xs-5">
                                <h5 style={{ fontWeight: "bold" }}>
                                  {currencyFormat(
                                    product.promotionPrice
                                      ? product.promotionPrice
                                      : product.price
                                  )}{" "}
                                  ->
                                </h5>
                              </div>
                              <div className="col-xs-5">
                                <input
                                  type="number"
                                  className="form-control border-input"
                                  placeholder="Enter new price"
                                  ref={ref => (this.prices[product._id] = ref)}
                                />
                              </div>
                              <div className="col-xs-2">
                                <h5 style={{ fontWeight: "bold" }}>VNĐ</h5>
                              </div>
                            </div>
                            <div
                              className="panel panel-default"
                              style={{ marginTop: 20 }}
                            >
                              <div className="panel-heading">
                                <p>
                                  <b>
                                    <small>ATTACHED PRODUCTS</small>
                                  </b>{" "}
                                  <i
                                    className="fa fa-plus pull-right clickable"
                                    onClick={() =>
                                      this.setState({
                                        productSelectorMode: "specific",
                                        currentProcessingProduct: product,
                                        showDialog: true
                                      })
                                    }
                                  />
                                </p>
                              </div>
                              <div className="panel-body">
                                {product.giftProducts.length === 0 ? (
                                  <p
                                    className="text-center"
                                    style={{ color: "gray" }}
                                  >
                                    NO PRODUCT SELECTED
                                  </p>
                                ) : (
                                  <div>
                                    {product.giftProducts.map(
                                      (giftProduct, giftIndex) => (
                                        <div
                                          key={
                                            "gift-product-" +
                                            product._id +
                                            "-" +
                                            giftProduct._id
                                          }
                                          style={{
                                            marginBottom: 20,
                                            paddingTop: 20,
                                            paddingBottom: 20,
                                            width: "100%",
                                            display: "flex"
                                          }}
                                        >
                                          <div style={{ flex: 1 }}>
                                            <img
                                              src={
                                                giftProduct.mainPicture
                                                  ? giftProduct.mainPicture
                                                  : "assets/img/unknown.png"
                                              }
                                              alt=""
                                              style={{
                                                width: "100%",
                                                height: "auto"
                                              }}
                                            />
                                          </div>
                                          <div style={{ flex: 3, padding: 10 }}>
                                            <p style={{ marginBottom: 0 }}>
                                              <b style={{ color: "red" }}>
                                                {giftProduct.name}
                                              </b>
                                              <i
                                                className="fa fa-remove clickable pull-right"
                                                style={{ color: "orange" }}
                                                onClick={() => {
                                                  const newSelectedProducts = selectedProducts;
                                                  newSelectedProducts[
                                                    index
                                                  ].giftProducts.splice(
                                                    giftIndex,
                                                    1
                                                  );
                                                  this.setState({
                                                    selectedProducts: newSelectedProducts
                                                  });
                                                }}
                                              />
                                            </p>
                                            <small>ID: {giftProduct._id}</small>
                                            <h5 style={{ fontWeight: "bold" }}>
                                              {currencyFormat(
                                                giftProduct.promotionPrice
                                                  ? giftProduct.promotionPrice
                                                  : giftProduct.price
                                              )}{" "}
                                            </h5>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div
                className="text-center"
                style={{ width: "100%", marginTop: 20 }}
              >
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={this.state.submitting}
                >
                  {this.state.submitting ? (
                    <i className="fa fa-spinner fa-spin" />
                  ) : (
                    "CREATE PROMOTION"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state.promotion,
  token: state.user.token,
  role: state.user.role
});
const mapDispatchToProps = dispatch => ({
  loadPromotions: () => dispatch(loadPromotions()),
  toast: (message, level) => dispatch(toast(message, level)),
  selectProduct: product => dispatch(selectProduct(product))
});

export default connect(mapStateToProps, mapDispatchToProps)(Promotion);
