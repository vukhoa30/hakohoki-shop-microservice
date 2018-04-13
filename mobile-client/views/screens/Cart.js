import React, { Component } from "react";
import { connect } from "react-redux";
import { View, ScrollView, Dimensions } from "react-native";
import { setCart, loadCart } from "../../api";
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
  Spinner
} from "native-base";
import AppText from "../components/AppText";
import NumberPicker from "../components/NumberPicker";
import { currencyFormat, confirm } from "../../utils";
import { reduce } from "lodash";

const { width, height } = Dimensions.get("window");

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPickerDialog: false,
      modifiedProduct: null
    };
    const { isLoggedIn, token, loadCart } = this.props;
    if (isLoggedIn) loadCart(token);
  }

  render() {
    const { setCart, totalPrice, list, token, status } = this.props;
    return (
      <Container>
        <Content>
          {status === "LOADING" && (
            <View
              style={{
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                width,
                height: height - 50,
                zIndex: 100,
              }}
            >
              <Spinner />
            </View>
          )}
          <NumberPicker
            product={this.state.modifiedProduct}
            isVisible={this.state.showPickerDialog}
            submit={number =>
              setCart(token, this.state.modifiedProduct, "UPDATE", number)
            }
            closeDialog={() => this.setState({ showPickerDialog: false })}
          />
          {list.length > 0 ? (
            <List
              dataArray={list}
              renderRow={product => (
                <ListItem
                  onPress={() =>
                    this.setState({
                      showPickerDialog: true,
                      modifiedProduct: product
                    })
                  }
                >
                  <Thumbnail
                    square
                    size={80}
                    source={{ uri: product.mainPicture }}
                  />
                  <Body>
                    <AppText>{product.name}</AppText>
                    <AppText color="red">
                      {currencyFormat(product.price)}
                    </AppText>
                    <AppText small note>
                      Quantity: {product.amount}
                    </AppText>
                  </Body>
                  <Right>
                    <Icon
                      name="md-remove-circle"
                      style={{ color: "red" }}
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
                  </Right>
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
              <Button block primary disabled={list.length === 0} small>
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
  loadCart: token => dispatch(loadCart(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
