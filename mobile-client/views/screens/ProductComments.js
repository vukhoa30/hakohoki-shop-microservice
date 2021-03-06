import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView
} from "react-native";
import { loadProductFeedback, logOut } from "../../api";
import {
  Container,
  Content,
  Spinner,
  Button,
  Card,
  CardItem,
  Icon,
  Grid,
  Col,
  Body,
  List,
  ListItem,
  Left,
  Right,
  Thumbnail,
  FooterTab,
  Footer,
  Header,
  Title,
  Form,
  Item,
  Label,
  Input
} from "native-base";
import ProgressBar from "react-native-progress/Bar";
import AppText from "../components/AppText";
import AppProductFooter from "../components/AppProductFooter";
import { alert, confirm } from "../../utils";
import SendComment from "../components/SendComment";
import AppComment from "../components/AppComment";

const { height } = Dimensions.get("window");

class ProductComments extends Component {
  static navigationOptions = {
    title: "Comments"
  };

  constructor(props) {
    super(props);
    this.state = {};
    const { productId, loadProductFeedback, status } = this.props;
    if (status !== "LOADED") loadProductFeedback(productId);
  }

  render() {
    const {
      logOut,
      isLoggedIn,
      loadProductFeedback,
      status,
      productId,
      questions,
      navigation
    } = this.props;

    switch (status) {
      case "LOADING":
        return (
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
        );
      case "LOADING_FAILED":
        return (
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
              onPress={() => loadProductFeedback(productId)}
            >
              <AppText>Reload</AppText>
            </Button>
          </View>
        );
    }

    return (
      <Container>
        <List>
          <ListItem itemHeader first icon>
            <Body>
              <AppText style={{ fontWeight: "bold" }}>
                COMMENTS ({questions.length})
              </AppText>
            </Body>
          </ListItem>
        </List>
        {isLoggedIn ? (
          <SendComment productId={productId} />
        ) : (
          <Button
            danger
            style={{ alignSelf: "center", marginVertical: 10 }}
            onPress={() => logOut()}
          >
            <AppText>Log in to comment</AppText>
          </Button>
        )}
        <Content style={{ flex: 2 }}>
          {questions.length > 0 ? (
            <List
              dataArray={questions.reverse()}
              renderRow={comment => (
                <ListItem
                  avatar
                  key={"comment-" + comment.id}
                  onPress={() =>
                    navigation.navigate("Answers", {
                      parentId: comment.id,
                      productId
                    })
                  }
                >
                  <AppComment comment={comment} />
                </ListItem>
              )}
            />
          ) : (
            <AppText style={{ marginVertical: 10 }} note center>
              No comments for this product
            </AppText>
          )}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { productId, status, questions } = state.feedback;
  const { isLoggedIn } = state.user;

  return {
    isLoggedIn,
    productId,
    status,
    questions
  };
};

const mapDispatchToProps = dispatch => ({
  loadProductFeedback: productId => dispatch(loadProductFeedback(productId)),
  logOut: () => dispatch(logOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductComments);
