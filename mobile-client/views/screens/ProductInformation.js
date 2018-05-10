import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Thumbnail,
  Icon,
  Left,
  Body,
  Spinner,
  Text,
  Button,
  List,
  ListItem,
  Footer,
  FooterTab,
  Grid,
  Col
} from "native-base";
import AppText from "../components/AppText";
import AppContainer from "../components/AppContainer";
import FeatureList from "../components/FeatureList";
import AppButton from "../components/AppButton";
import AppProductFooter from "../components/AppProductFooter";
import { loadProductInformation } from "../../api";
import { currencyFormat, alert, confirm } from "../../utils";
import Carousel, { Pagination } from "react-native-snap-carousel";

const { width } = Dimensions.get("window");

class ProductInformation extends Component {
  static navigationOptions = {
    title: "Information"
  };

  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      pictures: []
    };
    const { loadProductInformation, token, productId } = this.props;
    loadProductInformation(productId, token);
  }

  _renderItem = ({ item, index }) => {
    return (
      <Image
        source={{
          uri:
            item && item !== ""
              ? item
              : "https://vignette.wikia.nocookie.net/yade/images/d/dd/Unknown.png/revision/latest?cb=20070619224801"
        }}
        style={{
          width: "100%",
          height: "100%",
          resizeMode: "stretch"
        }}
      />
    );
  };

  // getPictureObject(pictureURI) {
  //   return new Promise((resolve, reject) => {
  //     Image.getSize(
  //       pictureURI,
  //       (imgWidth, imgHeight) => {
  //         const height = imgHeight * (imgWidth / width);
  //         resolve({
  //           uri: pictureURI,
  //           width: "100%",
  //           height
  //         });
  //       },
  //       error =>
  //         resolve({
  //           uri:
  //             "https://vignette.wikia.nocookie.net/yade/images/d/dd/Unknown.png/revision/latest?cb=20070619224801",
  //           width: "100%",
  //           height: "100%"
  //         })
  //     );
  //   });
  // }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.data !== null) {
      if (
        (this.props.status !== nextProps.status &&
          nextProps.status === "LOADED") ||
        this.props.productId !== nextProps.productId
      ) {
        const { data } = nextProps;
        const { mainPicture, additionPicture } = data;
        this.setState({
          pictures: [mainPicture].concat(additionPicture ? additionPicture : [])
        });
      }
    }
  }

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

  renderAsStatus() {
    const { token, status, data, productId } = this.props;
    const outOfOrder = require("../../resources/images/sold-out.png");

    switch (status) {
      case "LOADING":
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Spinner />
          </View>
        );
      case "LOADING_FAILED":
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <AppText color="red" small style={{ marginBottom: 10 }}>
              Could not load data
            </AppText>
            <AppButton
              small
              warning
              style={{ alignSelf: "center" }}
              onPress={() => loadProductInformation(productId, token)}
            >
              Reload
            </AppButton>
          </View>
        );
      default:
        return data !== null ? (
          <Container>
            <Content style={{ backgroundColor: "#eee" }}>
              {data !== null && (
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
              )}
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
                <AppText color="red">
                  {currencyFormat(
                    data.promotionPrice ? data.promotionPrice : data.price
                  )}
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
              {(data.promotionPrice ||
                (data.giftProducts && data.giftProducts.length > 0)) && (
                <Card style={{ padding: 10 }}>
                  <AppText>PROMOTION</AppText>
                  {data.promotionPrice && (
                    <AppText small color="gray">
                      * Discount: {currencyFormat(data.price)} ->{" "}
                      {currencyFormat(data.promotionPrice)}
                    </AppText>
                  )}
                </Card>
              )}
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
                <AppText small color="gray">
                  {data.description}
                </AppText>
                {data.specifications && (
                  <View>
                    <View
                      style={{ width: "100%", marginTop: 10, borderWidth: 1 }}
                    >
                      {Object.keys(data.specifications).map(key => (
                        <Grid
                          key={"specification-item-" + key}
                          style={{
                            padding: 0,
                            margin: 0
                          }}
                        >
                          <Col
                            style={{
                              borderRightWidth: 1,
                              borderBottomWidth: 1,
                              backgroundColor: "#eee",
                              padding: 10,
                              margin: 0
                            }}
                          >
                            <AppText small style={{ fontWeight: "bold" }}>
                              {key}
                            </AppText>
                          </Col>
                          <Col
                            style={{
                              padding: 10,
                              margin: 0,
                              borderBottomWidth: 1
                            }}
                          >
                            <AppText small>{data.specifications[key]}</AppText>
                          </Col>
                        </Grid>
                      ))}
                    </View>
                  </View>
                )}
              </Card>
            </Content>
            <AppProductFooter />
          </Container>
        ) : (
          <View />
        );
    }
  }

  render() {
    return this.renderAsStatus();
  }
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80
  },
  background: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    height: "100%"
  }
});

const mapStateToProps = state => {
  const { token } = state.user;
  const { status, data, productId } = state.product;

  return {
    token,
    productId,
    status,
    data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadProductInformation: (productId, token) =>
      dispatch(loadProductInformation(productId, token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductInformation);
