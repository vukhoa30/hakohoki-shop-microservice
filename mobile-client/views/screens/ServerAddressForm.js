import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm, SubmissionError } from "redux-form";
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

  update() {
    const { updateServerAddress } = this.props;
    const { host, port } = this.state;
    if (Number.isInteger(port)) return alert("Invalid port");
    if (
      !new RegExp(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      ).test(host)
    )
      return alert("Invalid host");
    alert('Updated gateway address')
    return updateServerAddress(host, port);
  }

  render() {
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
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  host: state.app.gateway.host,
  port: state.app.gateway.port
});

const mapDispatchToProps = dispatch => ({
  updateServerAddress: (host, port) => dispatch(updateServerAddress(host, port))
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerAddressForm);
