import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Keyboard, Dimensions } from "react-native";
import { sendComment, logOut, loadProductFeedback } from "../../api";
import {
  Container,
  Content,
  Button,
  Form,
  Spinner,
  Item,
  Textarea,
  Grid,
  Col
} from "native-base";
import AppText from "./AppText";

const { width } = Dimensions.get("window");

class SendComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      comment: ""
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.submitting && !prevProps.submitting) Keyboard.dismiss();
  }

  render() {
    const { submitting, invalid } = this.state;
    return (
      <Form>
        <Textarea
          value={this.state.comment}
          onChangeText={text => this.setState({ comment: text })}
          style={{ fontSize: 12 }}
          placeholder="Enter your comment"
          rowSpan={5}
          bordered
        />
        <Button
          primary
          style={{ marginTop: 10 }}
          disabled={submitting || invalid}
          block
          onPress={() => this.state.comment !== "" && sendComment.call(this)}
        >
          {submitting ? <Spinner /> : <AppText>SEND</AppText>}
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  token: state.user.token
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut()),
  loadProductFeedback: productId => dispatch(loadProductFeedback(productId))
});

export default connect(mapStateToProps, mapDispatchToProps)(SendComment);
