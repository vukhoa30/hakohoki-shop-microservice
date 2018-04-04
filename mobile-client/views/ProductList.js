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


    static navigationOptions = ({ navigation }) => {

        const { params } = navigation.state

        return {

            title: params && params.category ? params.category : 'Product list'

        }

    }

    constructor(props) {

        super(props)
        const { loadProductList, navigation, list, status } = props
        const { params } = navigation.state
        loadProductList(params, 0, 10)

    }

    render() {
        const { selectProduct, navigation, status, list, loadProductList, offset, limit, setCart } = this.props
        const { params } = navigation.state
        const paramKeys = Object.keys(params)
        const isSearchMode = (params.category && paramKeys.length > 1) || (!params.category && paramKeys.length > 0)
        return (
            <Content>
                {
                    isSearchMode &&
                    <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
                        <AppText note>Tìm kiếm theo</AppText>
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
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 50 }}>
                    {
                        list.map(item => <ProductShowcase key={item._id + new Date().toString()} item={item} onSelected={productID => selectProduct(productID)} />)
                    }
                </View>
                {
                    status === 'LOADING' ?
                        <Spinner /> :
                        status === 'LOADING_FAILED' &&
                        <View style={{ alignItems: 'center' }}>
                            <AppText color='red' small style={{ marginBottom: 10 }}>Could not load data</AppText>
                            <AppButton small warning style={{ alignSelf: 'center' }} onPress={() => this.loadProductList(params, list.length, 10)}>Reload</AppButton>
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

    const { status, data } = state.product.list

    return {

        status,
        list: data,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadProductList: (firstLoad, conditions, offset, limit) => dispatch(loadProductList(firstLoad, conditions, offset, limit)),
        selectProduct: productID => dispatch(selectProduct(productID)),
        setCart: (product, type) => dispatch(setCart(product, type))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)