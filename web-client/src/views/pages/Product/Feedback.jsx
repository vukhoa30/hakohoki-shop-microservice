import React, { Component } from "react";
import { connect } from "react-redux";
import { formatTime, parseToObject } from "../../../utils";
import ProductShowcase from "../../components/ProductShowcase";
import Input from "../../components/Input";
import { Field, reduxForm } from "redux-form";
import {
  loadProductFeedback,
  loadProductData,
  giveAnswer,
  toast
} from "../../../api";
class ProductFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "reviews",
      feedback: []
    };
    const { product, loadProductFeedback, loadProductData, id } = props;
    loadProductFeedback(id);
    if (id !== product._id) loadProductData(id);
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.feedback.isLoading !== nextProps.feedback.isLoading &&
      !nextProps.feedback.isLoading
    ) {
      console.log(nextProps.product);
      const { reviews, comments } = nextProps.feedback;
      this.setState({
        feedback:
          this.state.mode === "reviews"
            ? reviews
            : comments.filter(comment => !comment.parentId)
      });
    }
  }
  renderStars(starCount) {
    const stars = [];
    let i = 0;
    for (; i < starCount; i++)
      stars.push(
        <i
          key={"star-" + i}
          className="fa fa-star"
          style={{ color: "orange" }}
        />
      );
    for (; i < 5; i++)
      stars.push(
        <i
          key={"star-" + i}
          className="fa fa-star-o"
          style={{ color: "orange" }}
        />
      );
    return stars;
  }
  render() {
    const {
      history,
      product,
      viewDetail,
      feedback,
      id,
      token,
      loadProductFeedback,
      toast
    } = this.props;
    const { isLoading: isFeedbackLoading, reviews, comments } = feedback;
    const { isLoading: productLoading } = product;
    return (
      <div className="container-fluid">
        <button
          className="btn btn-primary mb-3"
          onClick={() =>
            history.push({
              pathname: "/main/product/detail/" + id
            })
          }
        >
          View details
        </button>
        <div className="row">
          <div className="col-md-5 col-xs-12">
            {productLoading ? (
              <div className="d-flex justify-content-center">
                <i className="fa fa-spinner fa-spin fa-3x" />
              </div>
            ) : (
              <ProductShowcase product={product} autoHeight />
            )}
          </div>
          <div className="col-md-7 col-xs-12">
            <div className="btn-group mb-3" role="group">
              <button
                type="button"
                className={`btn ${
                  this.state.mode === "reviews"
                    ? "btn-secondary"
                    : "btn-default"
                }`}
                onClick={() =>
                  this.setState({ mode: "reviews", feedback: reviews })
                }
              >
                Reviews
              </button>
              <button
                type="button"
                className={`btn ${
                  this.state.mode === "comments"
                    ? "btn-secondary"
                    : "btn-default"
                }`}
                onClick={() =>
                  this.setState({
                    mode: "comments",
                    feedback: comments.filter(comment => !comment.parentId)
                  })
                }
              >
                Comments
              </button>
            </div>
            <div
              className="list-group"
              style={{ overflowY: "auto", height: 800 }}
            >
              {isFeedbackLoading ? (
                <div className="d-flex justify-content-center">
                  <i className="fa fa-spinner fa-spin fa-3x" />
                </div>
              ) : this.state.feedback.length > 0 ? (
                this.state.feedback.map((feedback, index) => (
                  <a
                    key={"feedback-" + index}
                    href="javascript:;"
                    className="list-group-item list-group-item-action flex-column align-items-start"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-1" style={{ fontWeight: "bold" }}>
                        {feedback.userName}
                      </h5>
                      <small>{formatTime(feedback.createdAt)}</small>
                    </div>
                    {feedback.reviewScore &&
                      this.renderStars(feedback.reviewScore)}
                    <p
                      className="mb-1"
                      data-toggle="collapse"
                      data-target={"#feedback-" + index}
                    >
                      {feedback.content}
                    </p>
                    {!feedback.reviewScore && (
                      <div className="d-flex flex-row-reverse">
                        <small style={{ color: "gray" }}>3 comments</small>
                      </div>
                    )}
                    {!feedback.reviewScore && (
                      <div className="collapse" id={"feedback-" + index}>
                        <hr className="my-4" />
                        <div className="card card-body list-group border-0">
                          {comments
                            .filter(comment => comment.parentId === feedback.id)
                            .map(comment => (
                              <li
                                key={"comment-" + comment.id}
                                className="list-group-item list-group-item-action flex-column align-items-start"
                                style={{
                                  borderRadius: 0,
                                  borderWidth: 0,
                                  borderLeftWidth: 2,
                                  borderColor:
                                    comment.userRole === "customer"
                                      ? "blue"
                                      : "green"
                                }}
                              >
                                <div className="d-flex w-100 justify-content-between">
                                  <h5
                                    className="mb-1"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {comment.userName}
                                  </h5>
                                  <small>{formatTime(comment.createdAt)}</small>
                                </div>
                                <p className="mb-1">{comment.content}</p>
                              </li>
                            ))}
                          {/* <div className="d-flex justify-content-center">
                            <i className="fa fa-spinner fa-spin" />
                          </div> */}
                          <form
                            onSubmit={async e => {
                              e.preventDefault();
                              const content = e.target.content.value;
                              e.target.content.value = "";
                              const result = await giveAnswer(
                                id,
                                content,
                                feedback.id,
                                token
                              );
                              if (result.ok) loadProductFeedback(id);
                              else toast(result._error, "error");
                            }}
                          >
                            <div className="form-group mt-3">
                              <input
                                className="form-control"
                                placeholder="Write your message"
                                name="content"
                                required
                              />
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </a>
                ))
              ) : (
                <div className="d-flex justify-content-center">
                  <p style={{ color: "gray" }} className="mt-5">
                    NO {this.state.mode === "reviews" ? "REVIEWS" : "COMMENTS"}{" "}
                    FOUND
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  const { match } = props;
  const { detail: product, feedback } = state.product;
  const { id } = match.params;
  const { token } = state.user;

  return {
    product,
    feedback,
    id,
    token
  };
};
const mapDispatchToProps = dispatch => ({
  loadProductFeedback: productId => dispatch(loadProductFeedback(productId)),
  loadProductData: productId => dispatch(loadProductData(productId)),
  toast: (message, level) => dispatch(toast(message, level))
});
export default connect(mapStateToProps, mapDispatchToProps)(ProductFeedback);
