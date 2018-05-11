import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { View } from "react-native";
import {
  Container,
  Content,
  Button,
  Form,
  Spinner,
  Item,
  Input,
  Icon
} from "native-base";
import AppText from "./AppText";
import Modal from "react-native-modal";
import { validateEmail } from "../../utils";

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderInput({
    input,
    keyboardType,
    icon,
    placeholder,
    type,
    meta: { touched, error, warning }
  }) {
    let hasError = false;
    if (error !== undefined) {
      hasError = true;
    }
    return (
      <Item error={hasError}>
        <Icon active name={icon} />
        <Input
          {...input}
          placeholder={placeholder}
          style={{ fontSize: 12 }}
          keyboardType={keyboardType}
          last
        />
        {hasError &&
          error !== "required" && (
            <AppText small color="red">
              {error}
            </AppText>
          )}
      </Item>
    );
  }

  render() {
    const {
      error,
      invalid,
      submitting,
      handleSubmit,
      showInfoDialog,
      closeDialog,
      applyInfo
    } = this.props;
    return (
      <Modal isVisible={showInfoDialog}>
        <View
          style={{
            backgroundColor: "white",
            paddingVertical: 10,
            paddingHorizontal: 10
          }}
        >
          <AppText style={{ fontWeight: "bold" }}>BUYER INFORMATION</AppText>
          <Form>
            <Field
              name="fullName"
              keyboardType="default"
              placeholder="Enter your name"
              icon="ios-person-outline"
              component={this.renderInput}
            />
            <Field
              name="email"
              keyboardType="email-address"
              placeholder="Enter your email"
              icon="ios-mail-outline"
              component={this.renderInput}
            />
            <Field
              name="phoneNumber"
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              icon="md-phone-portrait"
              component={this.renderInput}
            />
          </Form>
          <View style={{ marginTop: 10 }}>
            <Button
              disabled={error || invalid}
              success
              block
              style={{ marginBottom: 10 }}
              onPress={handleSubmit(applyInfo)}
            >
              <AppText>CONFIRM</AppText>
            </Button>
            <Button primary block onPress={() => closeDialog()}>
              <AppText>CLOSE</AppText>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

const ReduxForm = reduxForm({
  form: "user_info_form",
  touchOnBlur: false,
  enableReinitialize: true,
  onSubmitFail: () => {},
  validate: values => {
    const errors = {};
    if (!values.fullName) errors.fullName = "required";
    if (!values.email) errors.email = "required";
    else if (!validateEmail(values.email)) errors.email = "Invalid email";
    if (!values.phoneNumber) errors.phoneNumber = "required";
    return errors;
  }
})(UserForm);

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm);
