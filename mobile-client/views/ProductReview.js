import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, StyleSheet } from 'react-native'
import { Container, Content, Card, CardItem, Thumbnail, Icon, Left, Right, Body, Spinner, Text, Button, List, ListItem, Grid, Col, Footer, FooterTab } from 'native-base';
import AppText from './components/AppText'
import AppContainer from './components/AppContainer'
import FeatureList from './components/FeatureList'
import AppButton from './components/AppButton'
import { loadProductFeedback, makingStatistic } from "../presenters";
import ProgressBar from 'react-native-progress/Bar'
import { formatTime } from "../utils";

class ProductReview extends Component {

    static navigationOptions = {
        title: 'Reviews'
    }

    constructor(props) {
        super(props)
        const { productID, loadProductFeedback, status, dataProcessingStatus, makingStatistic, list } = this.props
        if (status !== 'LOADED')
            loadProductFeedback(productID)
        else if (dataProcessingStatus !== 'PROCESSED')
            makingStatistic(list)

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

    divide(num1, num2) {

        return num2 > 0 ? num1 / num2 : 0

    }

    render() {
        const { isLoggedIn, reviews, status, navigation, productID, loadProductFeedback, dataProcessingStatus, statistic, score, totalReviews } = this.props

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
                        <AppButton small warning style={{ alignSelf: 'center' }} onPress={() => loadProductFeedback(productID)} >Reload</AppButton>
                    </View>
                )

        }

        return (
            <Container>
                <Content style={{ paddingBottom: 50 }}>
                    <Card>
                        <CardItem>
                            <Body>
                                <AppText>USER RATING</AppText>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                {
                                    dataProcessingStatus === 'DATA_PROCESSING' ?
                                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                            <Spinner />
                                        </View> :
                                        <Grid>
                                            <Col style={{ flex: 1 }}>
                                                <AppText center>{score}/5</AppText>
                                                <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 10, flex: 1 }}>
                                                    {
                                                        this.renderStars(score, true)
                                                    }
                                                </View>
                                            </Col>
                                            <Col>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <AppText note small>5 stars</AppText>
                                                    <ProgressBar progress={this.divide(statistic['5'], totalReviews)} style={{ marginHorizontal: 10, height: 10, marginTop: 5 }} width={80} height={20} borderRadis={0} />
                                                    <AppText note small>{statistic['5']}</AppText>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <AppText note small>4 stars</AppText>
                                                    <ProgressBar progress={this.divide(statistic['4'], totalReviews)} style={{ marginHorizontal: 10, height: 10, marginTop: 5 }} width={80} height={20} borderRadis={0} />
                                                    <AppText note small>{statistic['4']}</AppText>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <AppText note small>3 stars</AppText>
                                                    <ProgressBar progress={this.divide(statistic['3'], totalReviews)} style={{ marginHorizontal: 10, height: 10, marginTop: 5 }} width={80} height={20} borderRadis={0} />
                                                    <AppText note small>{statistic['3']}</AppText>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <AppText note small>2 stars</AppText>
                                                    <ProgressBar progress={this.divide(statistic['2'], totalReviews)} style={{ marginHorizontal: 10, height: 10, marginTop: 5 }} width={80} height={20} borderRadis={0} />
                                                    <AppText note small>{statistic['2']}</AppText>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <AppText note small>1 stars</AppText>
                                                    <ProgressBar progress={this.divide(statistic['1'], totalReviews)} style={{ marginHorizontal: 10, height: 10, marginTop: 5 }} width={80} height={20} borderRadis={0} />
                                                    <AppText note small>{statistic['1']}</AppText>
                                                </View>
                                            </Col>
                                        </Grid>

                                }
                            </Body>
                        </CardItem>
                    </Card>
                    {
                        !isLoggedIn ?
                            <View style={{ marginTop: 20, marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <AppButton style={{ marginHorizontal: 5, alignSelf: 'center' }} onPress={() => navigation.navigate('LogIn', { lastScreen: 'ProductReviews' })} >LOG IN</AppButton>
                                <AppText note>to review this product</AppText>
                            </View> :
                            <AppText center note style={{ marginTop: 20, marginBottom: 10 }}>YOU HAVE NOT REVIEWED THIS PRODUCT YET</AppText>
                    }
                    <AppText center style={{ marginTop: 20, marginBottom: 10 }}>REVIEWS ({reviews.length})</AppText>
                    <List>
                        {
                            reviews.map(item => (
                                <ListItem avatar key={'reviews-' + item.id}>
                                    <Left>
                                        <Thumbnail source={{ uri: 'https://medizzy.com/_nuxt/img/user-placeholder.d2a3ff8.png' }} />
                                    </Left>
                                    <Body>
                                        <AppText>{item.userName}</AppText>
                                        <View style={{ flexDirection: 'row' }}>
                                            {
                                                this.renderStars(item.reviewScore)
                                            }
                                        </View>
                                        <AppText note>{item.content}</AppText>
                                    </Body>
                                    <Right>
                                        <AppText note>{formatTime(item.createdAt)}</AppText>
                                    </Right>
                                </ListItem>
                            ))
                        }
                    </List>
                </Content>
                <Footer>
                    <FooterTab>
                        <AppButton full textStyle={{ fontSize: 15 }}>REVIEW NOW</AppButton>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        width: 80,
        height: 80,
    },
    background: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        height: '100%'
    }
});

const mapStateToProps = state => {

    const { selectedProductID, productFeedback, productFeedbackStatistic } = state.product
    const { status, reviews } = productFeedback
    const { isLoggedIn } = state.user

    return {
        isLoggedIn,
        productID: selectedProductID,
        status,
        reviews,
        totalReviews: productFeedbackStatistic.totalReviews,
        dataProcessingStatus: productFeedbackStatistic.status,
        score: productFeedbackStatistic.score,
        statistic: productFeedbackStatistic.statistic
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadProductFeedback: productID => dispatch(loadProductFeedback(productID, 'reviews')),
        makingStatistic: reviews => dispatch(makingStatistic(reviews))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductReview)