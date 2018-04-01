import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, StyleSheet } from 'react-native'
import { Spinner, Content } from "native-base";
import AppText from './components/AppText'
import AppContainer from './components/AppContainer'
import FeatureList from './components/FeatureList'
import AppButton from './components/AppButton'
import { loadCategories } from "../presenters";

class Categories extends Component {

    static navigationOptions = {
        title: 'Categories',
        showIcon: false
    }

    constructor(props) {

        super(props)
        this.props.loadCategories()

    }

    render() {
        const { list, status, loadCategories, navigation } = this.props

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
                        <AppButton small warning style={{ alignSelf: 'center' }} onPress={() => loadCategories()} >Reload</AppButton>
                    </View>
                )

        }

        return (
            <Content>
                <FeatureList list={list} onFeatureSelected={key => navigation.navigate('ProductList', {
                    selectedCategory: key
                })} />
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
    const { status, data } = state.product.categories
    return {
        status: status,
        list: data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadCategories: () => dispatch(loadCategories())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories)