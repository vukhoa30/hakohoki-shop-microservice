import React, { Component } from "react";
import {
  Grid,
  Row,
  Icon,
  Col,
  Card,
  CardItem,
  Container,
  Content,
  Badge,
  List,
  ListItem,
  Left,
  Right,
  Body,
  Form,
  Button
} from "native-base";
import AppContainer from "../components/AppContainer";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground
} from "react-native";
import AppIconButton from "../components/AppIconButton";
import { connect } from "react-redux";
import { logOut } from "../../api";
import { confirm } from "../../utils";

class Profile extends Component {
  state = {};
  renderAsAnonymousMode() {
    const { navigation } = this.props;
    return (
      <Grid>
        <Row size={60}>
          <Image
            source={require("../../resources/images/profileBackground.jpg")}
            style={{ resizeMode: "stretch", width: "100%", height: "100%" }}
          />
        </Row>
        <Row size={40} style={{ paddingTop: 50 }}>
          <Container>
            <AppButton
              block
              primary
              onPress={() => navigation.navigate("LogIn")}
              style={{ margin: 5 }}
            >
              LOG IN
            </AppButton>
            <AppButton
              block
              primary
              bordered
              onPress={() => navigation.navigate("SignUp")}
              style={{ margin: 5 }}
            >
              SIGN UP
            </AppButton>
          </Container>
        </Row>
      </Grid>
    );
  }

  renderAsLoggedInMode() {
    const {
      notificationUnreadCount,
      navigation,
      logOut,
      fullName,
      email,
      phoneNumber
    } = this.props;
    const { width } = Dimensions.get("window");
    const avatarSize = 100;

    const featureList = [
      {
        icon: "ios-notifications-outline",
        name: "Notification",
        key: "NOTIFICATION"
      },
      {
        icon: "ios-paper-outline",
        name: "Orders",
        key: "ORDERS"
      },
      {
        icon: "md-paper",
        name: "Watch list",
        key: "WATCH_LIST"
      }
    ];

    return (
      <Container style={{ backgroundColor: "#eee" }}>
        <Content>
          <ImageBackground
            source={{
              uri:
                "https://opticalcortex.com/app/uploads/2014/08/grad-670x376.jpg"
            }}
            style={styles.background}
          >
            <Grid>
              <Col
                style={{
                  width: 100,
                  flexDirection: "column",
                  justifyContent: "center",
                  marginHorizontal: 20
                }}
              >
                <Image
                  source={{
                    uri:
                      "http://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png",
                    width: avatarSize,
                    height: avatarSize
                  }}
                />
              </Col>
              <Col
                style={{ flexDirection: "column", justifyContent: "center" }}
              >
                <AppText color="white" large>
                  {fullName}
                </AppText>
                <Button
                  style={{ marginVertical: 5 }}
                  iconLeft
                  small
                  danger
                  onPress={() =>
                    confirm("Leave now?", "Are you sure to log out?", logOut)
                  }
                >
                  <Icon name="md-exit" />
                  <AppText small>Log out</AppText>
                </Button>
              </Col>
            </Grid>
          </ImageBackground>
          <View style={{ marginBottom: 20, backgroundColor: "white" }}>
            <List>
              <ListItem icon>
                <Left>
                  <Icon name="ios-mail" />
                </Left>
                <Body>
                  <AppText small>{email}</AppText>
                </Body>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Icon name="ios-phone-portrait" />
                </Left>
                <Body>
                  <AppText small>{phoneNumber}</AppText>
                </Body>
              </ListItem>
            </List>
          </View>
          <List style={{ marginVertical: 5, backgroundColor: "white" }}>
            <ListItem icon onPress={() => this.select("WATCH_LIST")}>
              <Left>
                <Icon name="md-paper" />
              </Left>
              <Body>
                <AppText>Watch list</AppText>
              </Body>
            </ListItem>
            <ListItem icon onPress={() => this.select("CART")}>
              <Left>
                <Icon name="cart" />
              </Left>
              <Body>
                <AppText>My cart</AppText>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }

  select(key) {
    const { navigation } = this.props;

    switch (key) {
      case "CART":
        navigation.navigate("Cart");
        break;
      case "WATCH_LIST":
        navigation.navigate("WatchList");
        break;
    }
  }

  render() {
    const { isLoggedIn } = this.props;
    return isLoggedIn
      ? this.renderAsLoggedInMode()
      : this.renderAsAnonymousMode();
  }
}

const styles = StyleSheet.create({
  logo: {
    marginVertical: 150,
    width: 80,
    height: 80
  },
  background: {
    width: "100%",
    paddingVertical: 20
  }
});

const mapStateToProps = state => {
  return {
    notificationUnreadCount: state.notification.list.filter(
      notification => !notification.read
    ).length,
    isLoggedIn: state.user.isLoggedIn,
    fullName: state.user.account.fullName,
    phoneNumber: state.user.account.phoneNumber,
    email: state.user.account.email
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logOut: () => dispatch(logOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
