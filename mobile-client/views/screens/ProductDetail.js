import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Dimensions } from "react-native";
import {
  Container,
  Content,
  Button,
  List,
  ListItem,
  Card,
  Spinner,
  Body,
  Right,
  Footer,
  FooterTab,
  Grid,
  Col,
  Icon
} from "native-base";
import {
  loadProductFeedback,
  loadProductInformation,
  removeSession,
  setCart,
  changeWatchListState,
  updateWatchList
} from "../../api";
import AppText from "../components/AppText";
import ProductInformation from "../components/ProductInformation";
import ProductFeedback from "../components/ProductFeedback";
import ProductReviews from "../components/ProductReviews";
import ProductComments from "../components/ProductComments";
import NumberPicker from "../components/NumberPicker";
import { alert } from "../../utils";

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    const { product, productId } = this.props;
    this.state = {
      showDialog: false,
      showFeedback: false,
      productLoading: false,
      productErr: false,
      watchListStateChanging: false,
      feedbackLoading: false,
      feedbackErr: false,
      productId,
      product,
      comments: [],
      reviews: [],
      statistic: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      },
      onDestroy: false
    };
  }

  componentWillUnmount() {
    this.setState({ onDestroy: true });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.state.onDestroy;
  }

  changeWatchListState(isAdding) {
    const { token, updateWatchList } = this.props;
    const { product, productId } = this.state;
    this.setState({ watchListStateChanging: true });
    changeWatchListState(token, productId, isAdding).then(result => {
      if (result.ok) {
        updateWatchList(product, isAdding);
        alert(
          "success",
          "PRODUCT" +
            (isAdding ? " ADDED TO " : " REMOVED FROM ") +
            "YOUR WATCH LIST"
        );
        this.setState({
          watchListStateChanging: false,
          product: { ...product, existsInWatchlist: isAdding }
        });
      } else {
        alert(
          "error",
          "COULD NOT" +
            (isAdding ? " ADDED PRODUCT TO " : " REMOVED PRODUCT FROM ") +
            "YOUR WATCH LIST"
        );
        this.setState({ watchListStateChanging: false });
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.isLoggedIn && !prevProps.isLoggedIn) this.loadInfo();
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props.isLoggedIn) this.loadInfo();
      // this.loadFeedback();
    }, 500);
  }

  componentWillUnmount() {}

  loadInfo() {
    const { productId } = this.state;
    const { token } = this.props;
    this.setState({ productLoading: true, productErr: false });
    loadProductInformation(productId, token).then(result => {
      const { ok, product } = result;
      if (ok) this.setState({ productLoading: false, product });
      else this.setState({ productLoading: false, productErr: true });
    });
  }

  loadFeedback() {
    const { productId } = this.state;
    this.setState({ feedbackLoading: true, feedbackErr: false });
    loadProductFeedback(productId).then(result => {
      const { ok, comments, reviews, statistic } = result;
      if (ok)
        this.setState({ feedbackLoading: false, comments, reviews, statistic });
      else this.setState({ feedbackLoading: false, feedbackErr: true });
    });
  }

  render() {
    const {
      productLoading,
      feedbackLoading,
      productId,
      product,
      comments,
      reviews,
      statistic,
      showDialog,
      feedbackErr,
      productErr,
      watchListStateChanging
    } = this.state;
    const { setCart, quantityInCart, token } = this.props;
    console.log(quantityInCart)
    return (
      <Container>
        <NumberPicker
          isVisible={showDialog}
          closeDialog={() => this.setState({ showDialog: false })}
          submit={number => {
            setCart(
              token,
              product,
              quantityInCart > 0 ? "UPDATE" : "ADD",
              Number(quantityInCart) + Number(number)
            );
            alert("success", "ADDED PRODUCT TO CART");
          }}
        />
        <List>
          <ListItem icon>
            <Body>
              <View style={{ flexDirection: "row" }}>
                <AppText small note>
                  PRODUCT /{" "}
                </AppText>
                <AppText small color="blue">
                  {product !== null && product.category.toUpperCase()}
                </AppText>
              </View>
            </Body>
            <Right>
              {(productLoading || feedbackLoading) && <Spinner size="small" />}
            </Right>
          </ListItem>
        </List>
        <Content style={{ opacity: showDialog ? 0.3 : 1 }}>
          {product !== null && (
            <ProductInformation product={product} err={productErr} />
          )}
          {!this.state.showFeedback ? (
            <Button
              block
              light
              style={{ marginVertical: 10 }}
              onPress={() =>
                this.setState({ showFeedback: true }, () => this.loadFeedback())
              }
            >
              <AppText>VIEW FEEDBACK</AppText>
            </Button>
          ) : (
            <View>
              <ProductReviews
                reviewLock={product === null}
                loading={feedbackLoading}
                err={feedbackErr}
                reload={() => {
                  this.loadFeedback();
                }}
                finishSubmittingReview={() => {
                  this.setState({
                    product: { ...this.state.product, reviewedBySelf: true }
                  });
                  setTimeout(() => this.loadFeedback(), 1000)
                }}
                productId={productId}
                comments={comments}
                reviews={reviews}
                statistic={statistic}
                reviewScore={
                  product !== null && product.reviewScore
                    ? Math.round(product.reviewScore)
                    : 0
                }
                reviewCount={
                  product !== null && product.reviewCount
                    ? product.reviewCount
                    : 0
                }
                isReviewed={product !== null && product.reviewedBySelf}
              />

              <ProductComments
                reload={() => this.loadFeedback()}
                err={feedbackErr}
                loading={feedbackLoading}
                productId={productId}
                comments={comments}
              />
            </View>
          )}
        </Content>
        {product !== null && (
          <Footer>
            <FooterTab>
              <View style={{ width: "100%", backgroundColor: "white" }}>
                <Grid>
                  <Col style={{ width: 100 }}>
                    <Button
                      full
                      primary
                      light
                      disabled={watchListStateChanging || productLoading}
                      onPress={() =>
                        this.changeWatchListState(!product.existsInWatchlist)
                      }
                    >
                      {watchListStateChanging ? (
                        <Spinner />
                      ) : product !== null && product.existsInWatchlist ? (
                        <Icon name="md-heart" style={{ color: "red" }} />
                      ) : (
                        <Icon name="md-heart-outline" />
                      )}
                    </Button>
                  </Col>
                  <Col>
                    {product !== null && product.quantity === 0 ? (
                      <Button full disabled={true}>
                        <AppText
                          large
                          color="white"
                          style={{ fontWeight: "bold" }}
                        >
                          SOLD OUT
                        </AppText>
                      </Button>
                    ) : (
                      <Button
                        full
                        primary
                        disabled={productLoading}
                        style={{ flexDirection: "row" }}
                        onPress={() => this.setState({ showDialog: true })}
                      >
                        <Icon name="ios-cart" />
                        <AppText large color="white">
                          ADD TO CART
                        </AppText>
                      </Button>
                    )}
                  </Col>
                </Grid>
              </View>
            </FooterTab>
          </Footer>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { isLoggedIn, token } = state.user;
  const { params } = props.navigation.state;
  const { productId, product } = params ? params : {};
  const { list } = state.cart;
  const productInCart = list.find(product => product._id === productId);
  const quantityInCart = productInCart ? productInCart.amount : 0;
  return {
    productId: productId ? productId : null,
    product: product ? product : null,
    isLoggedIn,
    token,
    quantityInCart
  };
};

const mapDispatchToProps = dispatch => ({
  setCart: (token, product, type, amount) =>
    dispatch(setCart(token, product, type, amount)),
  updateWatchList: (product, isAdding) =>
    dispatch(updateWatchList(product, isAdding))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
