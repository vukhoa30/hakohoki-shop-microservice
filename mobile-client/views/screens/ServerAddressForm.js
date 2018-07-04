import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, SubmissionError } from "redux-form";
import { NavigationActions } from "react-navigation";
import { alert } from "../../utils";
import { View } from "react-native";
import { updateServerAddress } from "../../api";
import {
  Container,
  Content,
  Button,
  Form,
  Spinner,
  Item,
  Input,
  Icon,
  Label
} from "native-base";
import AppText from "../components/AppText";

class ServerAddressForm extends Component {
  constructor(props) {
    super(props);
    const { host, port } = this.props;
    this.state = {
      host: host,
      port: port
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.host !== prevProps.host || this.props.port !== prevProps.port) {
      this.move()
    }
  }

  move() {
    const { canGoBack, navigation, moveToHome } = this.props;
    console.log(canGoBack)
    if (canGoBack) navigation.goBack()
    else moveToHome()
  }

  update() {
    const { updateServerAddress, user } = this.props;
    const { isLoggedIn, account } = user;
    const { accountId } = account;
    const { host, port } = this.state;
    if (Number.isInteger(port)) return alert("error", "Invalid port");
    if (
      !new RegExp(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      ).test(host)
    )
      return alert("error", "Invalid host");
    return updateServerAddress(host, port, isLoggedIn, accountId);
  }

  render() {
    const { user } = this.props;
    return (
      <Container>
        <Content style={{ paddingHorizontal: 10 }}>
          <Form>
            <Item>
              <Label>HOST</Label>
              <Input
                placeholder="Enter server host"
                last
                value={this.state.host}
                onChangeText={text => this.setState({ host: text })}
              />
            </Item>
            <Item>
              <Label>PORT</Label>
              <Input
                placeholder="Enter server port"
                last
                value={this.state.port}
                onChangeText={text => this.setState({ port: text })}
              />
            </Item>
          </Form>
          <Button block primary onPress={this.update.bind(this)}>
            <AppText>UPDATE</AppText>
          </Button>
          <Button block danger style={{ marginTop: 10 }} onPress={this.move.bind(this)}>
            <AppText>LOOK GOOD</AppText>
          </Button>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  host: state.app.gateway.host,
  port: state.app.gateway.port,
  user: state.user,
  canGoBack: state.navigation.routes.length > 1
});

const mapDispatchToProps = dispatch => ({
  updateServerAddress: (host, port, isLoggedIn, accountId) =>
    dispatch(updateServerAddress(host, port, isLoggedIn, accountId)),
  moveToHome: () => dispatch(NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: 'Main', actions: NavigationActions.navigate({ routeName: 'Home' }) })
    ],
  }))
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerAddressForm);
