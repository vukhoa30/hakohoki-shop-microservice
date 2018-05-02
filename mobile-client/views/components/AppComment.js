import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Dimensions, Image } from "react-native";
import {
  Container,
  Content,
  Button,
  Grid,
  Col,
  Body,
  Icon,
  Thumbnail,
  Badge
} from "native-base";
import AppText from "./AppText";
import { formatTime } from "../../utils";

const { width, height } = Dimensions.get("window");

class AppComment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderStars(reviewScore, large = false) {
    const stars = [];
    let i = 0;
    for (; i < reviewScore; i++)
      stars.push(
        <Icon
          key={"star-" + i}
          name="ios-star"
          style={{
            color: "orange",
            fontSize: large ? 15 : 10,
            fontWeight: "bold",
            marginVertical: 5
          }}
        />
      );
    for (; i < 5; i++)
      stars.push(
        <Icon
          key={"star-" + i}
          name="ios-star-outline"
          style={{
            color: "orange",
            fontSize: large ? 15 : 10,
            fontWeight: "bold",
            marginVertical: 5
          }}
        />
      );
    return stars;
  }

  getImage(userRole) {
    let uri = "../../resources/images/user.png";
    if (userRole === "employee")
      return (
        <Image
          source={require("../../resources/images/employee.png")}
          style={{ width: "100%", height: 70, resizeMode: "stretch" }}
        />
      );
    else if (userRole === "receptionist")
      return (
        <Image
          source={require("../../resources/images/receptionist.png")}
          style={{ width: "100%", height: 70, resizeMode: "stretch" }}
        />
      );
    else if (userRole === "manager")
      return (
        <Image
          source={require("../../resources/images/manager.png")}
          style={{ width: "100%", height: 70, resizeMode: "stretch" }}
        />
      );
    return (
      <Image
        source={require("../../resources/images/user.png")}
        style={{ width: "100%", height: 70, resizeMode: "stretch" }}
      />
    );
  }

  render() {
    const { comment } = this.props;

    return (
      <Grid style={{ marginVertical: 5 }}>
        <Col style={{ width: width / 4 }}>
          <Body>{this.getImage(comment.userRole)}</Body>
        </Col>
        <Col>
          <Body>
            <AppText style={{ fontWeight: "bold" }}>{comment.userName}</AppText>
            {comment.userRole !== "customer" && (
              <AppText
                small
                color={
                  comment.userRole === "manager"
                    ? "red"
                    : comment.userRole === "employee"
                      ? "orange"
                      : "yellow"
                }
              >
                {comment.userRole}
              </AppText>
            )}
            {comment.reviewScore && (
              <View style={{ flexDirection: "row" }}>
                {this.renderStars(comment.reviewScore)}
              </View>
            )}
            <AppText note>{comment.content}</AppText>
            <AppText note small style={{ marginVertical: 5, fontSize: 10 }}>
              {formatTime(comment.createdAt)}
            </AppText>
          </Body>
        </Col>
      </Grid>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AppComment);
