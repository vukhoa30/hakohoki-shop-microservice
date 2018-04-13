import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import {
  setCart,
  updateWatchList,
  logOut,
  loadWatchList,
  updateWatchListStateOfProduct
} from "../../api";
import {
  Container,
  Content,
  Button,
  Footer,
  FooterTab,
  Grid,
  Col,
  Icon,
  Spinner
} from "native-base";
import AppText from "./AppText";
import NumberPicker from "./NumberPicker";
import { alert, confirm } from "../../utils";

class AppProductFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWatchListUpdating: false,
      showPickerDialog: false
    };
  }

  render() {
    const {
      logOut,
      token,
      isLoggedIn,
      productQuantityInCart,
      isAvailableInWatchList,
      cartStatus,
      product,
      setCart
    } = this.props;

    return (
      <Footer>
        <NumberPicker
          product={product}
          isVisible={this.state.showPickerDialog}
          closeDialog={() => this.setState({ showPickerDialog: false })}
          submit={number =>
            setCart(
              token,
              product,
              productQuantityInCart > 1 ? "UPDATE" : "ADD",
              number + productQuantityInCart
            )
          }
        />
        <FooterTab>
          <View style={{ width: "100%" }}>
            <Grid>
              <Col>
                <Button
                  disabled={product.quantity === 0 || cartStatus === "LOADING"}
                  success
                  full
                  small
                  iconLeft
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    if (productQuantityInCart > 1)
                      confirm(
                        "Product existed",
                        `You have ${productQuantityInCart} of this product in your cart. Want to add more?`,
                        () => this.setState({ showPickerDialog: true })
                      );
                    else this.setState({ showPickerDialog: true });
                  }}
                >
                  {cartStatus === "LOADING" ? <Spinner /> : <Icon name="add" />}
                  <AppText>CART</AppText>
                </Button>
              </Col>
              <Col>
                {this.state.isWatchListUpdating ? (
                  <Button block disabled>
                    <Spinner />
                  </Button>
                ) : isAvailableInWatchList ? (
                  <Button
                    warning
                    full
                    small
                    iconLeft
                    style={{ flexDirection: "row" }}
                    onPress={() => {
                      if (!isLoggedIn) logOut();
                      else
                        confirm(
                          "Confirm",
                          `Are you sure to remove product "${
                            product.name
                          }" from your watch list?`,
                          () => updateWatchList.call(this, "REMOVE")
                        );
                    }}
                  >
                    <Icon name="close" />
                    <AppText>WATCH LIST</AppText>
                  </Button>
                ) : (
                  <Button
                    primary
                    full
                    small
                    iconLeft
                    style={{ flexDirection: "row" }}
                    onPress={() => {
                      if (!isLoggedIn) logOut();
                      else updateWatchList.call(this, "ADD");
                    }}
                  >
                    <Icon name="add" />
                    <AppText>WATCH LIST</AppText>
                  </Button>
                )}
              </Col>
            </Grid>
          </View>
        </FooterTab>
      </Footer>
    );
  }
}

const mapStateToProps = state => {
  const { status, data } = state.product;
  const { list: cartList, status: cartStatus } = state.cart;
  const { token, isLoggedIn } = state.user;
  const { list: watchList } = state.watchList;

  const productInCart = cartList.find(product => product._id === data._id);
  const productQuantityInCart = productInCart ? productInCart.amount : 0;

  return {
    isLoggedIn,
    watchList,
    token,
    product: data,
    cartStatus,
    productQuantityInCart,
    isAvailableInWatchList: data !== null ? data.existsInWatchlist : false
  };
};

const mapDispatchToProps = dispatch => ({
  setCart: (token, product, type, amount) =>
    dispatch(setCart(token, product, type, amount)),
  logOut: () => dispatch(logOut()),
  loadWatchList: (token, offset, length) =>
    dispatch(loadWatchList(token, offset, length)),
  updateWatchListStateOfProduct: existsInWatchlist =>
    dispatch(updateWatchListStateOfProduct(existsInWatchlist))
});

export default connect(mapStateToProps, mapDispatchToProps)(AppProductFooter);
