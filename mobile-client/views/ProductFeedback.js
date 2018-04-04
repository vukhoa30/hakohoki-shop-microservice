import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { loadProductFeedback } from '../presenters'
import { Container, Content, Spinner, Button, Card, CardItem, Icon, Grid, Col, Body, List, ListItem, Left, Thumbnail, Footer, FooterTab } from 'native-base'
import ProgressBar from 'react-native-progress/Bar'
import AppText from './components/AppText'
import { formatTime } from "../utils";

class ProductFeedback extends Component {

    static navigationOptions = {
        title: 'Feedback'
    }

    constructor(props) {
        super(props)
        this.state = {}
        const { productID, loadProductFeedback } = this.props
        loadProductFeedback(productID)
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

    renderStatistic(statistic, total) {

        return Object.keys(statistic).reverse().map(star => {

            const count = statistic[star]
            const progress = total > 0 ? count / total : 0

            return (
                <View style={{ flexDirection: 'row' }} key={'allstars-' + star}>
                    <AppText note small>{star} stars</AppText>
                    <ProgressBar progress={progress} style={{ marginHorizontal: 10, height: 10, marginTop: 5 }} width={80} height={20} borderRadis={0} />
                    <AppText note small>{count}</AppText>
                </View>
            )

        })

    }

    render() {
        const { status, reviews, questions, statistic, reviewScore, reviewCount, questionCount, navigation, productID, loadProductFeedback } = this.props

        switch (status) {

            case 'LOADING':
                return (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Spinner />
                    </View>
                )
            case 'LOADING_FAILED':
                return (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <AppText color='red' small style={{ marginBottom: 10 }}>Could not load data</AppText>
                        <Button small warning style={{ alignSelf: 'center' }} onPress={() => loadProductFeedback(productID)} >
                            <AppText>
                                Reload
                            </AppText>
                        </Button>
                    </View>
                )

        }

        return (
            <Container>
                <Content>
                    <Card>
                        <CardItem>
                            <Body>
                                <AppText center>USER RATING</AppText>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Grid>
                                    <Col style={{ flex: 1 }}>
                                        <AppText center>{reviewScore}/5</AppText>
                                        <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 10, flex: 1 }}>
                                            {
                                                this.renderStars(reviewScore, true)
                                            }
                                        </View>
                                    </Col>
                                    <Col>
                                        {
                                            this.renderStatistic(statistic, reviewCount)
                                        }
                                    </Col>
                                </Grid>
                            </Body>
                        </CardItem>
                    </Card>
                    <View>
                        <AppText center style={{ marginTop: 20, marginBottom: 10 }}>REVIEWS ({reviewCount})</AppText>
                        {
                            reviewCount > 0 ?
                                <List dataArray={reviews} renderRow={review => (

                                    <ListItem avatar key={'review-' + review.id}>
                                        <Left>
                                            <Thumbnail source={{ uri: 'https://medizzy.com/_nuxt/img/user-placeholder.d2a3ff8.png' }} />
                                        </Left>
                                        <Body>
                                            <Grid>
                                                <Col>
                                                    <AppText>{review.userName}</AppText>
                                                </Col>
                                                <Col style={{ alignItems: 'flex-end' }}>
                                                    <AppText note small>{formatTime(review.createdAt)}</AppText>
                                                </Col>
                                            </Grid>
                                            <View style={{ flexDirection: 'row' }}>
                                                {
                                                    this.renderStars(review.reviewScore)
                                                }
                                            </View>
                                            <AppText note>{review.content}</AppText>
                                        </Body>
                                    </ListItem>


                                )} /> :
                                <AppText style={{ marginVertical: 10 }} note center>This product has no reviews</AppText>
                        }
                        {
                            reviewCount > 5 && <Button block style={{ marginBottom: 20 }} light>
                                <AppText>SEE ALL REVIEWS</AppText>
                            </Button>
                        }

                        <AppText center style={{ marginVertical: 20 }}>QUESTIONS ({questionCount})</AppText>
                        {
                            questionCount > 0 ?
                                <List dataArray={questions} renderRow={question => (

                                    <ListItem avatar style={{ paddingVertical: 20 }} key={'question-' + question.id}>
                                        <Left>
                                            <Thumbnail source={{ uri: 'https://medizzy.com/_nuxt/img/user-placeholder.d2a3ff8.png' }} />
                                        </Left>
                                        <Body>
                                            <Grid>
                                                <Col>
                                                    <AppText>{question.userName}</AppText>
                                                </Col>
                                                <Col style={{ alignItems: 'flex-end' }}>
                                                    <AppText note small>{formatTime(question.createdAt)}</AppText>
                                                </Col>
                                            </Grid>
                                            <View style={{ flexDirection: 'row' }}>
                                                {
                                                    this.renderStars(question.reviewScore)
                                                }
                                            </View>
                                            <AppText note>{question.content}</AppText>
                                        </Body>
                                    </ListItem>


                                )} /> :
                                <AppText style={{ marginVertical: 10 }} note center>No questions for this product</AppText>
                        }
                        {
                            questionCount > 5 && <Button block style={{ marginBottom: 50 }} light>
                                <AppText>SEE ALL QUESTIONS</AppText>
                            </Button>
                        }
                    </View>
                </Content>
                <Footer>
                    <FooterTab>
                        <Grid>
                            <Col>
                                <Button full primary small onPress={() => navigation.navigate('ReviewForm')}>
                                    <AppText>
                                        MAKE A REVIEW
                                    </AppText>
                                </Button>
                            </Col>
                            <Col>
                                <Button full success small onPress={() => navigation.navigate('QuestionForm')}>
                                    <AppText>
                                        GIVE A QUESTION
                                    </AppText>
                                </Button>
                            </Col>
                        </Grid>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }

}

const mapStateToProps = (state) => {

    const { current } = state.product
    const { id, feedback, info } = current
    const { data } = info
    const { status, reviews, statistic, questions } = feedback

    return {

        productID: id,
        status,
        reviews: reviews.slice(0, 5),
        reviewCount: data !== null && data.reviewCount ? data.reviewCount : 0,
        statistic,
        questions: questions.slice(0, 5),
        questionCount: questions.length,
        reviewScore: data !== null && data.reviewScore ? data.reviewScore : 0,

    }

}

const mapDispatchToProps = (dispatch) => ({

    loadProductFeedback: (productID) => dispatch(loadProductFeedback(productID))

})

export default connect(mapStateToProps, mapDispatchToProps)(ProductFeedback)