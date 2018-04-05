import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { View, Dimensions } from 'react-native'
import { loadProductFeedback, logOut, sendComment } from '../presenters'
import { Container, Content, Form, List, ListItem, Thumbnail, Left, Right, Footer, FooterTab, Item, Input, Icon, Spinner, Body, Grid, Col } from 'native-base'
import { alert } from "../utils"
import AppText from './components/AppText'
import AppComment from './components/AppComment'

const { height, width } = Dimensions.get('window')

class Answers extends Component {

    constructor(props) {
        super(props)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        const { submitSucceeded, submitFailed, error, clearSubmitErrors, navigation, loadProductFeedback, productId } = this.props

        if (submitSucceeded) {

            loadProductFeedback(productId, true)

        } else if (submitFailed && error) {

            alert('Error', error)
            clearSubmitErrors()
        }

    }

    renderInput({ input, placeholder, type, meta: { touched, error, warning } }) {
        const { handleSubmit } = this.props

        return (
            <Item>
                <Input {...input} placeholder={placeholder} style={{ fontSize: 12 }} last onSubmitEditing={handleSubmit(sendComment.bind(this))} />
                <Icon active name='send' onPress={handleSubmit(sendComment.bind(this))} />
            </Item>)
    }

    render() {
        const { status, comments, navigation, productID, loadProductFeedback, submitting } = this.props

        return (
            <Container>
                {
                    (status === 'LOADING' || submitting) &&
                    <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width, height: height - 50 }}>
                        <Spinner />
                    </View>
                }
                <Content style={{ opacity: status === 'LOADING' || submitting ? 0.5 : 1 }}>
                    <List dataArray={comments} renderRow={item => (

                        <ListItem avatar key={'comment-' + item.id}>
                           <AppComment comment={item}/>
                        </ListItem>

                    )} />
                </Content>
                <Footer>
                    <FooterTab >
                        <View style={{ width: '100%', backgroundColor: 'white' }}>
                            <Form>
                                <Field name='comment' placeholder='TYPE YOUR REPLY FOR THIS COMMENT ....' component={this.renderInput.bind(this)} />
                            </Form>
                        </View>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }

}

const mapStateToProps = (state) => {

    const { comments: allComments, currentCommentId: parentId } = state.feedback
    const { token, fullName } = state.user
    const { id: productId } = state.product.current
    const comments = allComments.find(comment => comment.id === parentId).reply

    return {

        fullName,
        parentId,
        productId,
        token,
        comments

    }

}

const mapDispatchToProps = (dispatch) => ({

    loadProductFeedback: productID => dispatch(loadProductFeedback(productID)),
    logOut: () => dispatch(logOut())

})

const ReduxForm = reduxForm({
    form: 'answer_form',
    touchOnBlur: false,
    enableReinitialize: true,
    onSubmitFail: () => { },
    validate: values => {
        const errors = {}

        if (!values.comment) errors.reply = 'Required'

        return errors
    },
})(Answers)

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm)