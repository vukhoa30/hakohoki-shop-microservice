import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import AppNavigation from "./AppNavigation";
import Loading from "./Loading";
import ServerAddressForm from "./ServerAddressForm";

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
    const { serverSetUp, appLoaded } = this.props;
    return !this.state.loadedFont ? (
      <View />
    ) : !serverSetUp ? (
      <ServerAddressForm />
    ) : !appLoaded ? (
      <Loading />
    ) : (
      <AppNavigation />
    );
  }
}

const mapStateToProps = state => ({
  appLoaded: state.app.isAppLoaded,
  serverSetUp: state.app.serverSetUp
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Container);
