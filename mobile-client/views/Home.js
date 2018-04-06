import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Image, ScrollView, StyleSheet, Dimensions } from 'react-native'
import { selectProduct, loadNewestProducts } from '../presenters'
import { Container, Content, Button, List, ListItem, Spinner, Card, CardItem, Body, Left, Right, Icon, DeckSwiper } from 'native-base'
import AppText from './components/AppText'
import AppButton from './components/AppButton'
import ProductShowcase from "./components/ProductShowcase";
import { currencyFormat } from "../utils";
// import Carousel from 'react-native-carousel';

// const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window')

// function wp(percentage) {
//     const value = (percentage * viewportWidth) / 100;
//     return Math.round(value);
// }

// const slideHeight = viewportHeight * 0.36;
// const slideWidth = wp(75);
// const itemHorizontalMargin = wp(2);

// export const sliderWidth = viewportWidth;
// export const itemWidth = slideWidth + itemHorizontalMargin * 2;

// const styles = StyleSheet.create({
//     wrapper: {
//     },
//     slide1: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#9DD6EB',
//     },
//     slide2: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#97CAE5',
//     },
//     slide3: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#92BBD9',
//     },
//     text: {
//         color: '#fff',
//         fontSize: 30,
//         fontWeight: 'bold',
//     }
// })

class Home extends Component {

    static navigationOptions = {
        
        headerTitle:
            <View style={{ flexDirection: 'row', paddingLeft: 20 }}>
                <Image source={require('../resources/images/logoTitle.png')} style={{ width: 30, height: 30, resizeMode: 'stretch' }} />
                <Image source={require('../resources/images/title.png')} style={{ marginLeft: 10, width: 150, height: 30, resizeMode: 'stretch' }} />
            </View>


    }
    constructor(props) {
        super(props)
        this.state = {
            firstLoad: true,
            newestProducts: {
                status: 'LOADING',
                list: []
            },
            slider1ActiveSlide: 1
        }
    }

    renderStars(reviewScore, large = false) {

        const stars = [];
        let i = 0
        for (; i < reviewScore; i++)
            stars.push(<Icon key={'star-' + i} name="ios-star" style={{ color: 'orange', fontSize: large ? 15 : 10, fontWeight: 'bold', marginVertical: 5 }} />)
        for (; i < 5; i++)
            stars.push(<Icon key={'star-' + i} name="ios-star-outline" style={{ color: 'orange', fontSize: large ? 15 : 10, fontWeight: 'bold', marginVertical: 5 }} />)
        return stars

    }

    componentDidMount() {

        if (this.state.firstLoad) {
            this.setState({ firstLoad: false })
            this.loadNewestProducts()
        }

    }

    async loadNewestProducts() {

        this.setState({
            newestProducts: {
                status: 'LOADING',
                list: []
            }
        })
        const result = await loadNewestProducts()

        if (result.ok) {
            this.setState({ newestProducts: { status: 'LOADED', list: result.list } })
        } else {
            this.setState({
                newestProducts: {
                    status: 'LOADING_FAILED',
                    list: []
                }
            })
        }

    }

    renderList(listType) {

        const listObj = this.state[listType]
        const { status, list } = listObj
        const { selectProduct } = this.props

        switch (status) {

            case 'LOADING':
                return (
                    <CardItem style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Spinner />
                    </CardItem>
                )
            case 'LOADING_FAILED':
                return (
                    <CardItem style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <AppText color='red' small style={{ marginBottom: 10 }}>Could not load data</AppText>
                        <AppButton small warning style={{ alignSelf: 'center' }} onPress={() => this.loadNewestProducts()} >Reload</AppButton>
                    </CardItem>
                )
            default:
                return list.length > 0 ?
                    (
                        <ScrollView horizontal>
                            {
                                list.map(item => <View key={item._id} style={{ width: 200 }}><ProductShowcase onSelected={productID => selectProduct(productID)} item={item} /></View>)
                            }
                        </ScrollView>
                    ) :
                    (
                        <CardItem>
                            <Body style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' }}>
                                <AppText note >NO PRODUCTS FOUND</AppText>
                            </Body>
                        </CardItem>
                    )

        }


    }

    _renderItem({ item, index }) {
        return (
            <View key={'promotion-' + index} style={{ width: '100%' }}>
                <Image style={{ width: '100%', height: 200 }} source={{ uri: item.image }} />
            </View>
        );
    }

    render() {

        const { status, list } = this.state.newestProducts
        const { navigation } = this.props
        const entries = [
            {
                id: 1,
                image: 'http://nonglamfood.com/wp-content/uploads/2018/01/khuyenmai.png'
            },
            {
                id: 2,
                image: 'http://luatthanhthai.vn/wp-content/uploads/2018/01/khuyen-mai.jpg'
            }
        ]
        return (
            <Container>
                <Content style={{ paddingBottom: 100 }}>
                    <View style={{ minHeight: 300 }}>
                        <DeckSwiper
                            dataSource={entries}
                            renderItem={item =>
                                <Card key={'promotion-' + new Date()} >
                                    <CardItem cardBody>
                                        <Image style={{ height: 250, flex: 1 }} source={{ uri: item.image }} />
                                    </CardItem>
                                </Card>
                            }
                        />
                    </View>
                    <View style={{ marginVertical: 5 }}>
                        <Card>
                            <CardItem header>
                                <AppText>NEWEST PRODUCTS</AppText>
                                {
                                    status === 'LOADED' && list.length > 0 &&
                                    <Right>
                                        <AppText note onPress={() => navigation.navigate('ProductList', { newest: true })} >See all >>></AppText>
                                    </Right>
                                }
                            </CardItem>
                            {
                                this.renderList('newestProducts')
                            }
                        </Card>
                    </View>
                </Content>
            </Container>
        )
    }

}

const mapStateToProps = (state) => ({


})

const mapDispatchToProps = (dispatch) => ({

    selectProduct: productID => dispatch(selectProduct(productID))

})

export default connect(mapStateToProps, mapDispatchToProps)(Home)