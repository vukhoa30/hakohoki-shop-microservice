import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Dimensions } from 'react-native'
import { getAnswer, loadProductFeedback } from '../presenters'
import { Container, Content, Button, List, ListItem, Grid, Col, Body, Left, Thumbnail, Icon, Spinner } from 'native-base'
import AppText from './components/AppText'
import AppComment from './components/AppComment'

const { width, height } = Dimensions.get('window')

class AllQuestionsOrReviews extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { status, navigation, reviews, comments, getAnswer, productID, loadProductFeedback } = this.props
        const { params } = navigation.state

        return (
            <Container>
                {
                    status === 'LOADING' &&
                    <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', width, height: height - 50 }}>
                        <Spinner />
                    </View>
                }
                <Content>
                    <List dataArray={params.type === 'reviews' ? reviews : comments} renderRow={item => (

                        <ListItem avatar key={'comment-' + item.id} onPress={() => params.type === 'comments' && getAnswer(item.id)} >
                            <AppComment comment={item} />
                        </ListItem>


                    )} />
                </Content>
            </Container>
        )
    }

}

const mapStateToProps = (state) => ({

    productID: state.product.current.id,
    status: state.feedback.status,
    reviews: state.feedback.reviews,
    comments: state.feedback.comments

})

const mapDispatchToProps = (dispatch) => ({

    getAnswer: commentID => dispatch(getAnswer(commentID)),
    loadProductFeedback: questionID => dispatch(loadProductFeedback(questionID))

})

export default connect(mapStateToProps, mapDispatchToProps)(AllQuestionsOrReviews)