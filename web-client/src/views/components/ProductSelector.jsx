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
                        className="row clickable"
                        style={{
                          marginBottom: 20,
                          borderTop: "1px solid gray",
                          paddingTop: 20,
                          paddingBottom: 20
                        }}
                        key={"searched-product-" + product._id}
                        onClick={() =>
                          !processing &&
                          this.setState({
                            selectedProducts: this.state.selectedProducts.concat(
                              product
                            )
                          })
                        }
                        // onClick={() =>
                        //   history.push("/main/product/detail/" + product._id)
                        // }
                      >
                        <div className="col-md-4">
                          <img
                            src={product.mainPicture}
                            alt=""
                            style={{ width: "100%", height: "auto" }}
                          />
                        </div>
                        <div className="col-md-7">
                          <h4>
                            <b style={{ color: "red", fontSize: 25 }}>
                              {product.name}
                            </b>
                          </h4>
                          <small>ID: {product._id}</small>
                          {product.promotionPrice ? (
                            <p>
                              <code
                                style={{
                                  textDecorationLine: "line-through",
                                  color: "gray"
                                }}
                              >
                                {currencyFormat(product.price)}
                              </code>{" "}
                              <b>{currencyFormat(product.promotionPrice)}</b>
                            </p>
                          ) : (
                            <p>
                              <b>{currencyFormat(product.price)}</b>
                            </p>
                          )}
                        </div>
                        <div className="col-md-1">
                          {/* <input
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
                  /> */}
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
                        className="row clickable"
                        style={{
                          marginBottom: 20,
                          borderTop: "1px solid gray",
                          paddingTop: 20,
                          paddingBottom: 20
                        }}
                        key={"selected-product-" + product._id}
                        // onClick={() =>
                        //   history.push("/main/product/detail/" + product._id)
                        // }
                      >
                        <div className="col-md-1">
                          <i
                            className="fa fa-remove clickable"
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
                        </div>
                        <div className="col-md-4">
                          <img
                            src={product.mainPicture}
                            alt=""
                            style={{ width: "100%", height: "auto" }}
                          />
                        </div>
                        <div className="col-md-7">
                          <h4>
                            <b style={{ color: "red", fontSize: 25 }}>
                              {product.name}
                            </b>
                          </h4>
                          <small>ID: {product._id}</small>
                          {product.promotionPrice ? (
                            <p>
                              <code
                                style={{
                                  textDecorationLine: "line-through",
                                  color: "gray"
                                }}
                              >
                                {currencyFormat(product.price)}
                              </code>{" "}
                              <b>{currencyFormat(product.promotionPrice)}</b>
                            </p>
                          ) : (
                            <p>
                              <b>{currencyFormat(product.price)}</b>
                            </p>
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
