import React, { Component } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Card, CardItem, Left, Body, Icon, Button, Right } from "native-base";
import { currencyFormat, reduceString } from "../../utils";
import AppText from "./AppText";
var unknown = require("../../resources/images/unknown.png");

class ProductShowcase extends Component {
  state = {};
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
  render() {
    const { item, onSelected } = this.props;
    const outOfOrder = require("../../resources/images/sold-out.png");
    return (
      <TouchableOpacity
        style={{ width: "100%" }}
        onPress={() => onSelected(item._id)}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            paddingVertical: 10,
            margin: 5
          }}
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
          <Image
            source={
              item.mainPicture && item.mainPicture !== ""
                ? {
                    uri: item.mainPicture
                  }
                : unknown
            }
            style={{ width: "100%", height: 200 }}
          />
          <AppText large style={{ fontWeight: "bold", zIndex: 101 }}>
            {reduceString(item.name)}
          </AppText>
          {/* {item.quantity && (
            <AppText note small>
              Quantity: {item.quantity}
            </AppText>
          )} */}
          <AppText note small>
            {item.quantity ? `Quantity: ${item.quantity}` : "Quantity: 0"}
          </AppText>
          {item.promotionPrice ? (
            <View>
              <AppText large color="red">
                {currencyFormat(item.promotionPrice)}
              </AppText>
              <AppText
                small
                note
                style={{
                  marginRight: 10,
                  textDecorationLine: "line-through"
                }}
              >
                {currencyFormat(item.price)}
              </AppText>
            </View>
          ) : (
            <View>
              <AppText large color="red">
                {currencyFormat(item.price)}
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
    );
  }
}

export default ProductShowcase;
