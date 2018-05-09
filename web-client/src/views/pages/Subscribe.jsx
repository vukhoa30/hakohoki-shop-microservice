import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ProductSelector from "../components/ProductSelector";
import Comment from "../components/Comment";
import Loader from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";
import { Well, Collapse } from "react-bootstrap";
import {
  loadProductData,
  loadProductFeedback,
  subscribeProducts,
  loadSubscribedProducts,
  removeSubscribedProduct,
  toast,
  giveAnswer
} from "../../api";
import { currencyFormat, formatTime, parseToObject } from "../../utils";
class Subscribe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {
        _v: null,
        productId: null,
        commentId: null
      },
      filterSubscription: "",
      viewProduct: false,
      selectedProduct: null,
      selectedCommentId: null,
      showProductSelector: false,
      isRemoving: false,
      confirmRemovedDialog: {
        isShowing: false,
        productName: null,
        productId: null
      },
      submittingAnswer: false
    };
    const { loadSubscribedProducts, token } = this.props;
    loadSubscribedProducts(token);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { _v, product_id, comment_id } = parseToObject(
      nextProps.location.search
    );
    if (!_v || prevState.query._v === _v) return null;
    return {
      query: {
        _v,
        productId: product_id ? product_id : null,
        commentId: comment_id ? comment_id : null
      }
    };
  }
  componentDidUpdate(prevProps, prevState) {
    // const { currentProductData, currentProductFeedback, data: subscriptions } = this.props;
    // const {
    //   currentProductData: prevProductData,
    //   currentProductFeedback: prevProductFeedback
    // } = prevProps;
    // const { productId } = this.state.query
    // if (
    //   currentProductData.isLoading !== prevProductData.isLoading &&
    //   !currentProductData.isLoading
    // ) {

    // } else if (
    //   currentProductFeedback.isLoading !== prevProductFeedback.isLoading &&
    //   !currentProductFeedback.isLoading
    // ) {
    // }
    const {
      currentProductData,
      isLoading,
      currentProductFeedback,
      data: subscriptions,
      loadProductFeedback
    } = this.props;
    const {
      isLoading: prevLoading,
      currentProductData: prevProductData,
      currentProductFeedback: prevProductFeedback
    } = prevProps;
    const { query, selectedProduct } = this.state;
    const { query: prevQuery } = prevState;
    if (isLoading !== prevLoading && !isLoading) {
      console.log(query);
      this.selectProduct(
        subscriptions.find(
          subscription => subscription.productId === query.productId
        )
      );
    } else if (query._v !== prevQuery._v) {
      this.setState({ viewProduct: false });
      if (
        selectedProduct === null ||
        selectedProduct.productId !== query.productId
      )
        this.selectProduct(
          subscriptions.find(
            subscription => subscription.productId === query.productId
          )
        );
      else loadProductFeedback(query.productId);
    } else if (
      currentProductFeedback.isLoading !== prevProductFeedback.isLoading &&
      !currentProductFeedback.isLoading
    )
      if (query.commentId !== null)
        this.setState({ selectedCommentId: query.commentId });
  }
  selectProduct(product) {
    const { loadProductFeedback, toast } = this.props;
    if (!product) {
      return this.setState({ selectedProduct: null });
    }
    this.setState({
      selectedProduct: product,
      viewProduct: false,
      selectedCommentId: null
    });
    loadProductFeedback(product.productId);
  }
  loadProductDetail() {
    const { currentProductData, loadProductData } = this.props;
    const { isLoading, _id } = currentProductData;
    const { selectedProduct } = this.state;
    if (isLoading || _id === selectedProduct.productId) return;
    loadProductData(selectedProduct.productId);
  }
  render() {
    const {
      viewProduct,
      selectedProduct,
      selectedCommentId,
      showProductSelector,
      isRemoving,
      confirmRemovedDialog,
      comment,
      submittingAnswer,
      filterSubscription
    } = this.state;
    const {
      isShowing,
      productName: removeProductName,
      productId: removeProductId
    } = confirmRemovedDialog;
    const {
      currentProductData,
      currentProductFeedback,
      token,
      data: subscriptions,
      isLoading,
      err,
      loadSubscribedProducts,
      loadProductFeedback,
      toast,
      history,
      location
    } = this.props;
    return (
      <div className="container-fluid">
        <ConfirmDialog
          isOpen={isShowing}
          title="REMOVING PRODUCT"
          content={`Are you sure to remove product ${removeProductName} from your subscription list?`}
          onResult={res => {
            if (res) {
              this.setState({ isRemoving: true });
              removeSubscribedProduct(removeProductId, token)
                .then(
                  () => {
                    toast(
                      "REMOVE PRODUCT FROM YOUR SUBSCRITION SUCCESSFULLY!",
                      "success"
                    );
                    loadSubscribedProducts(token);
                  },
                  err => toast(err, "error")
                )
                .finally(() => this.setState({ isRemoving: false }));
            }
            this.setState({ confirmRemovedDialog: { isShowing: false } });
          }}
        />
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <h4 style={{ marginTop: 0 }}>
              SUBSCRIBED PRODUCTS
              <i
                className="fa fa-plus clickable pull-right"
                style={{ color: "blue" }}
                onClick={() => this.setState({ showProductSelector: true })}
              />
            </h4>
            {isLoading ? (
              <div className="text-center" style={{ paddingTop: 20 }}>
                <Loader />
              </div>
            ) : err !== null ? (
              <div
                className="alert alert-danger clickable"
                onClick={() => loadSubscribedProducts(token)}
              >
                COULD NOT LOAD SUBSCRIPTIONS. CLICK TO TRY AGAIN!
              </div>
            ) : subscriptions.length === 0 ? (
              <p
                className="text-center"
                style={{ marginTop: 20, color: "gray" }}
              >
                NO SUBSCRIPTIONS
              </p>
            ) : (
              <div>
                <div className="form-group">
                  <input
                    ref={ref => (this.filter = ref)}
                    onChange={() =>
                      this.setState({ filterSubscription: this.filter.value })
                    }
                    type="text"
                    className="form-control border-input"
                    placeholder="Filter product by name"
                  />
                </div>
                <div style={{ height: 500, overflowY: "auto", width: "100%" }}>
                  {isRemoving && (
                    <div
                      className="text-center"
                      style={{
                        width: "100%",
                        position: "absolute",
                        zIndex: 100,
                        paddingTop: 100
                      }}
                    >
                      <Loader />
                    </div>
                  )}
                  <div style={{ opacity: isRemoving ? 0.3 : 1 }}>
                    {subscriptions
                      .filter(
                        subscription =>
                          subscription.productName.search(
                            new RegExp(filterSubscription, "i")
                          ) > -1
                      )
                      .map(subscription => (
                        <div
                          className="clickable"
                          key={"subscription-" + subscription.productId}
                          style={{
                            marginBottom: 20,
                            paddingTop: 20,
                            paddingBottom: 20,
                            width: "100%",
                            display: "flex"
                          }}
                          onClick={() => {
                            if (
                              selectedProduct !== null &&
                              selectedProduct.productId ===
                                subscription.productId
                            )
                              return;
                            history.push({
                              ...location,
                              search: `?_v=${new Date().getTime()}&product_id=${
                                subscription.productId
                              }`
                            });
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            {selectedProduct !== null &&
                              selectedProduct.productId ===
                                subscription.productId && (
                                <i
                                  className="fa fa-caret-right"
                                  style={{ color: "blue", fontSize: 20 }}
                                />
                              )}
                            <img
                              src={subscription.mainPicture}
                              alt=""
                              style={{ width: 50, height: "auto" }}
                            />
                          </div>
                          <div style={{ flex: 3 }}>
                            <p style={{ marginBottom: 0 }}>
                              <b style={{ color: "red" }}>
                                {subscription.productName}
                              </b>
                              <i
                                className="fa fa-remove clickable pull-right"
                                style={{ color: "orange" }}
                                onClick={e => {
                                  e.stopPropagation();
                                  if (isRemoving) return;
                                  this.setState({
                                    confirmRemovedDialog: {
                                      isShowing: true,
                                      productName: subscription.productName,
                                      productId: subscription.productId
                                    }
                                  });
                                }}
                              />
                            </p>
                            <small>ID: {subscription.productId}</small>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="col-md-8 col-xs-12">
            {selectedProduct === null ? (
              <p className="text-center">NO PRODUCT SELECTED</p>
            ) : (
              <div>
                <Well>
                  <div style={{ width: "100%" }}>
                    <h4 style={{ color: "red", marginTop: 0 }}>
                      {selectedProduct.productName}
                      <small className="pull-right">
                        <Link
                          to={
                            "/main/product/detail/" + selectedProduct.productId
                          }
                        >
                          >> Access this page
                        </Link>
                      </small>
                    </h4>
                    <a
                      href="javascript:;"
                      onClick={() =>
                        this.setState({ viewProduct: !this.state.viewProduct })
                      }
                    >
                      <i
                        className={
                          this.state.viewProduct
                            ? "fa fa-caret-up"
                            : "fa fa-caret-down"
                        }
                      >
                        {" "}
                      </i>
                      View detail
                    </a>
                  </div>
                  <Collapse
                    in={this.state.viewProduct}
                    onEnter={() => this.loadProductDetail()}
                  >
                    {currentProductData.isLoading ? (
                      <div className="text-center">
                        <Loader />
                      </div>
                    ) : currentProductData.err !== null ? (
                      <div
                        className="alert alert-danger"
                        onClick={() => this.loadProductDetail()}
                      >
                        COULD NOT LOAD PRODUCT DATA! CLICK TO TRY AGAIN
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            width: "100%",
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            marginTop: 10
                          }}
                        >
                          {currentProductData.additionPicture.map(picture => (
                            <img
                              key={"addition-picture-" + picture}
                              src={picture}
                              alt=""
                              style={{
                                width: 100,
                                height: "auto",
                                marginRight: 50
                              }}
                            />
                          ))}
                        </div>
                        <div className="row" style={{ marginTop: 20 }}>
                          <div className="col-md-6 col-xs-12">
                            <h3 style={{ marginTop: 0, color: "orange" }}>
                              <b>
                                {currencyFormat(
                                  currentProductData.promotionPrice
                                    ? currentProductData.promotionPrice
                                    : currentProductData.price
                                )}
                              </b>
                            </h3>
                            <div className="form-group row">
                              <label className="col-sm-5 col-form-label font-weight-bold">
                                Quantity
                              </label>
                              <div className="col-sm-7">
                                <input
                                  type="text"
                                  readOnly
                                  className="form-control-plaintext"
                                  defaultValue={currentProductData.quantity}
                                />
                              </div>
                            </div>
                            <div className="form-group row">
                              <label
                                htmlFor="staticEmail"
                                className="col-sm-5 col-form-label font-weight-bold"
                              >
                                Added at
                              </label>
                              <div className="col-sm-7">
                                <input
                                  type="text"
                                  readOnly
                                  className="form-control-plaintext"
                                  defaultValue={formatTime(
                                    currentProductData.addedAt
                                  )}
                                />
                              </div>
                            </div>
                            <div className="form-group row">
                              <label
                                htmlFor="staticEmail"
                                className="col-sm-5 col-form-label font-weight-bold"
                              >
                                Guarantee
                              </label>
                              <div className="col-sm-7">
                                <input
                                  type="text"
                                  readOnly
                                  className="form-control-plaintext"
                                  defaultValue={
                                    currentProductData.guarantee + " months"
                                  }
                                />
                              </div>
                            </div>
                            <div className="form-group row">
                              <label
                                htmlFor="staticEmail"
                                className="col-sm-5 col-form-label font-weight-bold"
                              >
                                Description
                              </label>
                              <div className="col-sm-7">
                                <textarea
                                  type="text"
                                  readOnly
                                  className="form-control-plaintext"
                                  defaultValue={currentProductData.description}
                                  rows={5}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-xs-12">
                            <h4 style={{ marginTop: 0 }}>
                              <b>SPECIFICATIONS</b>
                            </h4>
                            {currentProductData.specifications.map(
                              specification => (
                                <div className="form-group row">
                                  <label className="col-sm-5 col-form-label font-weight-bold">
                                    {specification.name}
                                  </label>
                                  <div className="col-sm-7">
                                    <input
                                      type="text"
                                      readOnly
                                      className="form-control-plaintext"
                                      defaultValue={specification.value}
                                    />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Collapse>
                </Well>
                <div className="row">
                  <div
                    className="col-md-6 col-xs-12 card"
                    style={{
                      height: 600,
                      overflowY: "auto",
                      paddingTop: 20
                    }}
                  >
                    <div className="card-body">
                      {currentProductFeedback.isLoading ? (
                        <div className="text-center" style={{ width: "100%" }}>
                          <Loader />
                        </div>
                      ) : currentProductFeedback.err !== null ? (
                        <div
                          className="alert alert-danger clickable"
                          onClick={() =>
                            loadProductFeedback(selectedProduct.productId)
                          }
                        >
                          COULD NOT LOAD COMMENTS! CLICK TO TRY AGAIN
                        </div>
                      ) : (
                        currentProductFeedback.comments
                          .filter(comment => !comment.parentId)
                          .reverse()
                          .map(comment => (
                            <Comment
                              comment={comment}
                              key={"comment-" + comment.id}
                              selected={comment.id === selectedCommentId}
                              select={() =>
                                this.setState({ selectedCommentId: comment.id })
                              }
                            />
                          ))
                      )}
                    </div>
                  </div>
                  <div
                    className="col-md-6 col-xs-12"
                    style={{ paddingTop: 20 }}
                  >
                    {selectedCommentId !== null && (
                      <div>
                        <div
                          style={{
                            height: 550,
                            overflowY: "auto",
                            width: "100%"
                          }}
                        >
                          {currentProductFeedback.comments
                            .filter(
                              comment => comment.parentId === selectedCommentId
                            )
                            .reverse()
                            .map(comment => (
                              <Comment
                                key={"comment-" + comment.id}
                                comment={comment}
                              />
                            ))}
                        </div>
                        <form
                          ref={ref => (this.commentForm = ref)}
                          onSubmit={async e => {
                            e.preventDefault();
                            if (submittingAnswer) return;
                            this.setState({ submittingAnswer: true });
                            const { comment } = e.target;
                            const content = comment.value;
                            this.commentForm.reset();
                            const { ok, _error } = await giveAnswer(
                              selectedProduct.productId,
                              content,
                              selectedCommentId,
                              token
                            );
                            if (ok) {
                              loadProductFeedback(selectedProduct.productId);
                            } else {
                              toast(_error, "error");
                            }
                            this.setState({ submittingAnswer: false });
                          }}
                        >
                          <div className="row">
                            <div
                              className="col-xs-10"
                              style={{ paddingRight: 0, paddingLeft: 0 }}
                            >
                              <div className="form-group">
                                <input
                                  name="comment"
                                  type="text"
                                  className="form-control border-input"
                                  placeholder="Enter comment"
                                  required
                                />
                              </div>
                            </div>
                            <div
                              className="col-xs-2"
                              style={{ paddingLeft: 0 }}
                            >
                              <button
                                type="submit"
                                disabled={submittingAnswer}
                                className="btn btn-default btn-fill btn-full"
                              >
                                {submittingAnswer ? (
                                  <i className="fa fa-circle-o-notch fa-spin" />
                                ) : (
                                  "Send"
                                )}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* <div
              className="text-center"
              style={{ width: "100%", marginTop: 100 }}
            >
              <p style={{ color: "gray" }}>SELECT PRODUCT TO SEE DETAIL</p>
            </div> */}
          </div>
        </div>
        <ProductSelector
          open={showProductSelector}
          displayCondition={product =>
            !subscriptions.find(
              subscription => subscription.productId === product._id
            )
          }
          jobName="SUBSCRIBE THESE PRODUCTS"
          doJob={products =>
            subscribeProducts(products.map(product => product._id), token).then(
              () => {
                toast("SUBSCRIBE PRODUCT SUCCESSFULLY!", "success");
                loadSubscribedProducts(token);
                return Promise.resolve();
              },
              err => {
                toast(err, "error");
                Promise.reject();
              }
            )
          }
          close={() => this.setState({ showProductSelector: false })}
        />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  currentProductData: state.product.detail,
  currentProductFeedback: state.product.feedback,
  token: state.user.token,
  ...state.subscription
});
const mapDispatchToProps = dispatch => ({
  loadProductData: productId => dispatch(loadProductData(productId)),
  loadProductFeedback: productId => dispatch(loadProductFeedback(productId)),
  loadSubscribedProducts: token => dispatch(loadSubscribedProducts(token)),
  toast: (message, level) => dispatch(toast(message, level))
});
export default connect(mapStateToProps, mapDispatchToProps)(Subscribe);
