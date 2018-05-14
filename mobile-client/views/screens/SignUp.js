import React, { Component } from "react";
import AppContainer from "../components/AppContainer";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import { View, Image, ImageBackground } from "react-native";
import {
  Container,
  Form,
  Item,
  Icon,
  Input,
  Content,
  Grid,
  Row,
  Col
} from "native-base";
import { connect } from "react-redux";
import { Field, reduxForm, handleSubmit } from "redux-form";
import { validateEmail, alert } from "../../utils";
import { enroll } from "../../api";

class SignUp extends Component {
  static navigationOptions = {
    title: "Sign up"
  };

  state = {};
  componentDidUpdate() {
    const {
      submitSucceeded,
      submitFailed,
      error,
      clearSubmitErrors,
      navigation
    } = this.props;

    if (submitSucceeded) {
      alert(
        "success",
        "Account created! Activation code was sent to your email"
      );
    } else if (submitFailed && error) {
     // alert("error", error);
      clearSubmitErrors();
    }
  }
  renderInput({ input, placeholder, type, meta: { touched, error, warning } }) {
    let hasError = false;
    if (error !== undefined) {
      hasError = true;
    }
    let iconName = "person";
    let keyboardType = "default";

    switch (input.name) {
      case "phoneNumber":
        iconName = "md-phone-portrait";
        keyboardType = "phone-pad";
        break;
      case "email":
        iconName = "mail";
        keyboardType = "email-address";
        break;
      case "password":
        iconName = "key";
        break;
      case "retypePassword":
        iconName = "ios-key-outline";
        break;
    }

    return (
      <Item error={hasError}>
        <Icon active name={iconName} />
        <Input
          {...input}
          keyboardType={keyboardType}
          secureTextEntry={type === "password"}
          keyboardType={keyboardType}
          placeholder={placeholder}
          style={{ fontSize: 12 }}
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
    const { navigation, handleSubmit, submitting, invalid, error } = this.props;

    return (
      <Container>
        <Content>
          <View style={{ width: "100%", alignItems: "center" }}>
            <AppText color="red">{error}</AppText>
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Field
              name="fullName"
              placeholder="FULL NAME"
              component={this.renderInput}
            />
            <Field
              name="phoneNumber"
              placeholder="PHONE NUMBER"
              component={this.renderInput}
            />
            <Field
              name="email"
              placeholder="EMAIL"
              component={this.renderInput}
            />
            <Field
              name="password"
              placeholder="PASSWORD"
              type="password"
              component={this.renderInput}
            />
            <Field
              name="retypePassword"
              placeholder="RETYPE PASSWORD"
              type="password"
              component={this.renderInput}
            />
          </View>
          <AppButton
            style={{ marginVertical: 20, marginHorizontal: 20 }}
            block
            bordered
            warning
            onPress={handleSubmit(enroll.bind(this))}
            disabled={(!error && invalid) || submitting}
            processing={submitting}
          >
            ENROLL
          </AppButton>
          <AppText center>--------- or enroll through ----------</AppText>
          <View
            style={{
              alignSelf: "center",
              flexDirection: "row",
              flex: 1,
              marginTop: 20
            }}
          >
            <AppButton icon="logo-facebook" style={{ margin: 5 }}>
              Facebook
            </AppButton>
            <AppButton
              icon="logo-google"
              style={{ backgroundColor: "red", margin: 5 }}
            >
              Google
            </AppButton>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

const SignUpForm = reduxForm({
  form: "signup_form",
  touchOnBlur: false,
  enableReinitialize: true,
  validate: values => {
    const errors = {};

    if (!values.fullName) {
      errors.fullName = "required";
    }

    if (!values.phoneNumber) {
      errors.phoneNumber = "required";
    }

    if (!values.email) {
      errors.email = "required";
    } else if (!validateEmail(values.email)) {
      errors.email = "Invalid email";
    }

    if (!values.password) {
      errors.password = "required";
    }
    if (!values.retypePassword) {
      errors.retypePassword = "required";
    } else if (values.password !== values.retypePassword) {
      errors.retypePassword = "Not matched";
    }

    return errors;
  },
  onSubmitFail: () => {}
})(SignUp);

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);
