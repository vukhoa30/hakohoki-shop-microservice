import React, { Component } from 'react';
import AppContainer from './components/AppContainer'
import AppText from './components/AppText'
import AppButton from './components/AppButton'
import { View, Image, ImageBackground, Alert } from 'react-native'
import { Container, Form, Item, Icon, Input, Content, Grid, Row, Col, Spinner } from 'native-base'
import { connect } from "react-redux";
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form';
import { validateEmail } from '../utils'
import { authenticate } from "../presenters";

class LogIn extends Component {

    static navigationOptions = {

        title: 'Log in'

    }

    state = {}

    componentDidUpdate() {

        const { submitSucceeded, submitFailed, error, clearSubmitErrors } = this.props

        if (submitSucceeded) {


        } else if (submitFailed && error) {

            Alert.alert('Error', error)
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
                <Icon active name={input.name === "email" ? "person" : "unlock"} />
                <Input {...input} secureTextEntry={type === 'password'} placeholder={placeholder} style={{ fontSize: 12 }} last />
            </Item>)
    }

    render() {
        const { navigation, logIn, handleSubmit, submitting, invalid, error } = this.props

        return (
            <AppContainer>
                <View style={{ marginHorizontal: 10 }}>
                    <Field name="email" placeholder="EMAIL" component={this.renderInput} />
                    <Field name="password" placeholder="MẬT KHẨU" type="password" component={this.renderInput} />
                </View>
                <AppButton style={{ marginVertical: 20, marginHorizontal: 20 }} block bordered success onPress={handleSubmit(authenticate.bind(this))} disabled={(!error && invalid) || submitting} onProcess={submitting}>
                    LOG IN
                            </AppButton>
                <AppText center>--------- or log in through ----------</AppText>
                <View style={{ alignSelf: 'center', flexDirection: 'row', flex: 1, marginTop: 20 }}>
                    <AppButton icon="logo-facebook" style={{ margin: 5 }}>Facebook</AppButton>
                    <AppButton icon="logo-google" style={{ backgroundColor: 'red', margin: 5 }}>Google</AppButton>
                </View>
            </AppContainer>
        );
    }
}

const mapStateToProps = state => ({

    initialValues: {
        email: state.buffer.data ? state.buffer.data.email : null
    }

})

const mapDispatchToProps = dispatch => ({



})

const LogInForm = reduxForm({
    form: 'login_form',
    touchOnBlur: false,
    enableReinitialize: true,
    validate: values => {
        const errors = {}

        if (!values.email) {
            errors.email = 'Email is required'
        } else if (!validateEmail(values.email)) {
            errors.email = 'Invalid email'
        }

        if (!values.password) {
            errors.password = 'Password is required.'
        }

        return errors
    },
    onSubmitFail: () => { },

})(LogIn)

export default connect(mapStateToProps, mapDispatchToProps)(LogInForm);