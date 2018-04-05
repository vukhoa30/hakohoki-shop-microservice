import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { loadProductFeedback, setCart, getAnswer } from '../presenters'
import { Container, Content, Spinner, Button, Card, CardItem, Icon, Grid, Col, Body, List, ListItem, Left, Right, Thumbnail, Footer, FooterTab } from 'native-base'
import ProgressBar from 'react-native-progress/Bar'
import AppText from './components/AppText'
import { alert, confirm } from "../utils";
import AppComment from './components/AppComment'

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
        const { getAnswer, data, isAddedToCart, status, reviews, comments, statistic, reviewScore, reviewCount, commentCount, navigation, productID, loadProductFeedback } = this.props

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
                        <CardItem header>
                            <Body>
                                <AppText style={{ fontWeight: 'bold' }}>USER RATING</AppText>
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
                    <View style={{ marginTop: 50 }}>
                        <Card>
                            <List>
                                <ListItem itemHeader first icon>
                                    <Body>
                                        <AppText style={{ fontWeight: 'bold' }}>REVIEWS ({reviewCount})</AppText>
                                    </Body>
                                    {
                                        reviewCount > 5 && <Right>
                                            <AppText small onPress={() => navigation.navigate('AllQuestionsOrReviews', { type: 'reviews' })} >See all reviews >></AppText>
                                        </Right>
                                    }
                                </ListItem>
                            </List>
                            {
                                reviewCount > 0 ?
                                    <View>
                                        <List dataArray={reviews} renderRow={review => (

                                            <ListItem avatar key={'review-' + review.id}>
                                                <AppComment comment={review} />
                                            </ListItem>

                                        )} />

                                    </View> :
                                    <AppText style={{ marginVertical: 10 }} note center>This product has no reviews</AppText>
                            }
                            <Button block light onPress={() => navigation.navigate('ReviewForm', { productID })}>
                                <AppText>MAKE A REVIEW</AppText>
                            </Button>
                        </Card>
                        <Card style={{ marginTop: 50 }}>
                            <List>
                                <ListItem itemHeader first icon>
                                    <Body>
                                        <AppText style={{ fontWeight: 'bold' }}>COMMENTS ({commentCount})</AppText>
                                    </Body>
                                    {
                                        commentCount > 5 && <Right>
                                            <AppText small onPress={() => navigation.navigate('AllQuestionsOrReviews', { type: 'comments' })}>See all questions >></AppText>
                                        </Right>
                                    }
                                </ListItem>
                            </List>
                            {
                                commentCount > 0 ?
                                    <View>
                                        <List dataArray={comments} renderRow={comment => (

                                            <ListItem onPress={() => getAnswer(comment.id)} avatar key={'comment-' + comment.id}>
                                                <AppComment comment={comment} />
                                            </ListItem>


                                        )} />
                                    </View> :
                                    <AppText style={{ marginVertical: 10 }} note center>No comments for this product</AppText>
                            }
                            <Button block light onPress={() => navigation.navigate('QuestionForm', { productID })}>
                                <AppText>GIVE A QUESTION</AppText>
                            </Button>
                        </Card>
                    </View>
                </Content>
                {
                    data.quantity > 0 &&
                    <Footer>
                        <FooterTab >
                            <View style={{ width: '100%' }}>
                                {
                                    isAddedToCart ?
                                        <Button danger full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                            confirm('Confirm', `Are you sure to remove product "${data.name}" from your cart?`, () => setCart(data, 'REMOVE'))
                                        }}>
                                            <Icon name='close' />
                                            <AppText>REMOVE FROM CART</AppText>
                                        </Button> :
                                        <Button success full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                            setCart(data, 'ADD')
                                            alert('Success', 'Product has been added to cart')
                                        }}>
                                            <Icon name='add' />
                                            <AppText>ADD TO CART</AppText>
                                        </Button>
                                }
                            </View>
                        </FooterTab>
                    </Footer>
                }
            </Container>
        )
    }

}

const mapStateToProps = (state) => {

    const { current } = state.product
    const { id, data } = current
    const { status, reviews, statistic, comments } = state.feedback
    const { list } = state.cart

    return {

        productID: id,
        status,
        reviews: reviews.slice(0, 5),
        reviewCount: data !== null && data.reviewCount ? data.reviewCount : 0,
        statistic,
        comments: comments.slice(0, 5),
        commentCount: comments.length,
        reviewScore: data !== null && data.reviewScore ? data.reviewScore : 0,
        isAddedToCart: list.find(product => product._id === id),
        data

    }

}

const mapDispatchToProps = (dispatch) => ({

    loadProductFeedback: (productID) => dispatch(loadProductFeedback(productID)),
    setCart: (product, type) => dispatch(setCart(product, type)),
    getAnswer: commentID => dispatch(getAnswer(commentID))

})

export default connect(mapStateToProps, mapDispatchToProps)(ProductFeedback)