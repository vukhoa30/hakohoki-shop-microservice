import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import {} from "../../api";
import {
  Container,
  Content,
  Button,
  List,
  ListItem,
  Body,
  Right,
  Icon
} from "native-base";
import AppText from "../components/AppText";

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation, gateway } = this.props;
    return (
      <Container>
        <Content>
          <List>
            <ListItem
              iconRight
              onPress={() => navigation.navigate("ServerAddressForm")}
            >
              <Body>
                <AppText>SERVER ADDRESS</AppText>
                <AppText note small>
                  {"http://" + gateway.host + ":" + gateway.port}
                </AppText>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  ...state.app
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
