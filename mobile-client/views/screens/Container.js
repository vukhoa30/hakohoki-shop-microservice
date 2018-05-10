import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import AppNavigation from "./AppNavigation";
import Loading from "./Loading";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = { loadedFont: false };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loadedFont: true });
  }

  render() {
    return this.state.loadedFont && this.props.appLoaded ? <AppNavigation /> : <Loading />;
  }
}

const mapStateToProps = (state) => ({
    appLoaded: state.app.isAppLoaded
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Container);
