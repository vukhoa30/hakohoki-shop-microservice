import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "native-base";
import AppText from "./AppText";

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
    color: "red"
  }
});

class TabBarIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      routeName,
      focused,
      notificationUnreadCount,
      isLoggedIn
    } = this.props;
    let icon = null;
    switch (routeName) {
      case "Home":
        icon = (
          <Icon
            name={focused ? "ios-home" : "ios-home-outline"}
            style={styles.icon}
          />
        );
        break;
      case "Profile":
        icon = (
          <Icon
            name={focused ? "ios-person" : "ios-person-outline"}
            style={styles.icon}
          />
        );
        break;
      case "List":
        icon = (
          <Icon
            name={focused ? "ios-list-box" : "ios-list-box-outline"}
            style={styles.icon}
          />
        );
        break;
      case "Notification":
        icon = (
          <Icon
            name={focused ? "ios-notifications" : "ios-notifications-outline"}
            style={styles.icon}
          />
        );
        break;
      case "Setting":
        icon = (
          <Icon
            name={focused ? "ios-build" : "ios-build-outline"}
            style={styles.icon}
          />
        );
        break;
      default:
        icon = (
          <Icon name="ios-information-circle-outline" style={styles.icon} />
        );
    }

    return (
      <View>
        {icon}
        {isLoggedIn &&
          routeName === "Notification" &&
          notificationUnreadCount !== 0 && (
            <View style={{ position: "absolute", right: -7, top: -7 }}>
              <Text style={{ fontSize: 10, color: "red", fontWeight: "bold" }}>
                {notificationUnreadCount}
              </Text>
            </View>
          )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  notificationUnreadCount: state.notification.list.filter(
    notification => !notification.read
  ).length,
  isLoggedIn: state.user.isLoggedIn
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TabBarIcon);
