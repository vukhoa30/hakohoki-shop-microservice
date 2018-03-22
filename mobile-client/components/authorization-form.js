import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Thumbnail, Icon, Left } from 'native-base';
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { authorize } from '../api'


class AuthorizationForm extends Component {

    constructor(props) {
        super(props);
        this.renderInput = this.renderInput.bind(this)
        console.log(this.props.initialValues)
    }

    componentDidUpdate() {
        if (this.props.submitSucceeded) {
            this.props.reset()
            this.props.navigation.navigate('SignIn')
        }
    }

    renderInput({ input, label, disabled, type, meta: { touched, error, warning } }) {
        let hasError = false;
        if (error !== undefined) {
            hasError = true;
        }
        return (<Item error={hasError} floatingLabel>
            <Label>{label}</Label>
            <Input {...input} style={styles.whiteText} disabled={disabled}/>
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
                        <Field name="email" label="Email" disabled={true} component={this.renderInput} />
                        <Field name="authCode" label="Mã xác thực" component={this.renderInput} />
                        <Button block success style={{ marginTop: 30 }} onPress={this.props.handleSubmit(this.authenticate.bind(this))} disabled={(!this.props.error && this.props.invalid) || this.props.submitting} >
                            <Text>Xác thực {this.props.submitting ? '....' : ''}</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }

    authenticate(values) {
        return new Promise(async (resolve, reject) => {

            const { email, authCode } = values
            const result = await authorize(email, authCode)
            let msg = null

            switch (result.code) {

                case "AUTHORIZATION_CODE_NOT_MATCH":
                    msg = 'Mã xác thực không hợp lệ'
                    break
                case "UNDEFINED_ERROR":
                    msg = 'Lỗi không thể xác định'
                    break
                case "INTERNAL_SERVER_ERROR":
                    msg = 'Lỗi server. Vui lòng thử lại sau!'
                    break
                default:
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

const AuthorizationReduxForm = reduxForm({
    form: 'authorization_form',
    touchOnBlur: false,
    enableReinitialize: true,
    validate: values => {
        const errors = {}

        if (!values.email) {
            errors.email = 'Email is required'
        }

        if (!values.authCode) {
            errors.authCode = 'Authorization code is required.'
        }

        return errors
    },
    onSubmitFail: () => { }

})(AuthorizationForm)

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizationReduxForm)