import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import {
  View,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  RefreshControl
} from "react-native";
import {
  loadProductFeedback,
  logOut,
  sendComment,
  loadAnswers,
  loadChildComments
} from "../../api";
import {
  View as NativeBaseView,
  Container,
  Content,
  List,
  ListItem,
  Button,
  Spinner,
  Card,
  CardItem,
  Left,
  Body,
  Thumbnail
} from "native-base";
import { alert } from "../../utils";
import AppText from "../components/AppText";
import AppComment from "../components/AppComment";
import SendComment from "../components/SendComment";

const { height, width } = Dimensions.get("window");

class Answers extends Component {
  constructor(props) {
    super(props);
    const { productId, parentComment, childComments } = this.props;
    this.state = {
      productId,
      status: "LOADED",
      parentComment,
      childComments,
      showDialog: false
    };
  }

  componentDidMount() {
    const { parentComment } = this.state;
    if (parentComment === null) this.loadData();
  }

  loadData() {
    const { productId, selectedCommentId, reload } = this.props;
    if (reload) reload();
    this.setState({ status: "LOADING", showDialog: false });
    loadChildComments(selectedCommentId).then(
      result => {
        const { ok, parentComment, childComments } = result;
        if (ok)
          this.setState({
            status: "LOADED",
            parentComment: parentComment,
            childComments: childComments
          });
        else this.setState({ status: "ERROR" });
      },
      err => this.setState({ status: "ERROR" })
    );
    // setTimeout(
    //   () =>
    //     loadChildComments(selectedCommentId).then(
    //       result => {
    //         const { ok, parentComment, childComments } = result;
    //         if (ok)
    //           this.setState({
    //             status: "LOADED",
    //             parentComment,
    //             childComments
    //           });
    //         else this.setState({ status: "ERROR" });
    //       },
    //       err => this.setState({ status: "ERROR" })
    //     ),
    //   500
    // );
  }

  render() {
    const {
      status,
      parentComment,
      childComments,
      productId,
      showDialog
    } = this.state;
    const { isLoggedIn, userName } = this.props;
    return (
      <Container>
        <Modal
          animationType="slide"
          visible={showDialog}
          onRequestClose={() => {}}
        >
          <View>
            <List>
              <ListItem>
                <Left>
                  <Thumbnail
                    square
                    source={require("../../resources/images/user.png")}
                  />
                  <Body>
                    <AppText>{userName}</AppText>
                  </Body>
                </Left>
              </ListItem>
            </List>
            <View style={{ padding: 10 }}>
              <SendComment
                parentId={parentComment ? parentComment.id : null}
                productId={productId}
                reload={() => this.loadData()}
              />
              <Button
                style={{ marginTop: 10 }}
                warning
                block
                onPress={() => this.setState({ showDialog: false })}
              >
                <AppText>CLOSE</AppText>
              </Button>
            </View>
          </View>
        </Modal>
        {parentComment !== null && <AppComment comment={parentComment} />}
        <Content
          refreshControl={
            <RefreshControl
              refreshing={status === "LOADING"}
              onRefresh={() => this.loadData()}
            />
          }
        >
          <View>
            <View style={{ paddingHorizontal: 20 }}>
              {childComments.map(comment => (
                <AppComment key={"comment-" + comment.id} comment={comment} />
              ))}
              {parentComment !== null &&
                (isLoggedIn ? (
                  <Button
                    primary
                    block
                    style={{ marginVertical: 20 }}
                    onPress={() => this.setState({ showDialog: true })}
                  >
                    <AppText>COMMENT</AppText>
                  </Button>
                ) : (
                  <Button
                    danger
                    block
                    style={{ marginVertical: 20 }}
                    onPress={() =>
                      this.props.navigation.navigate("Account/LogIn")
                    }
                  >
                    <AppText>LOG IN TO COMMENT</AppText>
                  </Button>
                ))}
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { isLoggedIn, account } = state.user;
  const { params } = props.navigation.state;
  const {
    productId,
    selectedCommentId,
    parentComment,
    childComments,
    reload
  } = params;
  return {
    productId,
    selectedCommentId,
    parentComment: parentComment ? parentComment : null,
    childComments: childComments ? childComments : [],
    isLoggedIn,
    reload,
    userName: account.fullName
  };
};
const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Answers);
