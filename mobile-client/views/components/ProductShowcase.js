import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from "react-native";
import { Card, CardItem, Left, Body, Icon, Button, Right } from "native-base";
import { currencyFormat, reduceString } from "../../utils";
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
        const outOfOrder = require('../../resources/images/sold-out.png')
        return (
            <TouchableOpacity style={{ width: '100%' }} onPress={() => onSelected(item._id)}>
                <Card style={{ flex: 0, minHeight: 350 }}>
                    {
                        item.sold5OrOver &&
                        <Image source={require('../../resources/images/hot-sale.png')} style={{ right: 0, zIndex: 100, width: 50, height: 50, position: 'absolute', resizeMode: 'stretch' }} />
                    }
                    {
                        item.quantity === 0 &&
                        <Image source={outOfOrder} style={{ width: 140, height: 70, position: 'absolute', zIndex: 100, resizeMode: 'stretch', top: 140, left: 20 }} />
                    }
                    <CardItem>
                        <Left>
                            <Body>
                                <AppText small style={{ fontWeight: 'bold', zIndex: 101 }}>{reduceString(item.name)}</AppText>
                                <AppText note small style={{ opacity: item.quantity > 0 ? 1 : 0 }}>Quantity: {item.quantity}</AppText>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Image source={{ uri: item.mainPicture && item.mainPicture !== '' ? item.mainPicture : 'https://vignette.wikia.nocookie.net/yade/images/d/dd/Unknown.png/revision/latest?cb=20070619224801' }} style={{ width: '100%', height: 200 }} />
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Body style={{ flexDirection: 'row' }}>
                            {
                                item.promotionPrice ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <AppText small note style={{ marginRight: 10, textDecorationLine: 'line-through' }}>{currencyFormat(item.price)}</AppText>
                                        <AppText small color='red'>{currencyFormat(item.promotionPrice)}</AppText>
                                    </View> :
                                    <AppText small color='red'>{currencyFormat(item.price)}</AppText>
                            }
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Body style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
                            {
                                this.renderStars(item.reviewScore || 0)
                            }
                            <AppText small style={{ alignSelf: 'flex-end' }} note>({item.reviewCount || 0})</AppText>
                        </Body>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        );
    }
}

export default ProductShowcase;