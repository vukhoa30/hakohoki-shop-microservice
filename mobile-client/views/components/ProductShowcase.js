import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from "react-native";
import { Card, CardItem, Left, Body, Icon, Button, Right } from "native-base";
import { currencyFormat } from "../../utils";
import AppText from './AppText'

class ProductShowcase extends Component {
    state = {}
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
        const { item, onSelected } = this.props
        return (
            <TouchableOpacity style={{ width: '50%' }} onPress={() => onSelected(item._id)}>
                <Card style={{ flex: 0, minHeight: 350 }}>
                    <CardItem>
                        <Left>
                            <Body>
                                <AppText small style={{ fontWeight: 'bold' }}>{item.name}</AppText>
                                <AppText note small>Quantity: {item.quantity}</AppText>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Image source={{ uri: item.mainPicture && item.mainPicture !== '' ? item.mainPicture : 'https://vignette.wikia.nocookie.net/yade/images/d/dd/Unknown.png/revision/latest?cb=20070619224801' }} style={{ width: '100%', height: 200 }} />
                            {
                                item.promotionPrice ?
                                    <View>
                                        <AppText note style={{ textDecorationLine: 'line-through', marginTop: 10 }}>{currencyFormat(item.price)}</AppText>
                                        <AppText style={{ fontSize: 20, color: 'red' }}>{currencyFormat(item.promotionPrice)}</AppText>
                                    </View> :
                                    <AppText style={{ fontSize: 20, color: 'red', marginTop: 10 }}>{currencyFormat(item.price)}</AppText>
                            }
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            {/* {
                                item.quantity > 0 &&
                                    item.isAddedToCart ?
                                    <Button danger small iconLeft onPress={() => onSetCart(item, 'REMOVE')}>
                                        <Icon name='close' style={{ fontSize: 12 }} />
                                        <AppText small>Cart</AppText>
                                    </Button> :
                                    <Button success small iconLeft>
                                        <Icon name='add' style={{ fontSize: 12 }} onPress={() => onSetCart(item, 'ADD')} />
                                        <AppText small>Cart</AppText>
                                    </Button>
                            } */}
                        </Left>
                        <Right>
                            <View style={{ alignSelf: 'flex-end', flexDirection: 'row' }}>
                                {
                                    this.renderStars(item.reviewScore || 0)
                                }
                            </View>
                            <AppText small style={{ alignSelf: 'flex-end' }}>{item.reviewCount || 0} reviews</AppText>
                        </Right>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        );
    }
}

export default ProductShowcase;