import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, StyleSheet, Alert } from 'react-native'
import { Container, Header, Content, Card, CardItem, Thumbnail, Icon, Left, Body, Spinner, Text, Button, List, ListItem, Footer, FooterTab } from 'native-base';
import AppText from './components/AppText'
import AppContainer from './components/AppContainer'
import FeatureList from './components/FeatureList'
import AppButton from './components/AppButton'
import { loadProductInformation, setCart } from "../presenters";
import { currencyFormat } from "../utils";

class ProductInformation extends Component {

    static navigationOptions = {
        title: 'Information'
    }

    constructor(props) {

        super(props)
        const { loadProductInformation, productID } = props
        loadProductInformation(productID)

    }

    render() {
        const { status, data, setCart, isAddedToCart } = this.props

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
                        <AppButton small warning style={{ alignSelf: 'center' }} onPress={() => this.loadData()} >Reload</AppButton>
                    </View>
                )

        }

        return (
            <Container>
                <Content>
                    <Card style={{ flex: 1 }}>
                        <CardItem>
                            <Left>
                                <Body>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{data.name}</Text>
                                    <Text note small>Số lượng: {data.quantity}</Text>
                                    <Text note>Bảo hàng {data.guarantee} năm</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Image source={{ uri: data.mainPicture }} style={{ height: 350, width: '100%', flex: 1, resizeMode: 'stretch' }} />
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
                                    <Text>Chi tiết sản phẩm</Text>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <List dataArray={data.specifications} horizontal={true}
                                            renderRow={(item, index) =>
                                                <ListItem key={'specification-' + index}>
                                                    <Left>
                                                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                                    </Left>
                                                    <Body>
                                                        <Text>{item.value}</Text>
                                                    </Body>
                                                </ListItem>
                                            }>
                                        </List>
                                    </Body>
                                </CardItem>
                            </Card> : null

                    }
                </Content>
                <Footer>
                    <FooterTab >
                        <View style={{ width: '100%' }}>
                            {
                                isAddedToCart ?
                                    <Button danger full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                        Alert.alert('Confirm', `Are you sure to remove product "${data.name}" from your cart?`, [
                                            { text: 'Cancel', style: 'cancel' },
                                            { text: 'OK', onPress: () => setCart(data, 'REMOVE') },
                                        ], )
                                    }}>
                                        <Icon name='close' />
                                        <AppText>REMOVE FROM CART</AppText>
                                    </Button> :
                                    <Button success full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                        setCart(data, 'ADD')
                                        Alert.alert('Success', 'Product has been added to cart')
                                    }}>
                                        <Icon name='add' />
                                        <AppText>ADD TO CART</AppText>
                                    </Button>
                            }
                        </View>
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

    const { current } = state.product
    const { list } = state.cart
    const { id, info } = current
    const { status, data } = info

    return {
        productID: id,
        status,
        data,
        isAddedToCart: list.find(product => product._id === id)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadProductInformation: productID => dispatch(loadProductInformation(productID)),
        setCart: (product, type) => dispatch(setCart(product, type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductInformation)