import React, { Component } from "react";
import { connect } from "react-redux";
import {
  loadSubscribedProducts,
  loadProductFeedback,
  giveAnswer,
  toast,
  removeSubscribedProduct,
  subscribeProducts,
  eventEmitter
} from "../../api";
import { parseToObject, request, parseToQueryString } from "../../utils";
import Loader from "../components/Loader";
import Comment from "../components/Comment";
import ProductSelector from "../components/ProductSelector";
import { Badge } from "react-bootstrap";
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
      removingProduct: false,
      questions: [],
      answers: {
        parentId: null,
        data: []
      },
      showDialog: false,
      subscriptions: [],
      newQuestionIds: [],
      subscriptionHasNewComments: []
    };
    this.props.loadSubscription(this.props.token);
    eventEmitter.on("newComment", data => {
      const { query } = this.state;
      const { productId, commentId, parentId } = data;
      if (productId === query.productId) {
        if (commentId || parentId) {
          this.props.loadProductFeedback(productId);
          const newQuestionIds = this.state.newQuestionIds;
          if (parentId) {
            const idIndex = newQuestionIds.findIndex(
              element => element.id === parentId
            );
            if (idIndex > -1) newQuestionIds[idIndex].count++;
            else
              newQuestionIds.push({
                id: parentId,
                count: 1
              });
          } else {
            const idIndex = newQuestionIds.findIndex(
              element => element.id === parentId
            );
            if (idIndex === -1)
              newQuestionIds.push({
                id: commentId,
                count: 0
              });
          }
          this.setState({
            newQuestionIds
          });
        }
      } else {
        const subscriptionHasNewComments = this.state
          .subscriptionHasNewComments;
        const idIndex = subscriptionHasNewComments.findIndex(
          element => element.id === productId
        );
        if (idIndex > -1) subscriptionHasNewComments[idIndex].count++;
        else
          subscriptionHasNewComments.push({
            id: productId,
            count: 1
          });
        this.setState({
          subscriptionHasNewComments
        });
      }
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { _v, product_id, comment_id, parent_id } = parseToObject(
      nextProps.location.search
    );
    const { data } = nextProps;
    return {
      query: {
        _v,
        productId: product_id ? product_id : null,
        commentId: parent_id ? parent_id : comment_id ? comment_id : null
      },
      subscriptions: data
    };
  }

  componentWillUnmount() {
    eventEmitter.removeListener('newComment', () => console.log('Listener removed!'))
  }

  componentDidMount() {
    if (this.state.query.productId !== null) {
      const { history, location } = this.props;
      const queryString = parseToQueryString({
        _v: new Date().getTime(),
        product_id: this.state.query.productId,
        comment_id: this.state.query.commentId
          ? this.state.query.commentId
          : undefined
      });
      history.push({
        ...location,
        search: queryString
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.query._v !== prevState.query._v &&
      this.state.query.productId !== null
    ) {
      const subscription = this.state.subscriptions.find(
        curSub => curSub.productId === this.state.query.productId
      );
      this.setState({
        submitting: false,
        newQuestionIds: [],
        questions: [],
        answers: {
          parentId: null,
          data: []
        },
        selectedSubscription: subscription ? subscription : null
      });
      this.loadData();
    } else if (!this.props.feedbackLoading && prevProps.feedbackLoading) {
      const questions = this.props.comments.filter(
        comment => !comment.parentId
      );
      if (this.state.answers.parentId === null)
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
      else this.setState({ questions });
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

  renderNotificationForSubscription(subscription) {
    const subscriptionHasNewComments = this.state.subscriptionHasNewComments;
    const info = subscriptionHasNewComments.find(
      element => element.id === subscription.productId
    );
    return info ? (
      <small className="pull-right">
        <Badge>{info.count}</Badge>
      </small>
    ) : null;
  }

  render() {
    const {
      isLoading,
      err,
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
        <ProductSelector
          open={this.state.showDialog}
          displayCondition={product =>
            !this.state.subscriptions.find(
              subscription => subscription.productId === product._id
            )
          }
          jobName="SUBSCRIBE THESE PRODUCTS"
          doJob={products =>
            subscribeProducts(products.map(product => product._id), token).then(
              () => {
                toast("SUBSCRIBE PRODUCT SUCCESSFULLY!", "success");
                loadSubscription(token);
                return Promise.resolve();
              },
              err => {
                toast(err, "error");
                Promise.reject();
              }
            )
          }
          close={() => this.setState({ showDialog: false })}
        />
        <div className="col-xs-4">
          <h4 style={{ marginTop: 0 }}>
            SUBSCRIPTION{" "}
            {this.state.removingProduct && (
              <i className="fa fa-circle-o-notch fa-spin" />
            )}
            <i
              className="clickable pull-right fa fa-plus"
              onClick={() => this.setState({ showDialog: true })}
            />
          </h4>
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
              {this.state.subscriptions.map(subscription => (
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
                  onClick={() => {
                    const subscriptionHasNewComments = this.state
                      .subscriptionHasNewComments;
                    const idIndex = subscriptionHasNewComments.findIndex(
                      element => element.id === subscription.productId
                    );
                    if (idIndex > -1) {
                      subscriptionHasNewComments.splice(idIndex, 1);
                      this.setState({
                        subscriptionHasNewComments
                      });
                    }
                    this.selectSubscription(subscription);
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <img
                      src={subscription.mainPicture}
                      alt=""
                      style={{ width: 50, height: "auto" }}
                    />
                  </div>
                  <div style={{ flex: 3, padding: 10, paddingTop: 0 }}>
                    <p style={{ marginBottom: 0 }}>
                      <b style={{ color: "red" }}>{subscription.productName}</b>
                      {this.renderNotificationForSubscription(subscription)}
                    </p>
                    <p>
                      <small>ID: {subscription.productId}</small>
                    </p>
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
                        disabled={this.state.removingProduct}
                        onClick={e => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              `Remove product ${
                                subscription.productName
                              } from your subscription list?`
                            )
                          ) {
                            this.setState({ removingProduct: true });
                            removeSubscribedProduct(
                              subscription.productId,
                              token
                            ).then(result => {
                              if (result.ok) {
                                loadSubscription(token);
                              } else {
                                toast(
                                  "COULD NOT UPDATE SUBSCRIPTION LIST",
                                  "error"
                                );
                              }
                              this.setState({ removingProduct: false });
                            });
                          }
                        }}
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
          {this.state.selectedSubscription !== null && (
            <div style={{ display: "flex", marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <img
                  src={this.state.selectedSubscription.mainPicture}
                  alt=""
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <div style={{ flex: 3, padding: 10, paddingTop: 0 }}>
                <p style={{ marginBottom: 0 }}>
                  <b style={{ color: "red" }}>
                    {this.state.selectedSubscription.productName}
                  </b>
                </p>
                <p>
                  <small>ID: {this.state.selectedSubscription.productId}</small>
                </p>
              </div>
            </div>
          )}
          <hr style={{ marginBottom: 10 }}/>
          <div className="row">
            <div className="col-xs-6">
              <h4 style={{ marginTop: 0 }}>
                COMMENTS{" "}
                {this.state.newQuestionIds.length > 0 &&
                  `(${this.state.newQuestionIds.length})`}
                <div className="pull-right">
                  {feedbackLoading && <Loader />}
                </div>
              </h4>
              <div />
              {feedbackErr ? (
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
                      info={this.state.newQuestionIds.find(
                        element => element.id === comment.id
                      )}
                      //   select={() =>
                      //     this.setState({
                      //       selectedCommentId: comment.id
                      //     })
                      //   }
                      select={() => {
                        const newQuestionIds = this.state.newQuestionIds;
                        const index = newQuestionIds.findIndex(
                          element => element.id === comment.id
                        );
                        if (index > -1) {
                          newQuestionIds.splice(index, 1);
                        }
                        this.setState({
                          answers: {
                            parentId: comment.id,
                            data: comments.filter(
                              curComment => curComment.parentId === comment.id
                            )
                          },
                          newQuestionIds
                        });
                      }}
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
