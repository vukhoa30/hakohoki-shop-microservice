import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, StyleSheet } from 'react-native'
import { Spinner } from "native-base";
import AppText from './components/AppText'
import AppContainer from './components/AppContainer'
import FeatureList from './components/FeatureList'
import AppButton from './components/AppButton'
import ProductShowcase from './components/ProductShowcase'
import { loadProductList, loadProductDetail } from "../presenters";

class ProductList extends Component {


    static navigationOptions = ({ navigation }) => {

        const { params } = navigation.state
        return {
            title: params ? params.selectedCategory : 'Unknown category',
        }

    }

    constructor(props) {

        super(props)
        const { params } = this.props.navigation.state
        this.props.loadProductList(params.selectedCategory)

    }

    render() {
        const { list, status, loadProductList, loadProductDetail, navigation } = this.props
        const { selectedCategory } = navigation.state.params

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
                        <AppButton small warning style={{ alignSelf: 'center' }} onPress={() => loadProductList(selectedCategory)} >Reload</AppButton>
                    </View>
                )

        }

        return (
            <AppContainer>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 50 }}>
                    {
                        list.map(item => <ProductShowcase key={item._id} item={item} onSelected={productID => loadProductDetail(productID)}/>)
                    }
                </View>
            </AppContainer>
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
    const { status, data } = state.product.productList

    return {
        status: status,
        list: data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadProductList: category => dispatch(loadProductList(category)),
        loadProductDetail: productID => dispatch(loadProductDetail(productID))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)