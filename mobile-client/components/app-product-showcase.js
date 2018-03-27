import React, { Component } from 'react';
import { StyleSheet, Image } from "react-native";
import { Card, CardItem, Body, Left, Button, Icon } from "native-base";
import AppText from './app-text'

class AppProductShowcase extends Component {
    state = {}

    renderAsSummaryMode(item) {

        return (
            <Card>
                <CardItem>
                    <Body>
                        <Image
                            style={{
                                alignSelf: "center",
                                height: 170,
                                resizeMode: "cover",
                                width: 150,
                                marginVertical: 5
                            }}
                            source={{ uri: item.mainPicture }}
                        />
                        <AppText small>{item.name}</AppText>
                        <AppText small style={{ fontWeight: 'bold' }}>{item.price} VND</AppText>
                    </Body>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button block primary small>
                            <AppText small>Thêm vào giỏ hàng</AppText>
                        </Button>
                    </Left>
                </CardItem>
            </Card>
        );

    }

    renderAsDetailMode(item) {

        return null

    }

    render() {
        const { item, detail } = this.props

        if (!detail)
            return this.renderAsSummaryMode(item)
        return this.renderAsDetailMode(item)

    }
}

export default AppProductShowcase;

const style = {


}