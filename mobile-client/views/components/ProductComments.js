import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import {
  Container,
  Content,
  Button,
  List,
  ListItem,
  Card,
  Body,
  Spinner,
  Right
} from "native-base";
import { navigate } from "../../api";
import AppText from "./AppText";
import AppComment from "./AppComment";
import SendComment from "./SendComment";

class ProductComments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxSize: 5,
      questions: []
    };
  }
  componentDidMount() {
    this.cutList();
  }

  cutList() {
    const { comments } = this.props;
    this.setState({
      questions: comments.slice(0, this.state.maxSize)
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (!this.props.loading && prevProps.loading) ||
      this.state.maxSize !== prevState.maxSize
    )
      this.cutList();
  }

  render() {
    const {
      productId,
      comments,
      navigate,
      isLoggedIn,
      loading,
      reload,
      err
    } = this.props;
    const { questions, maxSize } = this.state;
    return (
      <Card>
        <List style={{ marginBottom: 10 }}>
          <ListItem itemHeader first icon>
            <Body>
              <AppText style={{ fontWeight: "bold" }}>
                WRITE YOUR COMMENT
              </AppText>
            </Body>
          </ListItem>
        </List>
        {isLoggedIn ? (
          <View style={{ padding: 10, paddingTop: 0 }}>
            <SendComment productId={productId} reload={reload} />
          </View>
        ) : (
          <Button
            danger
            style={{ alignSelf: "center", marginVertical: 20 }}
            onPress={() => navigate("Account/LogIn")}
          >
            <AppText>LOG IN TO COMMENT</AppText>
          </Button>
        )}
        <List>
          <ListItem itemHeader first icon>
            <Body>
              <AppText style={{ fontWeight: "bold" }}>
                COMMENTS ({comments.length})
              </AppText>
            </Body>
            <Right>{loading && <Spinner size="small" />}</Right>
          </ListItem>
        </List>
        {err ? (
          <AppText
            style={{ alignSelf: "center", color: "red" }}
            onPress={() => reload()}
          >
            ENCOUNTER SOME ERRORS! CLICK TO TRY AGAIN
          </AppText>
        ) : questions.length > 0 ? (
          <View style={{ padding: 10 }}>
            {questions.map(comment => (
              <AppComment
                key={"comment-" + comment.id}
                comment={comment}
                trigger={() => {
                  navigate("Answers", {
                    productId,
                    selectedCommentId: comment.id,
                    parentComment: comment,
                    childComments: comment.childs,
                    reload
                  });
                }}
              />
            ))}
            {/* <List
              dataArray={questions}
              renderRow={comment => (
                <ListItem
                  avatar
                  key={"comment-" + comment.id}
                  onPress={() =>
                    navigate("Answers", {
                      productId,
                      selectedCommentId: comment.id,
                      parentComment: comment,
                      childComments: comment.childs
                    })
                  }
                >
                  <AppComment comment={comment} />
                </ListItem>
              )}
            /> */}
            {maxSize < comments.length && (
              <AppText
                style={{ marginVertical: 20, alignSelf: "center" }}
                onPress={() =>
                  this.setState({ maxSize: this.state.maxSize + 5 })
                }
              >
                LOAD MORE ...
              </AppText>
            )}
          </View>
        ) : (
          <AppText style={{ marginVertical: 10 }} note center>
            No comments for this product
          </AppText>
        )}
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn
});

const mapDispatchToProps = dispatch => ({
  navigate: (path, params) => dispatch(navigate(path, params))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductComments);
