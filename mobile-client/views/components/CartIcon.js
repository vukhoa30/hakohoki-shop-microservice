import React, { Component } from "react";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import { View, Text, TouchableOpacity } from "react-native";
import { Container, Content, Button, Icon, Badge } from "native-base";
import AppText from "./AppText";
import { navigate } from "../../api";

class CartIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigate, productCount } = this.props;
    return (
      <View>
        <Icon
          name="cart"
          style={{ marginRight: 20, color: "white" }}
          onPress={() => navigate("Cart")}
        />
        {productCount > 0 && (
          <View
            style={{
              position: "absolute",
              right: 5,
              top: -10,
              padding: 2,
              paddingHorizontal: 7,
              zIndex: 100,
              backgroundColor: "orange",
              borderRadius: 25
            }}
          >
            <AppText style={{ fontSize: 10, color: "red", fontWeight: "bold" }}>
              {productCount}
            </AppText>
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  productCount: state.cart.list.reduce(
    (result, cart) => result + cart.amount,
    0
  )
});

const mapDispatchToProps = dispatch => ({
  navigate: path => dispatch(navigate(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(CartIcon);
