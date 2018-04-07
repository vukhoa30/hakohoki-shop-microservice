import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { View } from 'react-native'
import { sendComment, logOut, loadProductFeedback } from '../../presenters'
import { Container, Content, Button, Form, Spinner, Item, Input } from 'native-base'
import AppText from './AppText'

class SendComment extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    renderInput({ input, placeholder, type, meta: { touched, error, warning } }) {
        const { handleSubmit } = this.props
        return (
            <Item>
                <Input {...input} autoFocus placeholder={placeholder} style={{ fontSize: 12 }} onSubmitEditing={handleSubmit(sendComment.bind(this))} />
            </Item>)
    }

    render() {
        return (
            <Form>
                <Field name='comment' placeholder='Type your comment' component={this.renderInput.bind(this)} />
            </Form>
        )
    }

}

const mapStateToProps = (state) => ({

    productId: state.product.productId,
    token: state.user

})

const mapDispatchToProps = (dispatch) => ({

    logOut: () => dispatch(logOut()),
    loadProductFeedback: productId => dispatch(loadProductFeedback(productId))

})

const ReduxForm = reduxForm({
    form: 'comment_form',
    touchOnBlur: false,
    enableReinitialize: true,
    onSubmitFail: () => { },
    validate: values => {
        const errors = {}
        if (!values) errors.comment = 'Required'
        return errors
    },
})(SendComment)

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm)