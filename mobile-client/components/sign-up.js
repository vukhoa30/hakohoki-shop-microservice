import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form';
import { connect } from 'react-redux'
import { SAVE_EMAIL_TO_CACHE, getAction } from '../actions'
import appStyles from '../styles'
import { Container, Header, Content, Form, Item, Input, Label, Card, Button, Text, Icon, Spinner } from 'native-base';
import { View, Alert } from 'react-native'
import { validateEmail, request } from '../utils'

class SignUp extends Component {

    constructor(props) {
        super(props)
        this.renderInput = this.renderInput.bind(this)
    }

    static navigationOptions = {
        title: 'Đăng ký'
    }

    componentDidUpdate() {

        if (this.props.submitSucceeded) {
            const { navigation, reset, saveEmailToCache, currentEmail } = this.props
            saveEmailToCache(currentEmail)
            Alert.alert('Thông báo', 'Tạo tài khoản thành công, vui lòng nhập mã kích hoạt được gửi qua mail')
            reset()
            navigation.navigate('ActivationForm')
        } else if (this.props.submitFailed && this.props.error) {
            Alert.alert('Lỗi', this.props.error)
            this.props.clearSubmitErrors()
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
                <Input {...input} secureTextEntry={type === 'password'} placeholder={placeholder} style={appStyles.input} />
            </Item>)
    }

    render() {
        return (
            <Container style={appStyles.background}>
                <Content>
                    <Card style={{ paddingBottom: 50, paddingRight: 10 }}>
                        <Form>
                            <Field name="email" placeholder="Email" component={this.renderInput} />
                            <Field name="password" placeholder="Mật khẩu" type="password" component={this.renderInput} />
                            <Field name="retypePassword" placeholder="Nhập lại mật khẩu" type="password" component={this.renderInput} />
                        </Form>
                    </Card>
                    <Button block success style={[appStyles.button, appStyles.fullButton, { marginTop: 50 }]} onPress={this.props.handleSubmit(this.enroll.bind(this))} disabled={(!this.props.error && this.props.invalid) || this.props.submitting}>
                        {this.props.submitting ? <Spinner color='white' /> : null}
                        <Text>Đăng ký</Text>
                    </Button>
                    <Text style={{ alignSelf: 'center', margin: 10, fontSize: 15, color: 'gray' }}>---------- hoặc đăng ký qua ----------</Text>
                    <View style={{ marginTop: 10, flexDirection: 'row', alignSelf: 'center' }}>
                        <Button primary iconLeft style={[appStyles.button, { marginRight: 10 }]}>
                            <Icon name='logo-facebook' />
                            <Text>Facebook</Text>
                        </Button>
                        <Button danger iconLeft style={appStyles.button}>
                            <Icon name='logo-google' />
                            <Text>Google</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }

    enroll(values) {

        return new Promise(async (resolve, reject) => {

            let errMsg = 'Lỗi không thể xác định, vui lòng thử lại sau!'

            try {
                const response = await request('/accounts/', 'POST', { email, password })
                switch (response.status) {

                    case 200:
                        return resolve()
                    case 500:
                        errMsg = 'Lỗi trên server'
                        break
                    case 409:
                        errMsg = 'Tài khoản đã được đăng ký'
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

const mapStateToProps = state => {
    return {
        initialValues: {
            email: state.cache.email
        },
        currentEmail: formValueSelector('enroll_form')(state, 'email')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveEmailToCache: email => dispatch(getAction(SAVE_EMAIL_TO_CACHE, email))
    }
}

const SignUpForm = reduxForm({
    form: 'enroll_form',
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
            errors.password = 'Password is required'
        }

        if (!values.retypePassword) {
            errors.retypePassword = 'Retype password is required'
        } else if (values.retypePassword !== values.password) {
            errors.retypePassword = 'Retype password not match'
        }

        return errors
    },
    onSubmitFail: () => { }

})(SignUp)

export default connect(mapStateToProps, mapDispatchToProps)(SignUpForm)