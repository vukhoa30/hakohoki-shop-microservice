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
  Badge,
  Right,
  Left,
  Card,
  CardItem
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

  getCompliment(rating) {
    switch (rating) {
      case 1:
        return "BAD";
      case 2:
        return "NOT GOOD";
      case 3:
        return "GOOD";
      case 4:
        return "VERY GOOD";
      case 5:
        return "EXCELLENT";
    }
  }

  loadData() {
    this.props.trigger();
  }

  render() {
    const { comment, trigger } = this.props;

    return (
      <Card style={{ flex: 0 }} transparent>
        <CardItem>
          <Left>
            <Thumbnail
              square
              source={require("../../resources/images/user.png")}
            />
            <Body>
              <AppText>{comment.userName}</AppText>
              <AppText note>{formatTime(comment.createdAt)}</AppText>
            </Body>
          </Left>
        </CardItem>
        <CardItem>
          <Body>
            {comment.reviewScore && (
              <View style={{ flexDirection: "row" }}>
                {this.renderStars(comment.reviewScore)}
                <AppText note style={{ marginLeft: 5 }}>
                  {this.getCompliment(comment.reviewScore)}
                </AppText>
              </View>
            )}
            <AppText>{comment.content}</AppText>
            {comment.childs && (
              <Grid>
                <Col />
                <Col
                  style={{ justifyContent: "flex-end", flexDirection: "row" }}
                >
                  <Icon
                    name="md-chatboxes"
                    style={{ marginRight: 5, color: "blue" }}
                    onPress={() => trigger && trigger()}
                  />
                  <AppText color="blue">{comment.childs.length}</AppText>
                </Col>
              </Grid>
            )}
          </Body>
        </CardItem>
      </Card>
      // <Grid style={{ marginVertical: 5 }}>
      //   <Col style={{ width: width / 5 }}>
      //     <Body>{this.getImage(comment.userRole)}</Body>
      //   </Col>
      //   <Col>
      //     <Body>
      //       {comment.userRole !== "employee" && !comment.reviewScore ? (
      //         <Grid>
      //           <Col>
      //             <AppText style={{ fontWeight: "bold" }}>
      //               {comment.userName}
      //             </AppText>
      //           </Col>
      //           <Col style={{ flex: 1, alignItems: "flex-end" }}>
      //             {!comment.reviewScore &&
      //               comment.userRole &&
      //               comment.userRole !== "customer" && (
      //                 <Badge
      //                   danger={comment.userRole === "manager"}
      //                   primary={comment.userRole === "receptionist"}
      //                   success={comment.userRole === "employee"}
      //                 >
      //                   <AppText small>{comment.userRole}</AppText>
      //                 </Badge>
      //               )}
      //           </Col>
      //         </Grid>
      //       ) : (
      //         <AppText style={{ fontWeight: "bold" }}>
      //           {comment.userName}
      //         </AppText>
      //       )}
      //       {comment.reviewScore && (
      //         <View style={{ flexDirection: "row" }}>
      //           {this.renderStars(comment.reviewScore)}
      //         </View>
      //       )}
      //       <AppText note>{comment.content}</AppText>
      //     </Body>
      //     <Left>
      //       <AppText note small style={{ marginVertical: 5, fontSize: 10 }}>
      //         {formatTime(comment.createdAt)}
      //       </AppText>
      //     </Left>
      //     {comment.childs && (
      //       <Right>
      //         <View style={{ flexDirection: "row" }}>
      //           <Icon name="md-chatboxes" />
      //           <AppText small note>
      //             {comment.childs.length}
      //           </AppText>
      //         </View>
      //       </Right>
      //     )}
      //   </Col>
      // </Grid>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AppComment);
