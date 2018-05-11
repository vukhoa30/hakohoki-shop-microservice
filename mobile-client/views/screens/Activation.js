import React, { Component } from 'react';
import AppContainer from '../components/AppContainer'
import AppText from '../components/AppText'
import AppButton from '../components/AppButton'
import { View, Image, ImageBackground } from 'react-native'
import { Content, Form, Item, Icon, Input, Grid, Row, Container } from 'native-base'
import { connect } from "react-redux";
import { Field, reduxForm, handleSubmit } from 'redux-form';
import { activate, saveToBuffer } from "../../api";
import { alert } from "../../utils";

class Activation extends Component {

    state = {}
    componentDidUpdate() {

        const { submitSucceeded, submitFailed, error, clearSubmitErrors, saveToBuffer, navigation } = this.props

        if (submitSucceeded) {

            alert('success', 'Account activated! You can log in right now!')
            saveToBuffer({ email: navigation.state.params.email })

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
                <Icon active name="code" />
                <Input {...input} placeholder={placeholder} style={{ fontSize: 12 }} last />
            </Item>)
    }
    render() {
        const { navigation, handleSubmit, submitting, invalid, error } = this.props

        return (
            <Container>
                <Content>
                    <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
                        <Image style={{ alignSelf: 'center', marginVertical: 50 }} source={{ uri: 'https://cdn4.iconfinder.com/data/icons/meBaze-Freebies/512/unlock.png', width: 100, height: 100 }} />
                        <Field name="activationCode" placeholder="ACTIVATION CODE" component={this.renderInput} />
                    </View>
                    <AppButton style={{ marginVertical: 20, marginHorizontal: 20 }} block bordered onPress={handleSubmit(activate.bind(this))} disabled={(!error && invalid) || submitting} processing={submitting}>
                        ACTIVATE
                </AppButton>
                </Content>
            </Container>
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