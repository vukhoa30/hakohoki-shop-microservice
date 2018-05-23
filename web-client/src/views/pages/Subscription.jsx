import React, { Component } from "react";
import { connect } from "react-redux";
import {
  loadSubscribedProducts,
  loadProductFeedback,
  giveAnswer,
  toast
} from "../../api";
import { parseToObject } from "../../utils";
import Loader from "../components/Loader";
import Comment from "../components/Comment";
class Subscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {
        _v: null,
        productId: null,
        commentId: null
      },
      selectedSubscription: null,
      submitting: false,
      questions: [],
      answers: {
        parentId: null,
        data: []
      }
    };
    this.props.loadSubscription(this.props.token);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { _v, product_id, comment_id, parent_id } = parseToObject(
      nextProps.location.search
    );
    return {
      query: {
        _v,
        productId: product_id ? product_id : null,
        commentId: parent_id ? parent_id : comment_id ? comment_id : null
      }
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.query._v !== prevState.query._v &&
      this.state.query.productId !== null
    ) {
      this.setState({
        submitting: false,
        questions: [],
        answers: {
          parentId: null,
          data: []
        }
      });
      this.loadData();
    } else if (!this.props.feedbackLoading && prevProps.feedbackLoading) {
      const questions = this.props.comments.filter(
        comment => !comment.parentId
      );
      this.setState({
        questions,
        answers: {
          parentId: this.state.query.commentId,
          data:
            this.state.query.commentId !== null
              ? this.props.comments.filter(
                  comment => comment.parentId === this.state.query.commentId
                )
              : []
        }
      });
    }
  }

  loadData() {
    const { productId } = this.state.query;
    const { loadProductFeedback } = this.props;
    loadProductFeedback(productId);
  }

  selectSubscription(subscription) {
    const { history, location } = this.props;
    history.push({
      ...location,
      search: `?_v=${new Date().getTime()}&product_id=${subscription.productId}`
    });
  }

  render() {
    const {
      isLoading,
      err,
      data: subscriptions,
      loadSubscription,
      token,
      feedbackLoading,
      feedbackErr,
      comments,
      toast,
      fullName,
      role
    } = this.props;
    return (
      <div className="container-fluid">
        <div className="col-xs-4">
          <h4 style={{ marginTop: 0 }}>SUBSCRIPTION</h4>
          {isLoading ? (
            <div className="text-center">
              <Loader />
            </div>
          ) : err ? (
            <div
              className="alert alert-danger clickable"
              onClick={() => loadSubscription(token)}
            >
              COULD NOT LOAD DATA! CLICK TO TRY AGAIN
            </div>
          ) : (
            <div style={{ overflowY: "auto", height: 700 }}>
              {subscriptions.map(subscription => (
                <div
                  className="clickable product-showcase"
                  key={"subscription-" + subscription.productId}
                  style={{
                    marginBottom: 20,
                    paddingTop: 20,
                    paddingBottom: 20,
                    width: "100%",
                    display: "flex"
                  }}
                  onClick={() => this.selectSubscription(subscription)}
                >
                  <div style={{ flex: 1 }}>
                    {/* {selectedProduct !== null &&
        selectedProduct.productId === subscription.productId && (
          <i
            className="fa fa-caret-right"
            style={{ color: "blue", fontSize: 20 }}
          />
        )} */}
                    <img
                      src={subscription.mainPicture}
                      alt=""
                      style={{ width: 50, height: "auto" }}
                    />
                  </div>
                  <div style={{ flex: 3, padding: 10, paddingTop: 0 }}>
                    <p style={{ marginBottom: 0 }}>
                      <b style={{ color: "red" }}>{subscription.productName}</b>
                    </p>
                    <small>ID: {subscription.productId}</small>
                    <div>
                      <button
                        className="btn btn-primary btn-fill btn-block"
                        style={{ borderWidth: 0 }}
                      >
                        View comments
                      </button>
                      <button
                        className="btn btn-danger btn-fill btn-block"
                        style={{ marginTop: 5, borderWidth: 0 }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-xs-8">
          <div className="row">
            <div className="col-xs-6">
              <h4 style={{ marginTop: 0 }}>COMMENTS</h4>
              <div />
              {feedbackLoading ? (
                <div className="text-center">
                  <Loader />
                </div>
              ) : feedbackErr ? (
                <div
                  className="alert alert-danger clickable"
                  onClick={() =>
                    loadProductFeedback(this.state.query.productId)
                  }
                >
                  COULD NOT LOAD DATA! CLICK TO TRY AGAIN
                </div>
              ) : this.state.questions.length > 0 ? (
                <div
                  style={{
                    height: 600,
                    overflowY: "auto",
                    backgroundColor: "white",
                    padding: 10
                  }}
                >
                  {this.state.questions.map(comment => (
                    <Comment
                      comment={comment}
                      key={"comment-" + comment.id}
                      selected={comment.id === this.state.answers.parentId}
                      //   select={() =>
                      //     this.setState({
                      //       selectedCommentId: comment.id
                      //     })
                      //   }
                      select={() =>
                        this.setState({
                          answers: {
                            parentId: comment.id,
                            data: comments.filter(
                              curComment => curComment.parentId === comment.id
                            )
                          }
                        })
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p style={{ color: "gray" }}>NO COMMENTS FOUND</p>
                </div>
              )}
            </div>
            <div className="col-xs-6">
              <h4 style={{ marginTop: 0 }}>REPLIES</h4>
              {this.state.answers.parentId !== null ? (
                <div>
                  <div
                    style={{
                      height: 600,
                      overflowY: "auto",
                      backgroundColor: "white",
                      padding: 10
                    }}
                  >
                    {this.state.answers.data.map(comment => (
                      <Comment
                        comment={comment}
                        key={"comment-" + comment.id}
                        //   selected={comment.id === selectedCommentId}
                        //   select={() =>
                        //     this.setState({
                        //       selectedCommentId: comment.id
                        //     })
                        //   }
                      />
                    ))}
                  </div>
                  <form
                    ref={ref => (this.commentForm = ref)}
                    onSubmit={e => {
                      e.preventDefault();
                      const currentTime = new Date();
                      const currentId = currentTime.getTime();
                      const newReply = {
                        id: currentId,
                        userRole: role,
                        userName: fullName,
                        createdAt: currentTime,
                        content: e.target.comment.value
                      };
                      this.setState({
                        submitting: true,
                        answers: {
                          parentId: this.state.answers.parentId,
                          data: this.state.answers.data.concat([newReply])
                        }
                      });
                      giveAnswer(
                        this.state.query.productId,
                        e.target.comment.value,
                        this.state.answers.parentId,
                        token
                      ).then(result => {
                        const currentAnswers = this.state.answers.data;
                        const commentIndex = currentAnswers.findIndex(
                          answer => answer.id === currentId
                        );
                        if (commentIndex > -1) {
                          //console.log(currentAnswers)
                          if (result.ok) {
                            // currentAnswers[commentIndex].validating = false;
                          } else {
                            currentAnswers.splice(commentIndex, 1);
                            toast("COULD NOT SEND REPLY", "error");
                          }
                          //console.log(currentAnswers);
                          this.setState({
                            submitting: false,
                            answers: {
                              parentId: this.state.answers.parentId,
                              data: currentAnswers
                            }
                          });
                        }
                      });
                      this.commentForm.reset();
                    }}
                  >
                    <div className="input-group">
                      <input
                        name="comment"
                        type="text"
                        className="form-control border-input"
                        placeholder="Search"
                        required
                      />
                      <div className="input-group-btn">
                        <button
                          className="btn btn-default btn-fill"
                          type="submit"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-center">
                  <p style={{ color: "gray" }}>
                    SELECT A COMMENT TO SEE REPLIES
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
const mapStateToProps = state => {
  const {
    isLoading: feedbackLoading,
    err: feedbackErr,
    comments
  } = state.product.feedback;
  return {
    ...state.subscription,
    feedbackLoading,
    feedbackErr,
    comments,
    ...state.user
  };
};
const mapDispatchToProps = dispatch => ({
  loadSubscription: token => dispatch(loadSubscribedProducts(token)),
  loadProductFeedback: productId => dispatch(loadProductFeedback(productId)),
  toast: (message, level) => dispatch(toast(message, level))
});
export default connect(mapStateToProps, mapDispatchToProps)(Subscription);
