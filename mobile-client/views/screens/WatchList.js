import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { Spinner, Content, H1, Button, Grid, Col, Thumbnail, Card, CardItem, Icon, Body } from "native-base";
import AppText from '../components/AppText'
import AppContainer from '../components/AppContainer'
import FeatureList from '../components/FeatureList'
import AppButton from '../components/AppButton'
import ProductShowcase from '../components/ProductShowcase'
import { loadWatchList, selectProduct, removeFromWatchlist } from "../../api";
import { alert, currencyFormat, confirm } from "../../utils";

const { width, height } = Dimensions.get('window')

class WatchList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            lockLoading: false,
        }
        const { token, isLoggedIn, navigation, loadWatchList, status } = this.props
        if (!isLoggedIn) {
            alert('error', 'You need to log in first')
            navigation.navigate('LogIn')
        }
        else if (status !== 'LOADED') loadWatchList(token, 0, 10)

    }

    componentWillReceiveProps(nextProps) {

        if (this.props.status === 'LOADING' && (nextProps.status === 'LOADED' || nextProps.status === 'LOADING_FAILED'))
            this.setState({ lockLoading: false })

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


    isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
    }

    render() {
        const { status, list, selectProduct, navigation, loadWatchList, token, removeFromWatchlist } = this.props
        return (
            <Content>
                <View>
                    {
                        list.length > 0 ?
                            <View>{
                                list.map(item =>
                                    <TouchableOpacity key={item._id} onPress={() => selectProduct({ product: item, productId: item._id })}>
                                        <Card style={{ width: '100%', marginVertical: 5, paddingRight: 5 }}>
                                            <CardItem>
                                                <Body>
                                                    <Grid>
                                                        <Col style={{ width: width / 2 }} >
                                                            <Thumbnail source={{ uri: item.mainPicture }} style={{ resizeMode: 'stretch', width: '100%', height: height / 4, alignItems: 'center' }} />
                                                        </Col>
                                                        <Col>
                                                            <AppText style={{ fontWeight: 'bold' }}>{item.name}</AppText>
                                                            {
                                                                item.quantity > 0 ?
                                                                    <AppText small note>Quantity: {item.quantity}</AppText> :
                                                                    <AppText small style={{ fontWeight: 'bold', color: 'red' }}>Sold out</AppText>
                                                            }
                                                            {
                                                                item.promotionPrice ?
                                                                    <View style={{ flexDirection: 'row' }}>
                                                                        <AppText small note style={{ marginRight: 10, textDecorationLine: 'line-through' }}>{currencyFormat(item.price)}</AppText>
                                                                        <AppText small color='red'>{currencyFormat(item.promotionPrice)}</AppText>
                                                                    </View> :
                                                                    <AppText small color='red'>{currencyFormat(item.price)}</AppText>
                                                            }
                                                            <View style={{ flexDirection: 'row' }}>
                                                                {
                                                                    this.renderStars(item.reviewScore || 0)
                                                                }
                                                                <AppText small style={{ alignSelf: 'flex-end' }} note>({item.reviewCount || 0})</AppText>
                                                            </View>
                                                            <Button block danger small onPress={() => {
                                                                confirm('Confirm', `Are you sure to remove product "${item.name}" from your watch list?`, () => removeFromWatchlist(item._id, token, 0, list.length))
                                                            }} >
                                                                <AppText small>
                                                                    Remove
                                                            </AppText>
                                                            </Button>
                                                        </Col>
                                                    </Grid>
                                                </Body>
                                            </CardItem>
                                        </Card>
                                    </TouchableOpacity>
                                )
                            }
                                {
                                    status === 'LOADED' &&
                                    <Button light block onPress={() => loadWatchList(token, list.length, 10)} >
                                        <AppText>Load more products ...</AppText>
                                    </Button>
                                }
                            </View>
                            : (status === 'LOADED' && <AppText note style={{ marginTop: 100, alignSelf: 'center' }}>NO PRODUCTS</AppText>)
                    }
                </View>
                {
                    status === 'LOADING' ?
                        <Spinner style={{ alignSelf: 'center' }} /> :
                        status === 'LOADING_FAILED' &&
                        <View style={{ alignItems: 'center' }}>
                            <AppText color='red' small style={{ marginBottom: 10 }}>Could not load data</AppText>
                            <AppButton small warning style={{ alignSelf: 'center' }} onPress={() => loadWatchList(token, list.length, 10)}>Reload</AppButton>
                        </View>
                }
            </Content >
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

    const { status, list, needToUpdate } = state.watchList
    const { token, isLoggedIn } = state.user

    return {

        needToUpdate,
        status,
        list,
        token,
        isLoggedIn

    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadWatchList: (token, offset, limit) => dispatch(loadWatchList(token, offset, limit)),
        selectProduct: productInfo => dispatch(selectProduct(productInfo)),
        removeFromWatchlist: (productId, token, offset, limit) => dispatch(removeFromWatchlist(productId, token, offset, limit))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WatchList)