import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Field, reduxForm } from "redux-form"
import StarRating from 'react-native-star-rating'
import { loadProductFeedback, sendReview, logOut, reviewProduct, loadProductInformation } from '../../api'
import { Container, Content, Spinner, Button, Card, CardItem, Icon, Grid, Col, Body, List, ListItem, Left, Right, Thumbnail, Form, Item, Input } from 'native-base'
import ProgressBar from 'react-native-progress/Bar'
import AppText from '../components/AppText'
import AppProductFooter from '../components/AppProductFooter'
import { alert, confirm } from "../../utils";
import AppComment from '../components/AppComment'

class ProductReviews extends Component {

    static navigationOptions = {
        title: 'Reviews'
    }

    constructor(props) {
        super(props)
        this.state = {
            starCount: 0,
            status: 'PLEASE VOTING'
        }
        const { productId, loadProductFeedback, status } = this.props
        if (status !== 'LOADED')
            loadProductFeedback(productId)
    }

    onStarRatingPress(rating) {

        let status = ''

        switch (rating) {
            case 1:
                status = 'BAD'
                break
            case 2:
                status = 'NOT GOOD'
                break
            case 3:
                status = 'GOOD'
                break
            case 4:
                status = 'VERY GOOD'
                break
            case 5:
                status = 'EXCELLENT'
                break
        }

        this.setState({
            starCount: rating,
            status
        });
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

    renderInput({ input, placeholder, type, meta: { touched, error, warning } }) {

        return (
            <Item>
                <Input {...input} placeholder={placeholder} style={{ fontSize: 12 }} multiline={true} numberOfLines={10} last />
            </Item>)

    }

    render() {
        const { userId, isReviewed, isLoggedIn, logOut, handleSubmit, submitting, loadProductFeedback, status, reviews, originalComments, statistic, reviewScore, reviewCount, productId } = this.props
        const currentUserReview = reviews.find(review => review.userId === userId)
        const currentUserRating = currentUserReview ? currentUserReview.reviewScore : 0

        switch (status) {

            case 'LOADING': case 'INIT':
                return (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Spinner />
                    </View>
                )
            case 'LOADING_FAILED':
                return (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <AppText color='red' small style={{ marginBottom: 10 }}>Could not load data</AppText>
                        <Button small warning style={{ alignSelf: 'center' }} onPress={() => loadProductFeedback(productId)} >
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
                    <Card style={{ marginVertical: 10 }}>
                        <CardItem>
                            <Body style={{ alignItems: 'center' }}>
                                {
                                    isLoggedIn ?
                                        (
                                            isReviewed ?
                                                <View style={{ alignItems: 'center' }}>
                                                    <StarRating
                                                        disabled={true}
                                                        maxStars={5}
                                                        fullStarColor='orange'
                                                        emptyStarColor='orange'
                                                        rating={currentUserRating}
                                                    />
                                                    <AppText style={{ marginVertical: 20 }} note>You reviewed this product</AppText>
                                                </View>
                                                :
                                                <View style={{ alignItems: 'center' }}>
                                                    <StarRating
                                                        disabled={false}
                                                        maxStars={5}
                                                        fullStarColor='orange'
                                                        emptyStarColor='orange'
                                                        rating={this.state.starCount}
                                                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                                                    />
                                                    <AppText note style={{ marginVertical: 5 }}>{this.state.status}</AppText>
                                                    <Field name='review' placeholder='TYPE YOUR REVIEW HERE' component={this.renderInput} />
                                                    <Button block success disabled={this.state.starCount === 0 || submitting} style={{ marginVertical: 10 }}
                                                        onPress={handleSubmit(sendReview.bind(this))}
                                                    >
                                                        {submitting ? <Spinner /> : null}
                                                        <AppText>SUBMIT</AppText>
                                                    </Button>
                                                </View>
                                        ) :
                                        <Button danger style={{ alignSelf: 'center' }} onPress={() => logOut()} ><AppText>Log in to review</AppText></Button>
                                }
                            </Body>
                        </CardItem>
                    </Card>
                    <Card>
                        <List>
                            <ListItem itemHeader first icon>
                                <Body>
                                    <AppText style={{ fontWeight: 'bold' }}>REVIEWS ({reviews.length})</AppText>
                                </Body>
                            </ListItem>
                        </List>
                        {
                            reviews.length > 0 ?
                                <View>
                                    <List dataArray={reviews.reverse()} renderRow={review => (

                                        <ListItem avatar key={'review-' + review.id}>
                                            <AppComment comment={review} />
                                        </ListItem>

                                    )} />

                                </View> :
                                <AppText style={{ marginVertical: 10 }} note center>This product has no reviews</AppText>
                        }
                    </Card>
                </Content>
                <AppProductFooter />
            </Container>
        )
    }

}

const mapStateToProps = (state) => {

    const { productId, status, reviews, statistic } = state.feedback
    const { data } = state.product
    const { token, isLoggedIn, account } = state.user

    return {

        userId: account.accountId,
        isReviewed: data.reviewedBySelf,
        isLoggedIn,
        token,
        productId,
        status,
        reviews,
        statistic,
        reviewScore: data !== null && data.reviewScore ? data.reviewScore : 0,
        reviewCount: data !== null && data.reviewCount ? data.reviewCount : 0,

    }

}

const mapDispatchToProps = (dispatch) => ({

    loadProductFeedback: (productId) => dispatch(loadProductFeedback(productId)),
    logOut: () => dispatch(logOut()),
    reviewProduct: () => dispatch(reviewProduct()),
    loadProductInformation: (productId, token) => dispatch(loadProductInformation(productId, token))

})

const ReduxForm = reduxForm({
    form: 'review_form',
    touchOnBlur: false,
    enableReinitialize: true,
    onSubmitFail: () => { },
    validate: values => {
        const errors = {}

        return errors
    },
})(ProductReviews)

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm)