import React, { Component } from "react";
import { connect } from "react-redux";
import { View, ScrollView, Dimensions, TouchableHighlight } from "react-native";
import { setCart, loadCart, makeOrder, selectProduct } from "../../api";
import {
  Container,
  Content,
  Button,
  SwipeRow,
  List,
  ListItem,
  Right,
  Body,
  Icon,
  Thumbnail,
  FooterTab,
  Footer,
  Spinner,
  Header,
  Badge,
  Grid,
  Col
} from "native-base";
import AppText from "../components/AppText";
import NumberPicker from "../components/NumberPicker";
import { currencyFormat, confirm, alert } from "../../utils";
import { reduce } from "lodash";
import UserForm from "../components/UserForm";
var unknown = require("../../resources/images/unknown.png");

const { width, height } = Dimensions.get("window");

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInfoDialog: false
    };
    const { isLoggedIn, token, loadCart, status } = this.props;
    if (isLoggedIn && status === "INIT") loadCart(token);
  }

  render() {
    const {
      setCart,
      totalPrice,
      list,
      token,
      status,
      makeOrder,
      selectProduct,
      isLoggedIn
    } = this.props;
    return (
      <Container>
        {/* {status === "LOADING" && (
          <View style={{ width: "100%", alignItems: "center" }}>
            <Spinner />
          </View>
        )} */}
        <UserForm
          showInfoDialog={this.state.showInfoDialog}
          closeDialog={() => this.setState({ showInfoDialog: false })}
          applyInfo={values => {
            console.log(values);
            makeOrder(
              list.map(product => ({
                productId: product._id,
                amount: product.amount,
                giftIds:
                  product.giftProducts && product.giftProducts.length > 0
                    ? product.giftProducts.map(product => product._id)
                    : []
              })),
              {
                isLoggedIn: false,
                ...values
              }
            );
            this.setState({ showInfoDialog: false });
          }}
        />
        <Content style={{ backgroundColor: "white" }}>
          {list.length > 0 ? (
            <List
              dataArray={list}
              renderRow={product => (
                <ListItem>
                  <Thumbnail
                    square
                    size={80}
                    source={
                      product.mainPicture && product.mainPicture !== ""
                        ? {
                            uri: product.mainPicture
                          }
                        : unknown
                    }
                  />
                  <Body>
                    <TouchableHighlight
                      onPress={() => selectProduct(product._id)}
                    >
                      <View>
                        <AppText>{product.name}</AppText>
                        <AppText color="red">
                          {currencyFormat(product.price)}
                        </AppText>
                        {/* <AppText small note>
                      Quantity: {product.amount}
                    </AppText> */}
                      </View>
                    </TouchableHighlight>
                    <Grid>
                      <Col style={{ padding: 5, paddingLeft: 20, width: 100 }}>
                        <Icon
                          name="ios-trash-outline"
                          onPress={() => {
                            confirm(
                              "Confirm",
                              `Are you sure to remove product "${
                                product.name
                              }" from your cart?`,
                              () => setCart(token, product, "REMOVE")
                            );
                          }}
                        />
                      </Col>
                      <Col>
                        <View style={{ flexDirection: "row", marginLeft: 20 }}>
                          <Button
                            small
                            style={{ padding: 5, backgroundColor: "#eee" }}
                          >
                            <AppText
                              style={{ fontSize: 20 }}
                              note
                              onPress={() => {
                                product.amount + 1 <= product.quantity
                                  ? setCart(
                                      token,
                                      product,
                                      "UPDATE",
                                      product.amount + 1
                                    )
                                  : alert("warning", "NOT ENOUGH PRODUCTS");
                              }}
                            >
                              +
                            </AppText>
                          </Button>
                          <View style={{ paddingHorizontal: 10 }}>
                            <AppText style={{ fontSize: 20 }}>
                              {product.amount}
                            </AppText>
                          </View>
                          <Button
                            small
                            style={{ padding: 5, backgroundColor: "#eee" }}
                          >
                            <AppText
                              style={{ fontSize: 20 }}
                              note
                              onPress={() => {
                                if (product.amount > 1)
                                  setCart(
                                    token,
                                    product,
                                    "UPDATE",
                                    product.amount - 1
                                  );
                              }}
                            >
                              -
                            </AppText>
                          </Button>
                        </View>
                      </Col>
                    </Grid>
                  </Body>
                </ListItem>
              )}
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: 250,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AppText note large>
                NO PRODUCTS
              </AppText>
            </View>
          )}
        </Content>
        <AppText
          style={{
            fontWeight: "bold",
            alignSelf: "flex-end",
            marginVertical: 10,
            marginRight: 10
          }}
        >
          Total: {currencyFormat(totalPrice)}
        </AppText>
        <Footer>
          <FooterTab>
            <View style={{ width: "100%" }}>
              <Button
                full
                primary
                disabled={list.length === 0 || status === "ORDERING"}
                small
                iconLeft
                onPress={() =>
                  isLoggedIn
                    ? makeOrder(
                        list.map(product => ({
                          productId: product._id,
                          amount: product.amount,
                          giftIds:
                            product.giftProducts &&
                            product.giftProducts.length > 0
                              ? product.giftProducts.map(product => product._id)
                              : []
                        })),
                        {
                          isLoggedIn,
                          token
                        }
                      )
                    : this.setState({ showInfoDialog: true })
                }
              >
                {status === "ORDERING" && <Spinner />}
                <AppText>CHECK OUT</AppText>
              </Button>
            </View>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  list: state.cart.list,
  status: state.cart.status,
  token: state.user.token,
  totalPrice: reduce(
    state.cart.list,
    (result, product) => result + product.price * product.amount,
    0
  )
});

const mapDispatchToProps = dispatch => ({
  setCart: (token, product, type, amount) =>
    dispatch(setCart(token, product, type, amount)),
  loadCart: token => dispatch(loadCart(token)),
  makeOrder: (productList, token) => dispatch(makeOrder(productList, token)),
  selectProduct: productId => dispatch(selectProduct(productId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
