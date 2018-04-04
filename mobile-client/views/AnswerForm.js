import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { View } from 'react-native'
import { } from '../presenters'
import { Container, Content, Form } from 'native-base'

class AnswerForm extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    renderInput({ input, placeholder, type, meta: { touched, error, warning } }) {
        let hasError = false;
        if (error !== undefined) {
            hasError = true
        }
        let icon = ''
        switch (input.name) {

        }
        return (
            <Item error={hasError}>
                <Icon active name={icon} />
                <Input {...input} placeholder={placeholder} style={{ fontSize: 12 }} last />
            </Item>)
    }

    render() {
        return (
            <Container>
                <Content>
                    <Field name='' placeholder='' component={this.renderInput}/>
                </Content>
            </Container>
        )
    }

}

const mapStateToProps = () => ({


})

const mapDispatchToProps = () => ({


})

const ReduxForm = reduxForm({
    form: 'answer_form',
    touchOnBlur: false,
    enableReinitialize: true,
    onSubmitFail: () => { },
    validate: values => {
        const errors = {}

        return errors
    },
})(AnswerForm)

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm)