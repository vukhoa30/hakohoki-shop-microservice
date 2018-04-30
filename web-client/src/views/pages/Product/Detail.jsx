import React, { Component } from "react";
import { connect } from "react-redux";
import { loadProductData, loadProductFeedback } from "../../../api";
import { currencyFormat, formatTime } from "../../../utils";
import { transform } from "lodash";
import Loader from "../../components/Loader";
import { Modal } from "react-bootstrap";
class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReview: false
    };
    this.loadData(this.props);
  }
  loadData(props) {
    const {
      match,
      product,
      loadProductData,
      loadProductFeedback,
      feedback
    } = props;
    const { id } = match.params;
    if (id !== product._id) loadProductData(id);
    if (id !== feedback._id) loadProductFeedback(id);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) this.loadData(nextProps);
  }

  renderStars(starCount, small = false) {
    const stars = [];
    let i = 0;
    for (; i < starCount; i++)
      stars.push(
        <i
          key={"star-" + i}
          className={`fa fa-star ${small ? "" : "fa-3x"}`}
          style={{ color: "orange", margin: 10 }}
        />
      );
    for (; i < 5; i++)
      stars.push(
        <i
          key={"star-" + i}
          className={`fa fa-star-o ${small ? "" : "fa-3x"}`}
          style={{ color: "orange", margin: 10 }}
        />
      );
    return stars;
  }
  render() {
    const { product, history, feedback, role } = this.props;
    const { reviews } = feedback;
    const statistic = transform(
      feedback.reviews,
      (result, review) => {
        result[review.reviewScore]++;
        return result;
      },
      {
        "5": 0,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0
      }
    );
    return (
      <div className="container-fluid">
        <Modal show={this.state.showReview}>
          <Modal.Header>
            <Modal.Title>REVIEWS</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={{ height: 600, overflowY: "auto" }}>
              {!feedback.isLoading &&
                reviews.map(review => (
                  <li
                    key={"review-" + review.id}
                    className="list-group-item list-group-item-action flex-column align-items-start"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1" style={{ fontWeight: "bold" }}>
                        {review.userName}
                      </h5>
                      <small>{formatTime(review.createdAt)}</small>
                    </div>
                    <div>{this.renderStars(review.reviewScore, true)}</div>
                    <p className="mb-1">{review.content}</p>
                  </li>
                ))}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.setState({ showReview: false })}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
        {product.isLoading ? (
          <div className="text-center">
            <Loader style={{ marginTop: 50 }} />
          </div>
        ) : (
          <div>
            <div className="text-right">
              <button
                className="btn btn-success"
                onClick={() =>
                  history.push("/main/product/feedback/" + product._id)
                }
                style={{ marginRight: 10 }}
              >
                View comments
              </button>
              {role === "manager" && (
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    history.push("/main/product/update-product/" + product._id)
                  }
                  style={{ marginRight: 10 }}
                >
                  Update product
                </button>
              )}
            </div>
            <div className="card" style={{ marginTop: 20 }}>
              <div className="content">
                <div className="row">
                  <div className="col-md-5 col-xs-12">
                    <img
                      style={{ width: "100%", height: "auto" }}
                      src={product.mainPicture}
                    />
                  </div>
                  <div className="col-md-7 col-xs-12">
                    <h1 className="display-4" style={{ color: "red" }}>
                      {product.name}
                    </h1>
                    <h1>
                      {currencyFormat(
                        product.promotionPrice
                          ? product.promotionPrice
                          : product.price
                      )}
                    </h1>
                    <p
                      style={{
                        textDecorationLine: "line-through",
                        color: "gray"
                      }}
                    >
                      {product.promotionPrice
                        ? currencyFormat(product.price)
                        : ""}
                    </p>
                    <hr className="my-4" />
                    <div className="form-group row">
                      <label
                        htmlFor="staticEmail"
                        className="col-sm-2 col-form-label font-weight-bold"
                      >
                        Guarantee
                      </label>
                      <div className="col-sm-10">
                        <input
                          type="text"
                          readOnly
                          className="form-control-plaintext"
                          defaultValue={product.guarantee + " months"}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="staticEmail"
                        className="col-sm-2 col-form-label font-weight-bold"
                      >
                        Added at
                      </label>
                      <div className="col-sm-10">
                        <input
                          type="text"
                          readOnly
                          className="form-control-plaintext"
                          defaultValue={formatTime(product.addedAt)}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="staticEmail"
                        className="col-sm-2 col-form-label font-weight-bold"
                      >
                        Description
                      </label>
                      <div className="col-sm-10">
                        <textarea
                          type="text"
                          readOnly
                          className="form-control-plaintext"
                          defaultValue={product.description}
                          rows={5}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {product.additionPicture.length > 0 && (
              <div>
                <h3 className="mt-5">ADDITIONAL PICTURES</h3>
                <div
                  className="pt-5 pb-5"
                  style={{
                    overflowX: "auto",
                    width: "100%",
                    whiteSpace: "nowrap"
                  }}
                >
                  {product.additionPicture.map(picture => (
                    <img
                      key={"addition-picture-" + picture}
                      className="mr-3"
                      style={{ width: 300, height: 300 }}
                      src={picture}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="card mt-5 pt-2 pb-2">
              <div className="content">
                <div className="row">
                  <div className="col-md-6 col-xs-12 text-center">
                    <div style={{ marginTop: 100 }}>
                      {this.renderStars(
                        product.reviewScore
                          ? Math.round(product.reviewScore)
                          : 0
                      )}
                    </div>
                    <h4 className="mt-2">
                      {product.reviewScore
                        ? Math.round(product.reviewScore)
                        : 0}/5
                    </h4>
                    <a
                      href="javascript:;"
                      onClick={() => this.setState({ showReview: true })}
                    >
                      See all reviews
                    </a>
                  </div>
                  <div className="col-md-6 col-xs-12 pt-5">
                    {feedback.isLoading ? (
                      <div className="text-center">
                        <Loader style={{ marginTop: 50 }} />
                      </div>
                    ) : (
                      <div style={{ marginTop: 50, marginBottom: 50 }}>
                        {Object.keys(statistic)
                          .reverse()
                          .map(star => (
                            <div key={"statistic-" + star} className="row">
                              <div className="col-xs-2">
                                <p className="mr-3">
                                  {star}{" "}
                                  <i
                                    className="fa fa-star"
                                    style={{ marginLeft: 5, color: "orange" }}
                                  />
                                </p>
                              </div>
                              <div className="col-xs-8">
                                <div
                                  className="progress"
                                  style={{ width: "100%" }}
                                >
                                  <div
                                    className="progress-bar"
                                    style={{
                                      width:
                                        (reviews.length
                                          ? statistic[star] /
                                            reviews.length *
                                            100
                                          : 0
                                        ).toString() + "%"
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="col-xs-2">
                                <p className="mr-3">{statistic[star]}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {product.specifications.length > 0 && (
              <div>
                <h3 className="mt-5">SPECIFICATIONS</h3>
                <div className="card">
                  <div className="content">
                    <form>
                      {product.specifications.map((specification, index) => (
                        <div
                          key={"specification-" + index}
                          className="form-group row"
                        >
                          <label
                            htmlFor="staticEmail"
                            className="col-sm-2 col-form-label font-weight-bold"
                          >
                            {specification.name}
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="text"
                              readOnly
                              className="form-control-plaintext"
                              id="staticEmail"
                              defaultValue={specification.value}
                            />
                          </div>
                        </div>
                      ))}
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  product: state.product.detail,
  feedback: state.product.feedback,
  role: state.user.role
});
const mapDispatchToProps = dispatch => ({
  loadProductData: productId => dispatch(loadProductData(productId)),
  loadProductFeedback: productId => dispatch(loadProductFeedback(productId))
});
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
