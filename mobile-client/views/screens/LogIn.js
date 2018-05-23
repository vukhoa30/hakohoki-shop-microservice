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
  Col,
  Spinner
} from "native-base";
import { connect } from "react-redux";
import {
  Field,
  reduxForm,
  SubmissionError,
  formValueSelector
} from "redux-form";
import { validateEmail, alert } from "../../utils";
import { authenticate, logIn } from "../../api";

class LogIn extends Component {
  static navigationOptions = {
    title: "Log in"
  };

  state = {};

  componentDidUpdate() {

      const { submitSucceeded, submitFailed, error, clearSubmitErrors } = this.props

      if (submitSucceeded) {

      } else if (submitFailed && error) {

          alert('error', error)
          clearSubmitErrors()
      }

  }

  renderInput({ input, placeholder, type, meta: { touched, error, warning } }) {
    let hasError = false;
    if (error !== undefined) {
      hasError = true;
    }
    return (
      <Item error={hasError}>
        <Icon
          active
          name={input.name === "emailOrPhoneNo" ? "person" : "unlock"}
        />
        <Input
          {...input}
          secureTextEntry={type === "password"}
          placeholder={placeholder}
          style={{ fontSize: 12 }}
          last
        />
      </Item>
    );
  }

  render() {
    const {
      navigation,
      logIn,
      handleSubmit,
      submitting,
      invalid,
      error
    } = this.props;

    return (
      <Container>
        <Content>
          <View style={{ width: "100%", alignItems: "center" }}>
            <AppText color="red">{error}</AppText>
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Field
              name="emailOrPhoneNo"
              placeholder="EMAIL OR PHONE NUMBER"
              component={this.renderInput}
            />
            <Field
              name="password"
              placeholder="PASSWORD"
              type="password"
              component={this.renderInput}
            />
          </View>
          <AppButton
            style={{ marginVertical: 20, marginHorizontal: 20 }}
            block
            bordered
            success
            onPress={handleSubmit(authenticate.bind(this))}
            disabled={(!error && invalid) || submitting}
            processing={submitting}
          >
            LOG IN
          </AppButton>
          {/* <AppText center>--------- or log in through ----------</AppText>
                    <View style={{ alignSelf: 'center', flexDirection: 'row', flex: 1, marginTop: 20 }}>
                        <AppButton icon="logo-facebook" style={{ margin: 5 }}>Facebook</AppButton>
                        <AppButton icon="logo-google" style={{ backgroundColor: 'red', margin: 5 }}>Google</AppButton>
                    </View> */}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  initialValues: {
    email: state.buffer.data ? state.buffer.data.email : null
  }
});

const mapDispatchToProps = dispatch => ({
  logIn: (token, email, fullName) => dispatch(logIn(token, email, fullName))
});

const LogInForm = reduxForm({
  form: "login_form",
  touchOnBlur: false,
  enableReinitialize: true,
  validate: values => {
    const errors = {};

    if (!values.emailOrPhoneNo) {
      errors.emailOrPhoneNo = "required";
    }
    if (!values.password) {
      errors.password = "Password is required.";
    }

    return errors;
  },
  onSubmitFail: () => {}
})(LogIn);

export default connect(mapStateToProps, mapDispatchToProps)(LogInForm);
