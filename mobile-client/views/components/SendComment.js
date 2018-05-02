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
  Input,
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

  render() {
    const { submitting } = this.state;
    return (
      <Form>
        <Item>
          <Input
            value={this.state.comment}
            onChangeText={text => this.setState({ comment: text })}
            style={{ fontSize: 12 }}
            placeholder="Type your comment"
            onSubmitEditing={() =>
              this.state.comment !== "" && sendComment.call(this)
            }
          />
          {submitting && <Spinner />}
        </Item>
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
