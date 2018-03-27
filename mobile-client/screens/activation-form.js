import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Thumbnail, Icon, Left, Card, CardItem, Spinner } from 'native-base';
import { StyleSheet, Alert } from 'react-native'
import { connect } from 'react-redux'
import { request } from '../utils'
import appStyles from '../styles'


class ActivationForm extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => (
        {
            ...navigationOptions,
            title: 'Kích hoạt tài khoản',
            headerLeft: (
                <Icon name="ios-close" style={{ color: 'white', marginLeft: 10 }} onPress={() => navigation.goBack()} />
            ),
        })

    constructor(props) {
        super(props);
        this.renderInput = this.renderInput.bind(this)
    }

    componentDidUpdate() {
        if (this.props.submitSucceeded) {
            this.props.reset()
            Alert.alert('Thành công', 'Kích hoạt thành công! Tài khoản có thể đăng nhập ngay bây giờ')
            this.props.navigation.navigate('SignIn')
        } else if (this.props.submitFailed && this.props.error) {
            Alert.alert('Lỗi', this.props.error)
            this.props.clearSubmitErrors()
        }
    }

    renderInput({ input, placeholder, disabled, type, meta: { touched, error, warning } }) {
        let hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (
            <Item error={hasError}>
                <Icon active name={input.name === "email" ? "person" : "code"} />
                <Input {...input} placeholder={placeholder} disabled={disabled} style={appStyles.input} />
            </Item>)
    }

    render() {
        return (
            <Container style={appStyles.background}>
                <Content>
                    <Card style={{ paddingBottom: 50, paddingRight: 10 }}>
                        <Form>
                            <Field name="email" placeholder="Email" disabled={true} component={this.renderInput} />
                            <Field name="activationCode" placeholder="Mã kích hoạt" component={this.renderInput} />
                        </Form>
                    </Card>
                    <Button block success style={[appStyles.button, appStyles.fullButton, { marginTop: 50 }]} onPress={this.props.handleSubmit(this.activate.bind(this))} disabled={(!this.props.error && this.props.invalid) || this.props.submitting} >
                        {this.props.submitting ? <Spinner color='white' /> : null}
                        <Text>Kích hoạt</Text>
                    </Button>
                </Content>
            </Container>
        );
    }

    activate(values) {
        return new Promise(async (resolve, reject) => {

            const { email, activationCode } = values
            let errMsg = 'Lỗi không thể xác định, vui lòng thử lại sau!'
            try {
                const result = await request('/accounts/activation', 'POST', { email, activationCode })
                switch (response.status) {

                    case 200:
                        return resolve()
                    case 500:
                        errMsg = 'Lỗi trên server'
                        break
                    case 401:
                        errMsg = 'Mã kích hoạt không đúng'
                        break

                }
            } catch (error) {
                if (error === 'CONNECTION_ERROR')
                    errMsg = 'Lỗi kết nối đến server'
            }
            reject(new SubmissionError({ _error: errMsg }))

        })

    }

}

const styles = StyleSheet.create({

    whiteText: {
        color: 'white'
    },

    titleImage: {
        alignSelf: 'center',
        width: 150,
        height: 150,
    }

})


const mapStateToProps = state => {
    return {
        initialValues: {
            email: state.cache.email
        },
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

const ActivationReduxForm = reduxForm({
    form: 'activation_form',
    touchOnBlur: false,
    enableReinitialize: true,
    validate: values => {
        const errors = {}

        if (!values.email) {
            errors.email = 'Email is required'
        }

        if (!values.activationCode) {
            errors.activationCode = 'Activation code is required.'
        }

        return errors
    },
    onSubmitFail: () => { }

})(ActivationForm)

export default connect(mapStateToProps, mapDispatchToProps)(ActivationReduxForm)