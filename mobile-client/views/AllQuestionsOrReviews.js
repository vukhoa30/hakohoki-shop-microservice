import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { } from '../presenters'
import { Container, Content, Button, List, ListItem, Grid, Col, Body, Left, Thumbnail } from 'native-base'
import AppText from './components/AppText'
import { formatTime } from "../utils";

class AllQuestionsOrReviews extends Component {

    static navigationOptions = ({ navigation }) => ({ title: navigation.state.params.type === 'reviews' ? 'All reviews' : 'All questions' })

    constructor(props) {
        super(props)
        this.state = {}
    }

    renderStars(reviewScore, large = false) {

        const stars = [];
        let i = 0
        for (; i < reviewScore; i++)
            stars.push(<Icon key={'star-' + i} name="ios-star" style={{ color: 'orange', fontSize: large ? 15 : 10, fontWeight: 'bold', marginVertical: 5 }} />)
        for (; i < 5; i++)
            stars.push(<Icon key={'star-' + i} name="ios-star-outline" style={{ color: 'orange', fontSize: large ? 15 : 10, fontWeight: 'bold', marginVertical: 5 }} />)
        return stars

    }

    render() {
        const { navigation, reviews, questions } = this.props
        const { params } = navigation.state

        return (
            <Container>
                <Content>
                    <List dataArray={params.type === 'reviews' ? reviews : questions} renderRow={item => (

                        <ListItem avatar key={'comment-' + item.id}>
                            <Left>
                                <Thumbnail source={{ uri: 'https://medizzy.com/_nuxt/img/user-placeholder.d2a3ff8.png' }} />
                            </Left>
                            <Body>
                                <Grid>
                                    <Col>
                                        <AppText>{item.userName}</AppText>
                                    </Col>
                                    <Col style={{ alignItems: 'flex-end' }}>
                                        <AppText note small>{formatTime(item.createdAt)}</AppText>
                                    </Col>
                                </Grid>
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        item.reviewScore && this.renderStars(item.reviewScore)
                                    }
                                </View>
                                <AppText note>{item.content}</AppText>
                            </Body>
                        </ListItem>


                    )} />
                </Content>
            </Container>
        )
    }

}

const mapStateToProps = (state) => ({

    reviews: state.product.current.feedback.reviews,
    questions: state.product.current.feedback.questions

})

const mapDispatchToProps = () => ({


})

export default connect(mapStateToProps, mapDispatchToProps)(AllQuestionsOrReviews)