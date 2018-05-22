import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import {
  Container,
  Content,
  Button,
  Spinner,
  Grid,
  Col,
  Body,
  List,
  ListItem,
  Thumbnail
} from "native-base";
import AppText from "../components/AppText";
import OrderShowcase from "../components/OrderShowcase";
import { transform, reduce } from "lodash";
import { loadOrderDetail } from "../../api";
import { currencyFormat, width } from "../../utils";

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    const { order } = this.props;
    this.state = { order, products: null, seller: null };
  }

  componentDidMount() {
    if (this.state.order !== null) this.analyzeData(this.state.order);
    else this.loadData();
  }

  loadData() {
    loadOrderDetail(this.props.token, this.props.orderId).then(result => {
      if (result.ok)
        this.setState({
          order: result.data,
          products: result.data.products,
          seller: result.data.seller ? result.data.seller : null
        });
    });
  }

  mapName(name) {
    switch (name) {
      case "accountId":
        return "ID";
      case "fullName":
        return "Name";
      case "email":
        return "Email";
      case "role":
        return "Role";
      default:
        return "Phone";
    }
  }

  analyzeData(order) {
    const products = transform(
      order.specificProducts,
      (result, cur) => {
        const element = result.find(
          product => product.productName === cur.productName
        );
        if (element) {
          element.specifics.push(cur.id);
        } else {
          result.push({
            productName: cur.productName,
            price: cur.price,
            specifics: [cur.id],
            mainPicture: cur.mainPicture,
            specificGifts: cur.specificGifts
          });
        }
        return result;
      },
      []
    );
    this.setState({
      products,
      seller: order.seller
        ? reduce(
            order.seller,
            (result, value, key) => {
              result.push({
                name: key,
                value
              });
              return result;
            },
            []
          )
        : null
    });
  }

  render() {
    const { order, products, seller } = this.state;
    return (
      <Container>
        <Content>
          {order !== null && <OrderShowcase order={order} />}
          {products !== null ? (
            <View style={{ padding: 10, backgroundColor: 'white' }}>
              {seller !== null && (
                <View style={{ marginBottom: 10 }}>
                  <AppText small note>
                    SELLER INFORMATION
                  </AppText>
                  {seller.map((info, index) => (
                    <Grid
                      key={"seller-info-" + index}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#eee" : "white",
                        padding: 5
                      }}
                    >
                      <Col style={{ width: width / 4 }}>
                        <AppText small>{this.mapName(info.name)}</AppText>
                      </Col>
                      <Col>
                        <AppText small note>
                          {info.value}
                        </AppText>
                      </Col>
                    </Grid>
                  ))}
                </View>
              )}
              <AppText small note>
                PRODUCTS
              </AppText>
              <List
                dataArray={products}
                renderRow={product => (
                  <ListItem
                    key={"product-" + product._id}
                    // onPress={() =>
                    //   selectProduct({
                    //     product: product,
                    //     productId: product._id
                    //   })
                    // }
                  >
                    <Body>
                      <Grid>
                        <Col style={{ width: 70 }}>
                          <Thumbnail
                            square
                            size={100}
                            source={
                              product.mainPicture && product.mainPicture !== ""
                                ? {
                                    uri: product.mainPicture
                                  }
                                : unknown
                            }
                          />
                        </Col>
                        <Col>
                          <View>
                            <AppText style={{ fontWeight: "bold" }}>
                              {product.productName}
                            </AppText>
                            <AppText note small>
                              Quantity: {product.specifics.length}
                            </AppText>
                            <AppText color="red">
                              {currencyFormat(product.price)}
                            </AppText>
                            {/* <AppText small note>
                    Quantity: {product.amount}
                  </AppText> */}
                          </View>
                          {product.specificGifts &&
                            product.specificGifts.length > 0 && (
                              <View
                                style={{
                                  marginTop: 20,
                                  paddingTop: 10,
                                  borderTopWidth: 0.5,
                                  borderTopColor: "gray"
                                }}
                              >
                                <AppText style={{ marginBottom: 20 }} note>
                                  Attached products (free cost)
                                </AppText>
                                {product.specificGifts.map(giftProduct => (
                                  <Grid
                                    key={"gift-product-" + giftProduct._id}
                                    style={{ marginBottom: 20 }}
                                    // onPress={e =>
                                    //   selectProduct({
                                    //     product: giftProduct,
                                    //     productId: giftProduct._id
                                    //   })
                                    // }
                                  >
                                    <Col style={{ width: 70 }}>
                                      <Thumbnail
                                        square
                                        size={70}
                                        source={
                                          giftProduct.mainPicture &&
                                          giftProduct.mainPicture !== ""
                                            ? {
                                                uri: giftProduct.mainPicture
                                              }
                                            : unknown
                                        }
                                      />
                                    </Col>
                                    <Col>
                                      <View>
                                        <AppText style={{ fontWeight: "bold" }}>
                                          {giftProduct.productName}
                                        </AppText>
                                      </View>
                                    </Col>
                                  </Grid>
                                ))}
                              </View>
                            )}
                        </Col>
                      </Grid>
                    </Body>
                  </ListItem>
                )}
              />
            </View>
          ) : (
            <Spinner style={{ alignSelf: "center" }} />
          )}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { token } = state.user;
  const { list } = state.order;
  const { params } = props.navigation.state;
  const { orderId } = params ? params : {};
  const order = list.find(order => order._id === orderId);
  return {
    orderId,
    order: order ? order : null,
    token
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
