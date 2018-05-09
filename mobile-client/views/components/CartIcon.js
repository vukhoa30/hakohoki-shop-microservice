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
          <Badge
            warning
            style={{ position: "absolute", right: 5, top: -10, padding: 0, zIndex: 100 }}
          >
            <AppText style={{ fontSize: 10, color: "red", fontWeight: "bold" }}>
              {productCount}
            </AppText>
          </Badge>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  productCount: state.cart.list.length
});

const mapDispatchToProps = (dispatch) => ({
  navigate: (path) => dispatch(navigate(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(CartIcon)

