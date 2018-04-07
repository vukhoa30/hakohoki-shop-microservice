import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, StyleSheet } from 'react-native'
import { Spinner, Content, H1, Button } from "native-base";
import AppText from './components/AppText'
import AppContainer from './components/AppContainer'
import FeatureList from './components/FeatureList'
import AppButton from './components/AppButton'
import ProductShowcase from './components/ProductShowcase'
import { loadProductList, selectProduct } from "../presenters";

class ProductList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            status: 'FIRST_LOAD',
            list: [],
            offset: 0,
            limit: 10
        }

    }

    componentDidMount() {

        const { status, offset, limit } = this.state
        if (status === 'FIRST_LOAD') {
            this.loadData()
        }
    }

    async loadData() {

        const { offset, limit } = this.state
        const { navigation } = this.props
        const { params } = navigation.state
        this.setState({ status: 'LOADING' })

        const result = await loadProductList(params, offset, limit)
        const { ok, data } = result

        if (ok) {
            this.setState({ status: 'LOADED', list: data, offset: data.length })
        } else {
            this.setState({ status: 'LOADING_FAILED' })
        }

    }

    render() {
        const { navigation, setCart, selectProduct } = this.props
        const { status, list } = this.state
        const { params } = navigation.state
        const paramKeys = Object.keys(params)
        const isSearchMode = !params.newest && ((params.category && paramKeys.length > 1) || (!params.category && paramKeys.length > 0))
        return (
            <Content>
                {
                    isSearchMode &&
                    <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
                        <AppText note>Search by:</AppText>
                        <View style={{ flexDirection: 'row' }}>
                            {
                                Object.keys(params).map(key => {

                                    return key === 'category' ? null :
                                        <Button key={'key-' + key} light small style={{ margin: 5 }}>
                                            <AppText>{key}={params[key]}</AppText>
                                        </Button>

                                })
                            }
                        </View>
                    </View>
                }
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 50, justifyContent: 'center' }}>
                    {
                        list.length > 0 ?
                            list.map(item => <View key={item._id} style={{ width: '50%' }}><ProductShowcase onSelected={productID => selectProduct(productID)} item={item} /></View>)
                            : (status === 'LOADED' && <AppText note style={{ marginTop: 100 }}>NO PRODUCTS FOUND</AppText>)
                    }
                </View>
                {
                    status === 'LOADING' ?
                        <Spinner /> :
                        status === 'LOADING_FAILED' &&
                        <View style={{ alignItems: 'center' }}>
                            <AppText color='red' small style={{ marginBottom: 10 }}>Could not load data</AppText>
                            <AppButton small warning style={{ alignSelf: 'center' }} onPress={() => this.loadData()}>Reload</AppButton>
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

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => {
    return {
        setCart: (product, type) => dispatch(setCart(product, type)),
        selectProduct: (productId) => dispatch(selectProduct(productId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)