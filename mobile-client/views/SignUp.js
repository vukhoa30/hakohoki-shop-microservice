import React, { Component } from 'react';
import AppContainer from './components/AppContainer'
import AppText from './components/AppText'
import AppButton from './components/AppButton'
import { View, Image, ImageBackground, Alert } from 'react-native'
import { Container, Form, Item, Icon, Input, Content, Grid, Row, Col } from 'native-base'
import { connect } from "react-redux";
import { Field, reduxForm, handleSubmit } from 'redux-form';
import { validateEmail } from '../utils'
import { enroll } from "../presenters";

class SignUp extends Component {

    static navigationOptions = {

        title: 'Sign up'

    }

    state = {}
    componentDidUpdate() {

        const { submitSucceeded, submitFailed, error, clearSubmitErrors, navigation } = this.props

        if (submitSucceeded) {

            Alert.alert('Success', 'Account created! Activation code was sent to your email')

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
        let iconName = 'person'

        switch (input.name) {
            case 'email':
                iconName = 'mail'
                break
            case 'password':
                iconName = 'key'
                break
            case 'retypePassword':
                iconName = 'ios-key-outline'
                break
        }

        return (
            <Item error={hasError}>
                <Icon active name={iconName} />
                <Input {...input} secureTextEntry={type === 'password'} placeholder={placeholder} style={{ fontSize: 12 }} last/>
            </Item>)
    }
    render() {
        const { navigation, handleSubmit, submitting, invalid, error } = this.props

        return (
            <AppContainer>
                <View style={{ marginHorizontal: 10 }}>
                    <Field name="fullName" placeholder="FULL NAME" component={this.renderInput} />
                    <Field name="email" placeholder="EMAIL" component={this.renderInput} />
                    <Field name="password" placeholder="PASSWORD" type="password" component={this.renderInput} />
                    <Field name="retypePassword" placeholder="RETYPE PASSWORD" type="password" component={this.renderInput} />
                </View>
                <AppButton style={{ marginVertical: 20, marginHorizontal: 20 }} block bordered warning onPress={handleSubmit(enroll.bind(this))} disabled={(!error && invalid) || submitting} onProcess={submitting}>
                    ENROLL
                            </AppButton>
                <AppText center>--------- or enroll through ----------</AppText>
                <View style={{ alignSelf: 'center', flexDirection: 'row', flex: 1, marginTop: 20 }}>
                    <AppButton icon="logo-facebook" style={{ margin: 5 }}>Facebook</AppButton>
                    <AppButton icon="logo-google" style={{ backgroundColor: 'red', margin: 5 }}>Google</AppButton>
                </View>
            </AppContainer>
        );
    }
}

const mapStateToProps = state => ({



})

const mapDispatchToProps = dispatch => ({



})

const SignUpForm = reduxForm({
    form: 'signup_form',
    touchOnBlur: false,
    enableReinitialize: true,
    validate: values => {
        const errors = {}

        if (!values.fullName) {
            errors.fullName = 'Full name is required.'
        }
        if (!values.email) {
            errors.email = 'Email is required'
        } else if (!validateEmail(values.email)) {
            errors.email = 'Invalid email'
        }

        if (!values.password) {
            errors.password = 'Password is required.'
        }
        if (!values.retypePassword) {
            errors.retypePassword = 'You need to retype your password'
        } else if (values.password !== values.retypePassword) {
            errors.retypePassword = 'You need to retype your password correctly'
        }

        return errors
    },
    onSubmitFail: () => { }

})(SignUp)

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm);