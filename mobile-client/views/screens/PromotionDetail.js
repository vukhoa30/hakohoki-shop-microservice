import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Dimensions, ScrollView, Image } from "react-native";
import { selectProduct, loadPromotion } from "../../api";
import {
  Container,
  Header,
  Content,
  Button,
  List,
  ListItem,
  Body,
  Thumbnail,
  Grid,
  Col,
  Spinner,
  FooterTab,
  Footer
} from "native-base";
import AppText from "../components/AppText";
import { getDate, currencyFormat } from "../../utils";
var unknown = "../../resources/images/unknown.png";
const { width, height } = Dimensions.get("window");

class PromotionDetail extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    const { status, loadPromotion } = this.props;
    const { promotionId } = params ? params : {};
    this.state = {
      promotionId,
      promotion: null,
      image: unknown
    };
    if (status === "INIT") loadPromotion();
  }

  componentDidMount() {
    if (this.props.status === "LOADED") {
      const { promotionId } = this.state;
      const { list } = this.props;
      const promotion = list.find(
        curPromotion => curPromotion.id === promotionId
      );
      if (promotion) this.setState({ promotion, image: promotion["poster_url"] });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.status === "INIT" && nextProps.status === "LOADED") {
      const { promotionId } = this.state;
      const { list } = nextProps;
      const promotion = list.find(
        curPromotion => curPromotion.id === promotionId
      );
      if (promotion) this.setState({ promotion, image: promotion["poster_url"]  });
    }
  }

  render() {
    const { selectProduct, status } = this.props;
    const { promotion, image } = this.state;
    return (
      <Container>
        {status === "LOADING" && (
          <View style={{ flex: 1, alignItems: "center" }}>
            <Spinner />
          </View>
        )}
        <Content style={{ backgroundColor: "white" }}>
          {promotion !== null && (
            <View>
              <Image
                style={{ width, height: height / 3, resizeMode: "stretch" }}
                source={{ uri: image }}
                onError={e => this.setState({ image: unknown })}
              />
              <AppText large color="red" style={{ margin: 5 }}>
                {promotion.name}
              </AppText>
              <AppText note small style={{ margin: 5 }}>
                {getDate(promotion["start_at"]) +
                  " - " +
                  getDate(promotion["end_at"])}
              </AppText>
              <List
                dataArray={promotion.products}
                renderRow={product => (
                  <ListItem
                    key={"product-" + product._id}
                    onPress={() =>
                      selectProduct({
                        product: product,
                        productId: product._id
                      })
                    }
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
                              {product.name}
                            </AppText>
                            {product.promotionPrice ? (
                              <View>
                                <AppText color="red">
                                  {currencyFormat(product.promotionPrice)}
                                </AppText>
                                <AppText
                                  style={{ textDecorationLine: "line-through" }}
                                  small
                                  note
                                >
                                  {currencyFormat(product.price)}
                                </AppText>
                              </View>
                            ) : (
                              <AppText color="red">
                                {currencyFormat(product.price)}
                              </AppText>
                            )}
                            {/* <AppText small note>
                    Quantity: {product.amount}
                  </AppText> */}
                          </View>
                          {product.giftProducts &&
                            product.giftProducts.length > 0 && (
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
                                {product.giftProducts.map(giftProduct => (
                                  <Grid
                                    key={"gift-product-" + giftProduct._id}
                                    style={{ marginBottom: 20 }}
                                    onPress={e =>
                                      selectProduct({
                                        product: giftProduct,
                                        productId: giftProduct._id
                                      })
                                    }
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
                                          {giftProduct.name}
                                        </AppText>
                                        <AppText color="red">
                                          {currencyFormat(
                                            giftProduct.promotionPrice
                                              ? giftProduct.promotionPrice
                                              : giftProduct.price
                                          )}
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
          )}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  ...state.promotion
});

const mapDispatchToProps = dispatch => ({
  selectProduct: productInfo => dispatch(selectProduct(productInfo)),
  loadPromotion: () => dispatch(loadPromotion())
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionDetail);
