import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError, formValueSelector } from 'redux-form';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Thumbnail, Icon, Left } from 'native-base';
import { StyleSheet, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
import { USER_LOG_IN, SAVE_EMAIL_TO_CACHE, getAction } from '../actions'
import { authenticate } from '../api'


class SignIn extends Component {

    constructor(props) {
        super(props);
        this.renderInput = this.renderInput.bind(this)
    }

    componentDidUpdate() {
        if (this.props.submitSucceeded) {
            this.props.reset()
            this.props.navigation.navigate('User')
        } else if (this.props.submitFailed && this.props.error === 'ACCOUNT_NOT_AUTHORIZED') {
            this.props.saveEmail(this.props.currentEmail)
            this.props.reset()
            this.props.navigation.navigate('AuthorizationForm')
        }
    }

    renderInput({ input, label, type, meta: { touched, error, warning } }) {
        let hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (<Item error={hasError} floatingLabel>
            <Label>{label}</Label>
            <Input secureTextEntry={type === 'password'}  {...input} style={styles.whiteText} />
        </Item>)
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#1D144B' }}>
                <Content>
                    <Button success bordered rounded style={{ margin: 10 }} onPress={() => this.props.navigation.navigate('User')}>
                        <Icon name='arrow-back' />
                    </Button>
                    <Thumbnail square style={styles.titleImage} source={{ uri: 'http://pettigrewspecialty.com/wp-content/uploads/2016/08/ShopOnline.png' }} />
                    <Form style={{ width: '90%', alignSelf: 'center', marginTop: 50 }}>
                        <Text transparent={!this.props.error} style={{ color: 'red', alignSelf: 'center' }}>{this.props.error}</Text>
                        <Field name="email" label="Email" component={this.renderInput} />
                        <Field name="password" label="Mật khẩu" type="password" component={this.renderInput} />
                        <Button block success style={{ marginTop: 30 }} onPress={this.props.handleSubmit(this.authenticate.bind(this))} disabled={(!this.props.error && this.props.invalid) || this.props.submitting} >
                            <Text>Đăng nhập {this.props.submitting ? '....' : ''}</Text>
                        </Button>
                    </Form>
                    <Text style={{ color: 'green', marginTop: 10, alignSelf: 'center' }} onPress={() => this.props.navigation.navigate('SignUp')}>Chưa có tài khoản? Đăng ký ngay!</Text>
                </Content>
            </Container>
        );
    }

    authenticate(values) {
        return new Promise(async (resolve, reject) => {

            const { email, password } = values
            const result = await authenticate(email, password)
            let msg = null

            switch (result.code) {

                case "ACCOUNT_NOT_FOUND":
                    msg = 'Email chưa được đăng ký'
                    break
                case "PASSWORD_WRONG":
                    msg = 'Mật khẩu sai'
                    break
                case "ACCOUNT_NOT_AUTHORIZED":
                    msg = result.code
                    break
                case "UNDEFINED_ERROR":
                    msg = 'Lỗi không thể xác định'
                    break
                case "INTERNAL_SERVER_ERROR":
                    msg = 'Lỗi server. Vui lòng thử lại sau!'
                    break
                default:
                    AsyncStorage.setItem('@User:token', result.data.token)
                    this.props.setLoggedIn(result.data.token)
                    return resolve()
            }

            reject(new SubmissionError({ _error: msg }))

        })

    }

}

const styles = StyleSheet.create({

    whiteText: {
        color: 'white'
    },

    titleImage: {
        alignSelf: 'center',
        width: '60%',
        height: 100,
        marginTop: 50
    }

})

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
        setLoggedIn: token => dispatch(getAction(USER_LOG_IN, { token })),
        saveEmail: email => dispatch(getAction(SAVE_EMAIL_TO_CACHE, { email }))
    }
}

const SignInReduxForm = reduxForm({
    form: 'authentication_form',
    touchOnBlur: false,
    enableReinitialize: true,
    validate: values => {
        const errors = {}

        if (!values.email) {
            errors.email = 'Email is required'
        }

        if (!values.password) {
            errors.password = 'Password is required.'
        }

        if (values.email && !validateEmail(values.email)) {
            errors.email = 'Invalid email'
        }

        return errors
    },
    onSubmitFail: () => { }

})(SignIn)

export default connect(mapStateToProps, mapDispatchToProps)(SignInReduxForm)