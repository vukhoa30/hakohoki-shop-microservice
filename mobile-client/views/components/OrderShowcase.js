import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import {
  Container,
  Content,
  Button,
  ListItem,
  Body,
  Thumbnail,
  Right
} from "native-base";
import AppText from "./AppText";
import { formatTime, currencyFormat } from "../../utils";
import { navigate } from "../../api";

var pending = require("../../resources/images/bill.png");
var completed = require("../../resources/images/bill_complete.png");

class OrderShowcase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { order, navigate } = this.props;
    return (
      <ListItem onPress={() => navigate("OrderDetail", { orderId: order._id })}>
        <Thumbnail
          square
          size={80}
          source={order.status === "pending" ? pending : completed}
          style={{ resizeMode: 'stretch' }}
        />
        <Body>
          <AppText
            style={{ color: order.status === "pending" ? "orange" : "green" }}
          >
            {order.status.toUpperCase()}
          </AppText>
          <AppText>Total price: {currencyFormat(order.totalPrice)}</AppText>
          <AppText note>{order.specificProducts.length} products</AppText>
        </Body>
        <Right>
          <AppText small note>
            {formatTime(
              order.status === "pending" ? order.createdAt : order.completedAt
            )}
          </AppText>
        </Right>
      </ListItem>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  navigate: (path, params) => dispatch(navigate(path, params))
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderShowcase);
