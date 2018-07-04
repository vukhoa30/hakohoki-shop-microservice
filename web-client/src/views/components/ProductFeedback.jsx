import React, { Component } from "react";
import { connect } from "react-redux";
import { formatTime, parseToObject } from "../../utils";
import { withRouter } from "react-router";
import ProductShowcase from "./ProductShowcase";
import Input from "./Input";
import Loader from "./Loader";
import Comment from "./Comment";
import { Field, reduxForm } from "redux-form";
import { loadProductFeedback, giveAnswer, toast } from "../../api";
class ProductFeedback extends Component {
  constructor(props) {
    super(props);
    this.comments = [];
    const { feedback, loadProductFeedback, id, location, search } = props;
    const { selected } = search;
    this.state = {
      mode: "reviews",
      selectedCommentId: selected ? selected : null,
      submittingAnswer: false,
      willAutoScroll: false
    };
    if (id !== feedback._id) loadProductFeedback(id);
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.id !== nextProps.id ||
      this.props.location !== nextProps.location
    ) {
      const { feedback, loadProductFeedback, id, location, search } = nextProps;
      const { selected, reloadFeedback } = search;
      if (this.props.id !== nextProps.id || reloadFeedback)
        loadProductFeedback(id);
      if (selected) this.setState({ selectedCommentId: selected });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { isLoading: prevLoading } = prevProps.feedback;
    const { isLoading: curLoading } = this.props.feedback;
    if (prevLoading !== curLoading && !curLoading) {
      const { selected } = this.props.search;
      const element = this.comments[selected];
      if (element) element.scrollIntoView();
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
      toast,
      location
    } = this.props;
    const {
      isLoading: isFeedbackLoading,
      reviews,
      comments,
      err: feedbackErr
    } = feedback;
    const { isLoading: productLoading } = product;
    return (
      <div className="container-fluid">
        <div
          className="modal fade"
          id="comment-answers"
          tabIndex={-1}
          role="dialog"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  ANSWERS
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                {(isFeedbackLoading || this.state.submittingAnswer) && (
                  <Loader
                    style={{
                      position: "absolute",
                      top: 200,
                      left: "50%",
                      zIndex: 100
                    }}
                  />
                )}
                {this.state.selectedCommentId !== null && (
                  <div>
                    <hr className="m-0" />
                    <div className="list-group border-0 pt-0">
                      <div
                        style={{
                          height: 500,
                          overflowY: "auto",
                          opacity:
                            isFeedbackLoading || this.state.submittingAnswer
                              ? 0.5
                              : 1
                        }}
                      >
                        {comments
                          .filter(
                            comment =>
                              comment.parentId === this.state.selectedCommentId
                          )
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
                      </div>
                      <form
                        onSubmit={async e => {
                          e.preventDefault();
                          this.setState({ submittingAnswer: true });
                          const content = e.target.content.value;
                          e.target.content.value = "";
                          const result = await giveAnswer(
                            id,
                            content,
                            this.state.selectedCommentId,
                            token
                          );
                          if (result.ok) loadProductFeedback(id);
                          else toast(result._error, "error");
                          this.setState({ submittingAnswer: false });
                        }}
                      >
                        <div className="form-group mt-3">
                          <input
                            className="form-control"
                            placeholder="Write your message"
                            name="content"
                            required
                            disabled={this.state.submittingAnswer}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <button
          className="btn btn-primary mb-3"
          onClick={() =>
            history.push({
              pathname: "/main/product/detail/" + id
            })
          }
        >
          View details
        </button> */}
        <div className="row">
          <div className="col-md-6 col-xs-12">
            <h3 className="mt-2 mb-2">COMMENTS</h3>
            <div className="list-group">
              <div
                className="text-center"
                style={{
                  position: "absolute",
                  top: 200,
                  width: "100%"
                }}
              >
                {isFeedbackLoading ? (
                  <Loader />
                ) : (
                  <p style={{ color: "gray" }}>NO COMMENT FOUND</p>
                )}
              </div>
              {comments.length > 0 && (
                <div
                  ref={ref => (this.commentList = ref)}
                  style={{ overflowY: "auto", height: 600 }}
                >
                  {comments
                    .filter(comment => !comment.parentId)
                    .reverse()
                    .map((comment, index) => (
                      <Comment
                        comment={comment}
                        key={"comment-" + comment.id}
                        selected={comment.id === this.state.selectedCommentId}
                        select={() =>
                          this.setState({ selectedCommentId: comment.id })
                        }
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6 col-xs-12">
            <div>
              <h3 className="mt-2 mb-2">ANSWERS</h3>
              <div
                className="text-center"
                style={{
                  position: "absolute",
                  top: 200,
                  width: "100%"
                }}
              >
                {isFeedbackLoading || this.state.submittingAnswer ? (
                  <Loader />
                ) : (
                  <p style={{ color: "gray" }}>NO COMMENT SELECTED</p>
                )}
              </div>
              {this.state.selectedCommentId !== null && (
                <div>
                  <div
                    className="card card-body border-0"
                    style={{
                      height: 600,
                      overflowY: "auto",
                      opacity:
                        isFeedbackLoading || this.state.submittingAnswer
                          ? 0.5
                          : 1
                    }}
                  >
                    <div>
                      {comments
                        .filter(
                          comment =>
                            comment.parentId === this.state.selectedCommentId
                        )
                        .map(comment => (
                          <Comment
                            comment={comment}
                            key={"comment-" + comment.id}
                          />
                        ))}
                      {/* <div className="d-flex justify-content-center">
                            <i className="fa fa-spinner fa-spin" />
                          </div> */}
                    </div>
                  </div>
                  {/* <form
                    onSubmit={async e => {
                      e.preventDefault();
                      this.setState({ submittingAnswer: true });
                      const content = e.target.content.value;
                      e.target.content.value = "";
                      const result = await giveAnswer(
                        id,
                        content,
                        this.state.selectedCommentId,
                        token
                      );
                      if (result.ok) loadProductFeedback(id);
                      else toast(result._error, "error");
                      this.setState({ submittingAnswer: false });
                    }}
                  >
                    <div className="form-group mt-3">
                      <input
                        className="form-control"
                        placeholder="Write your message"
                        name="content"
                        required
                        disabled={this.state.submittingAnswer}
                      />
                    </div>
                  </form> */}
                </div>
              )}
            </div>
            {/* <div
              className="btn-group mb-3"
              role="group"
              style={{ display: "inline-block" }}
            >
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
            {isFeedbackLoading && (
              <i className="fa fa-circle-o-notch fa-spin fa-2x ml-3" />
            )}
            <div
              className="list-group"
              style={{ overflowY: "auto", height: 800 }}
            >
              {this.state.feedback.length > 0
                ? this.state.feedback.map((feedback, index) => (
                    <a
                      key={"feedback-" + index}
                      href="javascript:;"
                      data-target="#comment-answers"
                      data-toggle={
                        this.state.mode === "comments" ? "modal" : ""
                      }
                      className="list-group-item list-group-item-action flex-column align-items-start"
                      onClick={() =>
                        this.setState({ selectedCommentId: feedback.id })
                      }
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1" style={{ fontWeight: "bold" }}>
                          {feedback.userName}
                        </h5>
                        <small>{formatTime(feedback.createdAt)}</small>
                      </div>
                      {feedback.reviewScore &&
                        this.renderStars(feedback.reviewScore)}
                      <p className="mb-1">{feedback.content}</p>
                      {!feedback.reviewScore && (
                        <div className="d-flex flex-row-reverse">
                          <small style={{ color: "gray" }}>3 comments</small>
                        </div>
                      )}
                    </a>
                  ))
                : !isFeedbackLoading &&
                  feedbackErr === null && (
                    <div className="d-flex justify-content-center mt-5">
                      <p style={{ color: "gray" }} className="mt-5">
                        NO{" "}
                        {this.state.mode === "reviews" ? "REVIEWS" : "COMMENTS"}{" "}
                        FOUND
                      </p>
                    </div>
                  )}
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  const { match, location } = props;
  const { detail: product, feedback } = state.product;
  const { id } = match.params;
  const { token } = state.user;

  return {
    product,
    feedback,
    id,
    token,
    search: parseToObject(location.search)
  };
};
const mapDispatchToProps = dispatch => ({
  loadProductFeedback: productId => dispatch(loadProductFeedback(productId)),
  toast: (message, level) => dispatch(toast(message, level))
});
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductFeedback)
);
