import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { View, Alert } from 'react-native'
import { sendComment, logOut, loadProductFeedback } from '../presenters'
import { Container, Content, Button, Form, Spinner, Item, Input } from 'native-base'
import AppText from './components/AppText'
import { NavigationActions } from "react-navigation"

class QuestionForm extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidUpdate() {

        const { submitSucceeded, submitFailed, error, clearSubmitErrors, navigation, loadProductFeedback, productID } = this.props

        if (submitSucceeded) {

            navigation.goBack()
            loadProductFeedback(productID,true)

        } else if (submitFailed && error) {

            Alert.alert('Error', error)
            clearSubmitErrors()
        }

    }

    renderInput({ input, placeholder, type, meta: { touched, error, warning } }) {
        let hasError = false;
        if (error !== undefined) {
            hasError = true
        }

        return (
            <Item error={hasError}>
                <Input {...input} placeholder={placeholder} style={{ fontSize: 12 }} multiline={true} numberOfLines={15} last />
            </Item>)
    }

    render() {
        const { error, invalid, submitting, handleSubmit, navigation } = this.props
        return (
            <Container>
                <Content style={{ paddingHorizontal: 20 }}>
                    <Form>
                        <Field name='comment' placeholder='TYPE YOUR QUESTION HERE' component={this.renderInput} />
                    </Form>
                    <Button block success disabled={(!error && invalid) || submitting} style={{ marginVertical: 10, marginTop: 50 }}
                        onPress={handleSubmit(sendComment.bind(this))}
                    >
                        {submitting ? <Spinner /> : null}
                        <AppText>SUBMIT</AppText>
                    </Button>
                    <Button block onPress={() => navigation.goBack()} >
                        <AppText>CLOSE</AppText>
                    </Button>
                </Content>
            </Container>
        )
    }

}

const mapStateToProps = (state) => ({

    productID: state.product.current.id,
    token: state.user.token

})

const mapDispatchToProps = (dispatch) => ({

    logOut: () => dispatch(logOut()),
    loadProductFeedback: productID => dispatch(loadProductFeedback(productID, true))

})

const ReduxForm = reduxForm({
    form: 'question_form',
    touchOnBlur: false,
    enableReinitialize: true,
    onSubmitFail: () => { },
    validate: values => {
        const errors = {}

        if (!values.question) errors.question = 'Question is required'

        return errors
    },
})(QuestionForm)

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm)