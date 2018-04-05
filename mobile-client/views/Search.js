import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { View } from 'react-native'
import { search } from '../presenters'
import { Container, Header, Content, Button, Form, Spinner, Item, Input, Icon, Left, Right, Body } from 'native-base'
//import { Header, SearchBar } from 'react-native-elements'
import AppText from './components/AppText'

class Search extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    renderInput({ input, placeholder, type, meta: { touched, error, warning } }) {
        const { handleSubmit } = this.props
        return (
            <Item style={{ borderBottomColor: '#1B7887' }} >
                <Input {...input} placeholder={placeholder} last placeholderTextColor='white' style={{ color: 'white' }} onSubmitEditing={handleSubmit(search.bind(this))} />
            </Item>)
    }

    render() {
        const { error, invalid, submitting, handleSubmit, navigation } = this.props
        return (
            <Container>
                <Header style={{ backgroundColor: '#1B7887' }}>
                    <Left>
                        <Button transparent onPress={() => navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Field name='q' placeholder='Search...' component={this.renderInput.bind(this)} />
                    </Body>
                    <Right>
                        <Button transparent onPress={handleSubmit(search.bind(this))} ref={component => this.submit = component}>
                            <Icon name='search' />
                        </Button>
                    </Right>
                </Header>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({


})

const mapDispatchToProps = (dispatch) => ({


})

const ReduxForm = reduxForm({
    form: 'search_form',
    touchOnBlur: false,
    enableReinitialize: true,
    onSubmitFail: () => { },
    validate: values => {
        const errors = {}
        if (!values.q) errors.q = 'Required'
        return errors
    },
})(Search)

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm)