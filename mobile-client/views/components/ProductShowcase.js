import React, { Component } from 'react';
import { Image, TouchableOpacity, View } from "react-native";
import { Card, CardItem, Left, Body } from "native-base";
import { currencyFormat } from "../../utils";
import AppText from './AppText'

class ProductShowcase extends Component {
    state = {}
    render() {
        const { item, onSelected } = this.props
        return (
            <TouchableOpacity style={{ width: '50%'}} onPress={() => onSelected(item._id)}>
                <Card style={{ flex: 0, minHeight: 350 }}>
                    <CardItem>
                        <Left>
                            <Body>
                                <AppText small style={{ fontWeight: 'bold' }}>{item.name}</AppText>
                                <AppText note small>Số lượng: {item.quantity}</AppText>
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
                                        <AppText style={{ fontSize: 20, color: 'red'}}>{currencyFormat(item.promotionPrice)}</AppText>
                                    </View> :
                                    <AppText style={{ fontSize: 20, color: 'red', marginTop: 10 }}>{currencyFormat(item.price)}</AppText>
                            }
                        </Body>
                    </CardItem>
                </Card>
            </TouchableOpacity>
        );
    }
}

export default ProductShowcase;