import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, StyleSheet } from 'react-native'
import { Container, Header, Content, Card, CardItem, Thumbnail, Icon, Left, Body, Spinner, Text, Button, List, ListItem } from 'native-base';
import AppText from './components/AppText'
import AppContainer from './components/AppContainer'
import FeatureList from './components/FeatureList'
import AppButton from './components/AppButton'
import { loadProductFeedback } from "../presenters";

class ProductQA extends Component {

    static navigationOptions = {
        title: 'Q/A'
    }

    constructor(props) {

        super(props)
        const { productID, loadProductFeedback, status } = this.props
        if (status !== 'LOADED')
            loadProductFeedback(productID)

    }

    render() {
        const { comments, status, navigation, productID, loadProductReviewsAndComments } = this.props

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
            <Content style={{ paddingBottom: 50 }}>
                <AppText>Comments here</AppText>
            </Content>
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
    const { productFeedback, selectedProductID } = state.product
    const { status, comments } = productFeedback

    return {
        productID: selectedProductID,
        status,
        comments
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadProductFeedback: productID => dispatch(loadProductFeedback(productID, 'comments'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductQA)