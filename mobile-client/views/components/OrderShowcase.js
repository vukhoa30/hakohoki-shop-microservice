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
    this.state = {
      order: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.order._id !== prevProps.order._id) this.formatData();
  }

  componentDidMount() {
    this.formatData();
  }

  formatData() {
    const { order: rawOrder } = this.props;
    this.setState({
      order: {
        ...rawOrder,
        totalPrice: currencyFormat(rawOrder.totalPrice),
        createdAt: formatTime(rawOrder.createdAt),
        completedAt: rawOrder.completedAt
          ? formatTime(rawOrder.completedAt)
          : null
      }
    });
  }

  render() {
    const { navigate } = this.props;
    const { order } = this.state;
    return order !== null ? (
      <ListItem onPress={() => navigate("OrderDetail", { orderId: order._id })}>
        <Thumbnail
          square
          size={80}
          source={order.status === "pending" ? pending : completed}
          style={{ resizeMode: "stretch" }}
        />
        <Body>
          <AppText
            style={{ color: order.status === "pending" ? "orange" : "green" }}
          >
            {order.status.toUpperCase()}
          </AppText>
          <AppText>Total price: {order.totalPrice}</AppText>
          <AppText note>{order.specificProducts.length} products</AppText>
        </Body>
        <Right>
          <AppText small note>
            {order.status === "pending" ? order.createdAt : order.completedAt}
          </AppText>
        </Right>
      </ListItem>
    ) : (
      <View />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  navigate: (path, params) => dispatch(navigate(path, params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderShowcase);
