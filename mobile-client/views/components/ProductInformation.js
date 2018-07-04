import React, { Component } from "react";
import { connect } from "react-redux";
import { View, ScrollView, Dimensions, Image } from "react-native";
import { Container, Content, Button, Card, Grid, Col, Icon } from "native-base";
import { currencyFormat, alert, confirm } from "../../utils";
import { selectProduct } from "../../api";
import AppText from "./AppText";
import Carousel, { Pagination } from "react-native-snap-carousel";
import ProductShowcase from "./ProductShowcase";
var unknown = require("../../resources/images/unknown.png");
const { width } = Dimensions.get("window");

class ProductInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      pictures: [],
      data: null
    };
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

  componentDidMount() {
    const { product: curItem } = this.props;
    const { mainPicture, additionPicture } = curItem;
    this.setState({
      pictures: [mainPicture].concat(additionPicture ? additionPicture : []),
      data: curItem
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.product._id !== prevProps.product._id) {
      const curItem = this.props.product;
      this.setState({
        data: curItem
      })
    }
  }

  _renderItem = ({ item, index }) => {
    return (
      <Image
        source={
          item && item !== ""
            ? {
              uri: item
            }
            : unknown
        }
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "stretch"
        }}
      />
    );
  };

  get pagination() {
    const { activeSlide, pictures } = this.state;
    return (
      <Pagination
        carouselRef={this._carousel}
        dotsLength={pictures.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: "transparent",
          position: "absolute",
          bottom: 0,
          right: 30
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 25,
          backgroundColor: "red"
        }}
        inactiveDotStyle={{
          width: 10,
          height: 10,
          backgroundColor: "white"
        }}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
  }

  render() {
    const { data } = this.state;
    const { selectProduct, err } = this.props;
    return (
      <View>
        {data !== null &&
          <View>
            <View
              style={[
                {
                  width: width,
                  alignItems: "center",
                  justifyContent: "center",
                  height: width - 50
                }
              ]}
            >
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={this.state.pictures}
                renderItem={this._renderItem.bind(this)}
                sliderWidth={width}
                itemWidth={width}
                onSnapToItem={slideIndex =>
                  this.setState({ activeSlide: slideIndex })
                }
                layout={"default"}
                firstItem={0}
                loop={true}
              />
              {this.pagination}
            </View>
            <Card
              style={{
                width: "100%",
                padding: 10,
                backgroundColor: "white",
                borderRadius: 0,
                shadowOffset: {
                  width: 1,
                  height: 1
                },
                marginTop: 0
              }}
            >
              {/* 
              <Text note>Guarantee {data.guarantee} months</Text>
              <AppText note small style={{ opacity: data.quantity > 0 ? 1 : 0 }}>
                Quantity: {data.quantity}
              </AppText> */}
              <AppText>{data.name}</AppText>
              <View style={{ flexDirection: "row" }}>
                {this.renderStars(data.reviewScore || 0)}
                <AppText small style={{ alignSelf: "flex-end" }} note>
                  ({data.reviewCount || 0} reviews)
            </AppText>
              </View>
              <AppText color="red">
                {data.promotionPrice ? data.promotionPrice : data.price}
              </AppText>
              {/* <Text style={{ fontWeight: "bold" }}>Description</Text>
              <Text>{data.description}</Text> */}
            </Card>
            {/* <Card style={{ flex: 1 }}>
              {data.sold5OrOver && (
                <Image
                  source={require("../../resources/images/hot-sale.png")}
                  style={{
                    right: 0,
                    zIndex: 100,
                    width: 100,
                    height: 100,
                    position: "absolute",
                    resizeMode: "stretch"
                  }}
                />
              )}
              {data.quantity === 0 && (
                <Image
                  source={outOfOrder}
                  style={{
                    width: "80%",
                    height: 200,
                    position: "absolute",
                    zIndex: 100,
                    resizeMode: "stretch",
                    top: 140,
                    left: 20
                  }}
                />
              )}
            </Card> */}
            {/* {data.additionPicture && data.additionPicture.length > 0 ? (
              <Card>
                <CardItem header>
                  <Text>Other pictures</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <List
                      dataArray={data.additionPicture}
                      horizontal={true}
                      renderRow={(item, index) => (
                        <ListItem key={"picture-" + index}>
                          <Image
                            source={{
                              uri: item,
                              width: 200,
                              height: 170,
                              resizeMode: "stretch"
                            }}
                          />
                        </ListItem>
                      )}
                    />
                  </Body>
                </CardItem>
              </Card>
            ) : null} */}
            <Card
              style={{
                width: "100%",
                backgroundColor: "white",
                marginTop: 10,
                borderRadius: 0,
                padding: 10
              }}
            >
              <AppText>PRODUCT DETAIL</AppText>
              <View style={{ marginTop: 5 }}>
                <AppText small note>
                  DESCRIPTION
            </AppText>
                <View
                  style={{
                    width: "100%",
                    padding: 5,
                    backgroundColor: "#eee",
                    minHeight: 100
                  }}
                >
                  <AppText small>{data.description}</AppText>
                </View>
              </View>
              {(data.promotionPrice ||
                (data.giftProducts && data.giftProducts.length > 0)) && (
                  <View
                    style={{
                      marginVertical: 10,
                      borderWidth: 1,
                      borderColor: "green",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        backgroundColor: "green",
                        flexDirection: "row",
                        borderColor: "green",
                        padding: 5
                      }}
                    >
                      <Icon
                        name="md-color-wand"
                        style={{ color: "white", marginRight: 10, fontSize: 15 }}
                      />
                      <AppText color="white">PROMOTION</AppText>
                    </View>
                    <View style={{ width: "100%", padding: 5 }}>
                      {data.promotionPrice && (
                        <AppText small color="gray">
                          * Discount: {data.price} -> {data.promotionPrice}
                        </AppText>
                      )}
                      {data.giftProducts &&
                        data.giftProducts.length > 0 && (
                          <View>
                            <AppText small color="gray">
                              * Get these products free when buying this one
                      </AppText>
                            <ScrollView horizontal={true} style={{ width: "100%" }}>
                              {data.giftProducts.map(product => (
                                <View key={product._id} style={{ width: width / 2 }}>
                                  <ProductShowcase
                                    onSelected={product =>
                                      selectProduct({
                                        product,
                                        productId: product._id
                                      })
                                    }
                                    item={product}
                                  />
                                </View>
                              ))}
                            </ScrollView>
                          </View>
                        )}
                    </View>
                  </View>
                )}
              {data.specifications && (
                <View style={{ marginTop: 10 }}>
                  <AppText small note>
                    CONFIGURATION
              </AppText>
                  <View style={{ width: "100%" }}>
                    {Object.keys(data.specifications).map((key, index) => (
                      <Grid
                        key={"specification-item-" + key}
                        style={{
                          backgroundColor: index % 2 === 0 ? "#eee" : "white",
                          padding: 5
                        }}
                      >
                        <Col>
                          <AppText small>{key}</AppText>
                        </Col>
                        <Col>
                          <AppText small note>
                            {data.specifications[key]}
                          </AppText>
                        </Col>
                      </Grid>
                    ))}
                  </View>
                </View>
              )}
            </Card>
          </View>
        }
      </View>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  selectProduct: productInfo => dispatch(selectProduct(productInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductInformation);
