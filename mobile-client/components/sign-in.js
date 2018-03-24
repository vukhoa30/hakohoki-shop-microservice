import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form';
import { connect } from 'react-redux'
import { USER_LOG_IN, SAVE_EMAIL_TO_CACHE, getAction } from '../actions'
import { authenticate } from '../api'
import appStyles from '../styles'
import { Container, Header, Content, Form, Item, Input, Label, Card, Button, Text, Icon, Spinner } from 'native-base';
import { View, Alert } from 'react-native'
import { validateEmail } from '../utils'

class SignIn extends Component {

    constructor(props) {
        super(props)
        this.renderInput = this.renderInput.bind(this)
    }

    static navigationOptions = {
        title: 'Đăng nhập'
    }

    componentDidUpdate() {

        if (this.props.submitSucceeded) {

            const { navigation, reset } = this.props
            reset()
            navigation.navigate('User')

        } else if (this.props.submitFailed && this.props.error) {

            if (this.props.error === 'ACCOUNT_NOT_ACTIVATED') {
                const { currentEmail, saveEmailToCache, navigation, reset } = this.props
                saveEmailToCache(currentEmail)
                reset()
                Alert.alert('Lỗi', 'Tài khoản cần được xác thực trước khi đăng nhập')
                navigation.navigate('ActivationForm')
            } else {
                Alert.alert('Lỗi', this.props.error)
            }
            this.props.clearSubmitErrors()
        }

    }

    renderInput({ input, placeholder, type, meta: { touched, error, warning } }) {
        let hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (<
        Item error={hasError}>
            <Icon active name={input.name === "email" ? "person" : "unlock"} />
            <Input {...input} secureTextEntry={type === 'password'} placeholder={placeholder} style={appStyles.input}/>
        </Item>)
    }

    render() {
        return (
            <Container style={appStyles.background}>
                <Content>
                    <Card style={{ paddingBottom: 50, paddingRight: 10 }}>
                        <Form>
                            <Field name="email" placeholder="Email"  component={this.renderInput} />
                            <Field name="password" placeholder="Mật khẩu" type="password" component={this.renderInput} />
                            <Text style={{ alignSelf: 'flex-end', marginTop: 20, marginRight: 10, fontSize: 15, color: 'blue' }}>Quên mật khẩu?</Text>
                        </Form>
                    </Card>
                    <Button block success style={[appStyles.button, appStyles.fullButton, { marginTop: 50 }]} onPress={this.props.handleSubmit(this.authenticate.bind(this))} disabled={(!this.props.error && this.props.invalid) || this.props.submitting}>
                        {this.props.submitting ? <Spinner color='white' /> : null}
                        <Text>Đăng nhập</Text>
                    </Button>
                    <Text style={{ alignSelf: 'center', margin: 10, fontSize: 15, color: 'gray' }}>---------- hoặc đăng nhập qua ----------</Text>
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

    authenticate(values) {

        return new Promise(async (resolve, reject) => {

            const { email, password } = values
            const response = await authenticate(email, password)

            let errMsg = 'Lỗi không thể xác định, vui lòng thử lại sau!'
            switch (response.code) {

                case 'OK':
                    this.props.logIn(response.data.token)
                    return resolve()
                case 'ACCOUNT_NOT_FOUND':
                    errMsg = 'Tài khoản chưa được đăng ký'
                    break
                case 'PASSWORD_WRONG':
                    errMsg = 'Mật khẩu sai'
                    break
                case 'ACCOUNT_NOT_ACTIVATED':
                    errMsg = response.code
                    break
                case 'INTERNAL_SERVER_ERROR':
                    errMsg = 'Lỗi server, vui lòng thử lại sau'
                    break
                case 'CONNECTION_ERROR':
                    errMsg = 'Không thể kết nối đến server'
                    break

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
        currentEmail: formValueSelector('authentication_form')(state, 'email')
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logIn: token => dispatch(getAction(USER_LOG_IN, { token })),
        saveEmailToCache: email => dispatch(getAction(SAVE_EMAIL_TO_CACHE, { email }))
    }
}

const SignInForm = reduxForm({
    form: 'authentication_form',
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
    onSubmitFail: () => { }

})(SignIn)

export default connect(mapStateToProps, mapDispatchToProps)(SignInForm)