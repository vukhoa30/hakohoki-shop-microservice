import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, StyleSheet } from 'react-native'
import { Container, Header, Content, Card, CardItem, Thumbnail, Icon, Left, Body, Spinner, Text, Button, List, ListItem, Footer, FooterTab, Grid, Col } from 'native-base';
import AppText from './components/AppText'
import AppContainer from './components/AppContainer'
import FeatureList from './components/FeatureList'
import AppButton from './components/AppButton'
import AppProductFooter from './components/AppProductFooter'
import { loadProductInformation } from "../presenters";
import { currencyFormat, alert, confirm } from "../utils";

class ProductInformation extends Component {

    static navigationOptions = {
        title: 'Information'
    }

    constructor(props) {

        super(props)
        const { loadProductInformation, token, productId } = this.props
        loadProductInformation(productId, token)
    }

    render() {
        const { token, status, data, productId } = this.props
        const outOfOrder = require('../resources/images/sold-out.png')

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
                        <AppButton small warning style={{ alignSelf: 'center' }} onPress={() => loadProductInformation(productId, token)} >Reload</AppButton>
                    </View>
                )

        }

        return (
            <Container>
                <Content>
                    <Card style={{ flex: 1 }}>
                        {
                            data.sold5OrOver &&
                            <Image source={require('../resources/images/hot-sale.png')} style={{ right: 0, zIndex: 100, width: 100, height: 100, position: 'absolute', resizeMode: 'stretch' }} />
                        }
                        {
                            data.quantity === 0 &&
                            <Image source={outOfOrder} style={{ width: '80%', height: 200, position: 'absolute', zIndex: 100, resizeMode: 'stretch', top: 140, left: 20 }} />
                        }
                        <CardItem>
                            <Left>
                                <Body>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{data.name}</Text>
                                    <Text note>Guarantee {data.guarantee} months</Text>
                                    <AppText note small style={{ opacity: data.quantity > 0 ? 1 : 0 }}>Quantity: {data.quantity}</AppText>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Image source={{ uri: data.mainPicture && data.mainPicture !== '' ? data.mainPicture : 'https://vignette.wikia.nocookie.net/yade/images/d/dd/Unknown.png/revision/latest?cb=20070619224801' }} style={{ height: 350, width: '100%', flex: 1, resizeMode: 'stretch' }} />
                                <Text style={{ fontSize: 30, fontWeight: 'bold', alignSelf: 'center', marginTop: 20, color: 'red' }}>
                                    {currencyFormat(data.price)}
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text style={{ fontWeight: 'bold' }}>
                                    Mô tả
                            </Text>
                                <Text>
                                    {data.description}
                                </Text>
                            </Body>
                        </CardItem>
                    </Card>
                    {
                        data.additionPicture && data.additionPicture.length > 0 ?
                            <Card>
                                <CardItem header>
                                    <Text>Những hình ảnh khác</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <List dataArray={data.additionPicture} horizontal={true}
                                            renderRow={(item, index) =>
                                                <ListItem key={'picture-' + index}>
                                                    <Image source={{ uri: item, width: 200, height: 170, resizeMode: 'stretch' }} />
                                                </ListItem>
                                            }>
                                        </List>
                                    </Body>
                                </CardItem>
                            </Card> : null
                    }
                    {
                        data.specifications && data.specifications.length > 0 ?
                            <Card>
                                <CardItem header>
                                    <Text>Specifications</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        {
                                            data.specifications.map((specification, index) => (

                                                <View key={'specification-' + index} style={{ width: '100%' }}>
                                                    {
                                                        Object.keys(specification).map(key => (
                                                            <Grid key={'specification-item-' + key} style={{ marginVertical: 5 }} >
                                                                <Col>
                                                                    <AppText small style={{ fontWeight: 'bold' }}>{key}</AppText>
                                                                </Col>
                                                                <Col>
                                                                    <AppText small>{specification[key]}</AppText>
                                                                </Col>
                                                            </Grid>
                                                        ))
                                                    }
                                                </View>

                                            ))
                                        }
                                    </Body>
                                </CardItem>
                            </Card> : null

                    }
                </Content>
                <AppProductFooter />
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

    const { token } = state.user
    const { status, data, productId } = state.product

    return {
        token,
        productId,
        status,
        data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadProductInformation: (productId, token) => dispatch(loadProductInformation(productId, token))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductInformation)