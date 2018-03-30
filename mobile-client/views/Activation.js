import React, { Component } from 'react';
import AppContainer from './components/AppContainer'
import AppText from './components/AppText'
import AppButton from './components/AppButton'
import { View, Image, ImageBackground, Alert } from 'react-native'
import { Container, Form, Item, Icon, Input, Content, Grid, Row } from 'native-base'
import { connect } from "react-redux";
import { Field, reduxForm, handleSubmit } from 'redux-form';
import { activate, saveToBuffer } from "../presenters";

class Activation extends Component {

    static navigationOptions = {
        title: 'Activation'
    }
    state = {}
    componentDidUpdate() {

        const { submitSucceeded, submitFailed, error, clearSubmitErrors, saveToBuffer, navigation } = this.props

        if (submitSucceeded) {

            Alert.alert('Success', 'Account activated! You can log in right now!')
            saveToBuffer({ email: navigation.state.params.email })

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
                <Icon active name="code" />
                <Input {...input} placeholder={placeholder} style={{ fontSize: 12 }} last />
            </Item>)
    }
    render() {
        const { navigation, handleSubmit, submitting, invalid, error } = this.props

        return (
            <AppContainer>
                <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
                    <Image style={{ alignSelf: 'center', marginVertical: 50 }} source={{ uri: 'https://cdn4.iconfinder.com/data/icons/meBaze-Freebies/512/unlock.png', width: 100, height: 100 }} />
                    <AppText color="gray" >{navigation.state.params.email}</AppText>
                    <Field name="activationCode" placeholder="ACTIVATION CODE" component={this.renderInput} />
                </View>
                <AppButton style={{ marginVertical: 20, marginHorizontal: 20 }} block bordered onPress={handleSubmit(activate.bind(this))} disabled={(!error && invalid) || submitting} onProcess={submitting}>
                    ACTIVATE
                </AppButton>
            </AppContainer>
        );
    }
}

const mapStateToProps = state => ({



})

const mapDispatchToProps = dispatch => ({

    saveToBuffer: data => dispatch(saveToBuffer(data))

})

const ActivationForm = reduxForm({
    form: 'activation_form',
    touchOnBlur: false,
    enableReinitialize: true,
    validate: values => {
        const errors = {}

        if (!values.activationCode) {
            errors.activationCode = 'Activation code is required.'
        }

        return errors
    },
    onSubmitFail: () => { }

})(Activation)

export default connect(mapStateToProps, mapDispatchToProps)(ActivationForm);