import React, { Component } from "react";
import { connect } from "react-redux";
import { currencyFormat, parseToQueryString, request } from "../../utils";
import Loader from "./Loader";
import { Modal } from "react-bootstrap";
class ProductSelector extends Component {
  constructor(props) {
    super(props);
    this.form = {};
    this.state = {
      isSearching: false,
      products: [],
      err: null,
      q: undefined,
      category: undefined,
      selectedProducts: [],
      processing: false
    };
  }
  async search(productName, category) {
    const searchObj = {
      q: productName.value === "" ? undefined : productName.value,
      category: category.value === "all" ? undefined : category.value
    };
    const query = parseToQueryString(searchObj);
    try {
      this.setState({
        products: [],
        isSearching: true,
        err: null,
        ...searchObj
      });
      const { status, data } = await request(
        "/products/search?" + query + "&offset=0&limit=10",
        "GET"
      );
      if (status === 200)
        return this.setState({
          isSearching: false,
          products: data
        });
    } catch (error) {}
    this.setState({
      isSearching: false,
      err: "ERROR"
    });
  }
  async loadMore() {
    const { q, category, products: oldArray } = this.state;
    const query = parseToQueryString({
      q,
      category
    });
    try {
      this.setState({ isSearching: true, err: null });
      const { status, data } = await request(
        "/products/search?" + query + `&offset=${oldArray.length}&limit=10`,
        "GET"
      );
      if (status === 200)
        return this.setState({
          isSearching: false,
          products: oldArray.concat(data)
        });
    } catch (error) {}
    this.setState({
      isSearching: false,
      err: "ERROR"
    });
  }
  render() {
    const { displayCondition, doJob, jobName, open, close } = this.props;
    const {
      isSearching,
      products,
      err,
      selectedProducts,
      processing
    } = this.state;
    return (
      <Modal bsSize="lg" show={open}>
        <Modal.Header>
          <Modal.Title>SELECT PRODUCTS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <h4>SEARCH FOR PRODUCTS</h4>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    const { productName, category } = this.form;
                    this.search(productName, category);
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div className="form-group" style={{ width: "60%" }}>
                      <input
                        ref={ref => (this.form.productName = ref)}
                        type="text"
                        className="form-control border-input"
                        placeholder="Search for product name"
                        style={{
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0
                        }}
                      />
                    </div>
                    <div className="form-group" style={{ width: "40%" }}>
                      <select
                        ref={ref => (this.form.category = ref)}
                        className="form-control border-input"
                        style={{
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0
                        }}
                      >
                        <option value="all" defaultValue>
                          All products
                        </option>
                        <option value="Phone">Phone</option>
                        <option value="Tablet">Tablet</option>
                        <option value="Accessory">Accessory</option>
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
                <div
                  style={{
                    overflowY: "auto",
                    height: 500,
                    marginTop: 20,
                    width: "100%"
                  }}
                >
                  {products
                    .filter(
                      product =>
                        !selectedProducts.find(
                          curProduct => curProduct._id === product._id
                        ) && displayCondition(product)
                    )
                    .map(product => (
                      <div
                        className="clickable"
                        key={"product-" + product._id}
                        style={{
                          marginBottom: 20,
                          paddingTop: 20,
                          paddingBottom: 20,
                          width: "100%",
                          display: "flex"
                        }}
                        onClick={() =>
                          !processing &&
                          this.setState({
                            selectedProducts: this.state.selectedProducts.concat(
                              product
                            )
                          })
                        }
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
                        </div>
                      </div>
                    ))}
                  {isSearching ? (
                    <div className="text-center" style={{ width: "100%" }}>
                      <Loader />
                    </div>
                  ) : err !== null ? (
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
              <div className="col-md-6">
                <h4>SELECTED PRODUCTS</h4>
                {selectedProducts.length > 0 ? (
                  <div
                    style={{ overflowY: "auto", height: 600, width: "100%" }}
                  >
                    {selectedProducts.map(product => (
                      <div
                        className="clickable"
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
                            <i
                              className="fa fa-remove clickable pull-right"
                              style={{ color: "orange" }}
                              onClick={() => {
                                if (processing) return;
                                const newList = selectedProducts.splice(0);
                                const deletedId = product._id;
                                const deletedIndex = newList.findIndex(
                                  product => product._id === deletedId
                                );
                                if (deletedIndex > -1) {
                                  newList.splice(deletedIndex, 1);
                                  this.setState({ selectedProducts: newList });
                                }
                              }}
                            />
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
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center" style={{ width: "100%" }}>
                    <p style={{ color: "gray" }}>NO PRODUCT SELECTED</p>
                  </div>
                )}
              </div>
            </div>
            <div
              className="text-right"
              style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-primary btn-fill"
            disabled={
              processing || isSearching || selectedProducts.length === 0
            }
            type="button"
            onClick={async () => {
              if (processing || !doJob) return;
              this.setState({ processing: true });
              try {
                await doJob(selectedProducts);
                this.setState({ processing: false, selectedProducts: [] });
                close();
              } catch (error) {
                this.setState({ processing: false });
              }
            }}
          >
            {processing ? <i className="fa fa-circle-o-notch" /> : jobName}
          </button>
          <button className="btn btn-default btn-fill" onClick={() => close()}>
            CANCEL
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ProductSelector);
