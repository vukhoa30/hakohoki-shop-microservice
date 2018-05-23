import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { Field, reduxForm } from "redux-form";
import StarRating from "react-native-star-rating";
import {
  sendReview,
  logOut,
  reviewProduct,
  loadProductInformation
} from "../../api";
import {
  Container,
  Content,
  Spinner,
  Button,
  Card,
  CardItem,
  Icon,
  Grid,
  Col,
  Body,
  List,
  ListItem,
  Left,
  Right,
  Thumbnail,
  Form,
  Item,
  Textarea
} from "native-base";
import ProgressBar from "react-native-progress/Bar";
import AppText from "./AppText";
import { alert, confirm, width } from "../../utils";
import AppComment from "./AppComment";

class ProductReviews extends Component {
  static navigationOptions = {
    title: "Reviews"
  };

  constructor(props) {
    super(props);
    this.state = {
      starCount: 0,
      status: "PLEASE VOTING",
      maxSize: 5,
      reviews: []
    };
  }

  componentDidMount() {
    this.cutList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (!this.props.loading && prevProps.loading) ||
      this.state.maxSize !== prevState.maxSize
    )
      this.cutList();
    else if (!this.props.submitting && prevProps.submitting && prevProps.error)
      alert("error", error);
  }

  cutList() {
    this.setState({ reviews: this.props.reviews.slice(0, this.state.maxSize) });
  }

  onStarRatingPress(rating) {
    let status = "";

    switch (rating) {
      case 1:
        status = "BAD";
        break;
      case 2:
        status = "NOT GOOD";
        break;
      case 3:
        status = "GOOD";
        break;
      case 4:
        status = "VERY GOOD";
        break;
      case 5:
        status = "EXCELLENT";
        break;
    }

    this.setState({
      starCount: rating,
      status
    });
  }

  renderStars(reviewScore, large = false) {
    const stars = [];
    let i = 0;
    for (; i < reviewScore; i++)
      stars.push(
        <Icon
          key={"star-" + i}
          name="ios-star"
          style={{
            color: "orange",
            fontSize: large ? 15 : 10,
            fontWeight: "bold",
            marginVertical: 5
          }}
        />
      );
    for (; i < 5; i++)
      stars.push(
        <Icon
          key={"star-" + i}
          name="ios-star-outline"
          style={{
            color: "orange",
            fontSize: large ? 15 : 10,
            fontWeight: "bold",
            marginVertical: 5
          }}
        />
      );
    return stars;
  }

  renderStatistic(statistic, total) {
    return Object.keys(statistic)
      .reverse()
      .map(star => {
        const count = statistic[star];
        const progress = total > 0 ? count / total : 0;

        return (
          <View style={{ flexDirection: "row" }} key={"allstars-" + star}>
            <AppText note small>
              {star} stars
            </AppText>
            <ProgressBar
              progress={progress}
              style={{ marginHorizontal: 10, height: 10, marginTop: 5 }}
              width={80}
              height={20}
              borderRadis={0}
            />
            <AppText note small>
              {count}
            </AppText>
          </View>
        );
      });
  }

  renderInput({ input, placeholder, type, meta: { touched, error, warning } }) {
    return (
      <Textarea
        {...input}
        placeholder={placeholder}
        style={{ fontSize: 12 }}
        rowSpan={5}
        bordered
      />
    );
  }

  render() {
    const { maxSize, reviews } = this.state;
    const {
      productId,
      isLoggedIn,
      reviews: allReviews,
      token,
      statistic,
      userScore,
      reviewScore,
      reviewCount,
      isReviewed,
      logOut,
      loading,
      err,
      handleSubmit,
      submitting,
      reviewLock
    } = this.props;
    return (
      <View>
        <Card>
          <CardItem header>
            <Body>
              <AppText style={{ fontWeight: "bold" }}>USER RATING</AppText>
            </Body>
          </CardItem>
          <CardItem>
            <Body>
              <Grid>
                <Col style={{ flex: 1 }}>
                  <AppText center>{reviewScore}/5</AppText>
                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "center",
                      marginVertical: 10,
                      flex: 1
                    }}
                  >
                    {this.renderStars(reviewScore, true)}
                  </View>
                </Col>
                <Col>{this.renderStatistic(statistic, reviewCount)}</Col>
              </Grid>
            </Body>
          </CardItem>
        </Card>
        <Card>
          <List>
            <ListItem itemHeader first icon>
              <Body>
                <AppText style={{ fontWeight: "bold" }}>YOUR REVIEW</AppText>
              </Body>
            </ListItem>
          </List>
          {isLoggedIn ? (
            isReviewed ? (
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <StarRating
                  disabled={true}
                  maxStars={5}
                  fullStarColor="orange"
                  emptyStarColor="orange"
                  rating={userScore}
                />
                <AppText style={{ marginVertical: 20 }} note>
                  You reviewed this product
                </AppText>
              </View>
            ) : (
              <View style={{ alignItems: "center", width, marginTop: 10 }}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  fullStarColor="orange"
                  emptyStarColor="orange"
                  rating={this.state.starCount}
                  selectedStar={rating => this.onStarRatingPress(rating)}
                />
                <AppText note style={{ marginVertical: 5 }}>
                  {this.state.status}
                </AppText>
                <View style={{ width, padding: 20 }}>
                  <Form>
                    <Field
                      name="review"
                      placeholder="TYPE YOUR REVIEW HERE"
                      component={this.renderInput}
                    />
                    <Button
                      block
                      success
                      disabled={reviewLock || this.state.starCount === 0 || submitting}
                      style={{ marginVertical: 10 }}
                      onPress={handleSubmit(sendReview.bind(this))}
                    >
                      {submitting ? <Spinner /> : null}
                      <AppText>SUBMIT</AppText>
                    </Button>
                  </Form>
                </View>
              </View>
            )
          ) : (
            <Button
              danger
              style={{ alignSelf: "center" }}
              onPress={() => logOut()}
            >
              <AppText>LOG IN TO REVIEW</AppText>
            </Button>
          )}
          <List>
            <ListItem itemHeader first icon>
              <Body>
                <AppText style={{ fontWeight: "bold" }}>
                  REVIEWS ({reviewCount})
                </AppText>
              </Body>
              <Right>{loading && <Spinner size="small" />}</Right>
            </ListItem>
          </List>
          {err ? (
            <AppText
              style={{ alignSelf: "center", color: "red" }}
              onPress={() => reload()}
            >
              ENCOUNTER SOME ERRORS! CLICK TO TRY AGAIN
            </AppText>
          ) : reviewCount > 0 ? (
            <View style={{ width: "100%", padding: 10 }}>
              {reviews.map(review => (
                <AppComment key={"review-" + review.id} comment={review} />
              ))}
              {/* <List
                dataArray={reviews}
                renderRow={review => (
                  <ListItem avatar key={"review-" + review.id}>
                    <AppComment comment={review} />
                  </ListItem>
                )}
              /> */}
              {maxSize < allReviews.length && (
                <AppText
                  style={{ marginVertical: 20, alignSelf: "center" }}
                  onPress={() =>
                    this.setState({ maxSize: this.state.maxSize + 5 })
                  }
                >
                  LOAD MORE ...
                </AppText>
              )}
            </View>
          ) : (
            <AppText style={{ marginVertical: 10 }} note center>
              This product has no reviews
            </AppText>
          )}
        </Card>
      </View>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { account, isLoggedIn, token } = state.user;
  const { reviews, statistic } = props;
  const userReview = reviews.find(
    review => review.userId === account.accountId
  );
  const userScore = userReview ? userReview.reviewScore : null;
  return {
    isLoggedIn,
    token,
    userScore,
    reviews,
    statistic
  };
};

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut()),
  reviewProduct: () => dispatch(reviewProduct())
});

const ReduxForm = reduxForm({
  form: "review_form",
  touchOnBlur: false,
  enableReinitialize: true,
  onSubmitFail: () => {},
  validate: values => {
    const errors = {};

    return errors;
  }
})(ProductReviews);

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
