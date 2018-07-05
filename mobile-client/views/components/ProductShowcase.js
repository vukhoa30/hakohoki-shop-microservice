import React, { Component } from "react";
import {
  Image,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback
} from "react-native";
import { Card, CardItem, Left, Body, Icon, Button, Right } from "native-base";
import { currencyFormat, reduceString } from "../../utils";
import { withNavigation } from "react-navigation";
import AppText from "./AppText";
var unknown = require("../../resources/images/unknown.png");

class ProductShowcase extends Component {
  state = {
    item: null,
    fullWidth: 0
  };
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
    const curItem = this.props.item;
    this.setState({
      item: {
        ...curItem,
        promotionPrice: curItem.promotionPrice
          ? currencyFormat(curItem.promotionPrice)
          : undefined,
        price: currencyFormat(curItem.price)
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.item._id !== prevProps.item._id) {
      const curItem = this.props.item;
      this.setState({
        item: {
          ...curItem,
          promotionPrice: curItem.promotionPrice
            ? currencyFormat(curItem.promotionPrice)
            : undefined,
          price: currencyFormat(curItem.price)
        }
      });
    }
  }

  render() {
    const { item, fullWidth } = this.state;
    const { onSelected, navigation } = this.props;
    const outOfOrder = require("../../resources/images/sold-out.png");
    return item !== null ? (
      <TouchableOpacity
        style={{ width: "100%" }}
        onPress={() =>
          navigation.navigate("ProductDetail", {
            product: item,
            productId: item._id
          })
        }
        onLayout={e => this.setState({ fullWidth: e.nativeEvent.layout.width  })}
      >
        <View
          style={{
            backgroundColor: "white",
            paddingVertical: 10,
            margin: 5
          }}
          onPress={() => onSelected(item)}
        >
          {item.sold5OrOver && (
            <Image
              source={require("../../resources/images/hot-sale.png")}
              style={{
                right: 0,
                zIndex: 100,
                width: 50,
                height: 50,
                position: "absolute",
                resizeMode: "stretch"
              }}
            />
          )}
          {item.quantity === 0 && (
            <Image
              source={outOfOrder}
              style={{
                width: 140,
                height: 70,
                position: "absolute",
                zIndex: 100,
                resizeMode: "stretch",
                top: 100,
                left: 20
              }}
            />
          )}
          <View style={{ width: fullWidth, height: fullWidth + 50 }}>
            <Image
              source={
                item.mainPicture && item.mainPicture !== ""
                  ? {
                      uri: item.mainPicture
                    }
                  : unknown
              }
              style={{ width: fullWidth, height: fullWidth }}
            />
          </View>
          <AppText large style={{ fontWeight: "bold" }}>
            {reduceString(item.name)}
          </AppText>
          <AppText note small>
            {item.quantity ? `Quantity: ${item.quantity}` : "Quantity: 0"}
          </AppText>
          {item.promotionPrice ? (
            <View>
              <AppText large color="red">
                {item.promotionPrice}
              </AppText>
              <AppText
                small
                note
                style={{
                  marginRight: 10,
                  textDecorationLine: "line-through"
                }}
              >
                {item.price}
              </AppText>
            </View>
          ) : (
            <View>
              <AppText large color="red">
                {item.price}
              </AppText>
              <AppText small style={{ opacity: 0 }}>
                no promotion
              </AppText>
            </View>
          )}
          <View style={{ flexDirection: "row" }}>
            {this.renderStars(item.reviewScore || 0)}
            <AppText small style={{ alignSelf: "flex-end" }} note>
              ({item.reviewCount || 0})
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <View />
    );
  }
}

export default withNavigation(ProductShowcase);
