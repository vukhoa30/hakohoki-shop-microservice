import React, { Component } from "react";
import { connect } from "react-redux";
import { View, TouchableOpacity } from "react-native";
import { Container, Content, Button, Icon } from "native-base";
import AppText from "./AppText";
import { removeSession } from "../../api";

class BackButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type, navigation, removeSession } = this.props;
    return (
      <TouchableOpacity
        style={{ width: "100%", padding: 5 }}
        onPress={() => {
          navigation.goBack();
          removeSession(type);
        }}
      >
        <Icon style={{ color: "white", marginLeft: 15 }} name="md-arrow-back" />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  removeSession: type => dispatch(removeSession(type))
});

export default connect(mapStateToProps, mapDispatchToProps)(BackButton);
