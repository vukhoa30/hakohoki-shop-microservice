import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { View, Dimensions } from 'react-native'
import { loadProductFeedback, logOut, sendComment, loadAnswers } from '../presenters'
import { Container, Content, Form, List, ListItem, Thumbnail, Left, Right, Footer, FooterTab, Item, Input, Icon, Spinner, Body, Grid, Col } from 'native-base'
import { alert } from "../utils"
import AppText from './components/AppText'
import AppComment from './components/AppComment'
import SendComment from './components/SendComment'

const { height, width } = Dimensions.get('window')

class Answers extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { submitting, navigation, status, answers } = this.props
        const { params } = navigation.state
        const { parentId } = params

        console.log('parentId: ' + parentId)

        return (
            <Container>
                {
                    (status === 'LOADING' || submitting) &&
                    <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width, height: height - 50 }}>
                        <Spinner />
                    </View>
                }
                <Content style={{ opacity: status === 'LOADING' || submitting ? 0.5 : 1 }}>
                    <List dataArray={answers} renderRow={item => (

                        <ListItem avatar key={'comment-' + item.id}>
                            <AppComment comment={item} />
                        </ListItem>

                    )} />
                </Content>
                <Footer>
                    <FooterTab>
                        <View style={{ width: '100%', backgroundColor: 'white' }} >
                            <SendComment parentId={parentId} />
                        </View>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }

}

const mapStateToProps = (state) => ({

    status: state.feedback.status,
    answers: state.feedback.answers

})

const mapDispatchToProps = (dispatch) => ({

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