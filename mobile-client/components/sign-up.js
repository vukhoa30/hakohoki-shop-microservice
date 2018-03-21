import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Thumbnail, Icon, Left } from 'native-base';
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { USER_LOG_IN, getAction } from '../actions'
import { enroll } from '../api'


class SignUp extends Component {

    constructor(props) {
        super(props);
        this.renderInput = this.renderInput.bind(this)
    }

    componentDidUpdate() {
        if (this.props.submitSucceeded) {
            this.props.navigation.navigate('User')
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
                    <Form style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                        <Text transparent={!this.props.error} style={{ color: 'red', alignSelf: 'center' }}>{this.props.error}</Text>
                        <Field name="email" label="Email" component={this.renderInput} />
                        <Field name="password" label="Mật khẩu" type="password" component={this.renderInput} />
                        <Field name="retypePassword" label="Nhập lại mật khẩu" type="password" component={this.renderInput} />
                        <Button block success style={{ marginTop: 30 }} onPress={this.props.handleSubmit(this.enroll.bind(this))} disabled={(!this.props.error && this.props.invalid) || this.props.submitting} >
                            <Text>Đăng ký {this.props.submitting ? '....' : ''}</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }

    enroll(values) {
        return new Promise(async (resolve, reject) => {

            const { email, password } = values
            const result = await enroll(email, password)

            if (result.isOK) {
                resolve()
            }
            else {
                reject(new SubmissionError({ _error: result.msg }))
            }
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


export default reduxForm({
    form: 'enroll_form',
    touchOnBlur: false,
    validate: values => {
        const errors = {}

        if (!values.email) {
            errors.email = 'Email is required'
        }

        if (!values.password) {
            errors.password = 'Password is required.'
        }

        if (!values.retypePassword) {
            errors.retypePassword = 'Retype password is required.'
        }

        if (values.email && !validateEmail(values.email)) {
            errors.email = 'Invalid email'
        }

        if (values.password && values.retypePassword && (values.password !== values.retypePassword)){
            errors.retypePassword = 'Retype password not match'
        }

        return errors
    },
    onSubmitFail: () => { }

})(SignUp)