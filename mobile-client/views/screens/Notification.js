import React, { Component } from "react";
import { connect } from "react-redux";
import { View, TouchableOpacity, RefreshControl } from "react-native";
import {
  selectProduct,
  makeNotificationAsRead,
  loadNotifications,
  logOut,
  viewAnswers,
  connectToServer
} from "../../api";
import {
  Spinner,
  Container,
  Content,
  Button,
  List,
  ListItem,
  Left,
  Icon,
  Body
} from "native-base";
import AppText from "../components/AppText";
import { formatTime } from "../../utils";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const { token, loadNotifications, status, isLoggedIn } = this.props;
    if (isLoggedIn && status === "INIT") loadNotifications(token);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn && !this.props.isLoggedIn) {
      const { token, loadNotifications, status } = nextProps;
      if (status !== "LOADED") loadNotifications(token);
    }
  }

  renderNotification(notification) {
    const {
      type,
      productId,
      productName,
      amount,
      promotionId,
      promotionName,
      commentId,
      billId
    } = notification;
    const {
      selectProduct,
      makeNotificationAsRead,
      viewAnswers,
      token,
      navigation
    } = this.props;

    let title = "Unknown notification",
      content = "",
      callback = () => {};

    switch (type) {
      case "almostOutOfStock":
        title = "Product unavailable soon";
        content = `The quantity of product ${productName} is only ${amount}`;
        callback = () => selectProduct(productId);
        break;
      case "goodsReceipt":
        title = "Product available";
        content = `The product "${productName}" is available now`;
        callback = () => selectProduct(productId);
        break;
      case "commentReplied":
        title = "Comment replied!";
        content = `Your comment about product "${productName}" has been replied`;
        callback = () => viewAnswers(productId, commentId);
        break;
      case "promotionCreated":
        title = "New promotion coming up!";
        content = `${promotionName}`;
        callback = () =>
          navigation.navigate("PromotionDetail", { promotionId });
        break;
      case "productBought":
        title = "New order has been made!";
        content = `Your order ID is ${billId}. Click to view detail`;
        callback = () =>
          navigation.navigate("OrderDetail", { orderId: billId });
        break;
    }

    return (
      <TouchableOpacity
        onPress={() => {
          callback();
          if (!notification.read)
            makeNotificationAsRead(token, notification.id);
        }}
      >
        <Body>
          <View style={{ flexDirection: "row" }}>
            <Icon name="ios-notifications" style={{ color: "orange" }} />
            <AppText style={notification.read ? {} : { fontWeight: "bold" }}>
              {title}
            </AppText>
          </View>
          <AppText style={notification.read ? {} : { fontWeight: "bold" }} note>
            {content}
          </AppText>
          <AppText
            style={notification.read ? {} : { fontWeight: "bold" }}
            small
            note
          >
            {formatTime(notification.createdAt)}
          </AppText>
        </Body>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      connectionStatus,
      status,
      list,
      loadNotifications,
      token,
      makeNotificationAsRead,
      isLoggedIn,
      logOut,
      accountId,
      connectToServer
    } = this.props;

    return !isLoggedIn ? (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <AppText onPress={() => logOut()} note>
          Tap here to log in
        </AppText>
      </View>
    ) : (
      <Container>
        {connectionStatus === "CONNECTING" && (
          <AppText color="green" center small>
            Attemping to connect to server ...
          </AppText>
        )}
        {connectionStatus === "NOT_CONNECTED" && (
          <TouchableOpacity
            style={{
              width: "100%",
              backgroundColor: "orange",
              paddingVertical: 10
            }}
            onPress={() => connectToServer(accountId)}
          >
            <AppText color="red" center small>
              Could not connect to server! Tap to reconnect
            </AppText>
          </TouchableOpacity>
        )}
        {status === "LOADING" ? (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Spinner />
          </View>
        ) : (
          status === "LOADING_FAILED" && (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <AppText color="red" small style={{ marginBottom: 10 }}>
                Could not load data
              </AppText>
              <Button
                small
                warning
                style={{ alignSelf: "center" }}
                onPress={() => loadNotifications(token)}
              >
                <AppText>Reload</AppText>
              </Button>
            </View>
          )
        )}
        <Content>
          <List
            refreshControl={
              <RefreshControl
                refreshing={status === "LOADING"}
                onRefresh={() => loadNotifications(token)}
              />
            }
            dataArray={list}
            renderRow={notification => (
              <ListItem key={"notification-" + notification.id}>
                {this.renderNotification(notification)}
              </ListItem>
            )}
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { isLoggedIn, token, account } = state.user;
  const { status, list, connectionStatus } = state.notification;

  return {
    accountId: account !== null ? account.accountId : "",
    connectionStatus,
    isLoggedIn,
    token,
    status,
    list
  };
};

const mapDispatchToProps = dispatch => ({
  selectProduct: productId => dispatch(selectProduct(productId)),
  makeNotificationAsRead: (token, notificationId) =>
    dispatch(makeNotificationAsRead(token, notificationId)),
  loadNotifications: token => dispatch(loadNotifications(token)),
  logOut: () => dispatch(logOut()),
  viewAnswers: (productId, commentId) =>
    dispatch(viewAnswers(productId, commentId)),
  connectToServer: accountId => dispatch(connectToServer(accountId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
