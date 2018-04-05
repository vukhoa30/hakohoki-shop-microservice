import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import { setCart } from '../presenters'
import { Container, Content, Button, SwipeRow, List, ListItem, Right, Body, Icon, Thumbnail, FooterTab, Footer } from 'native-base'
import AppText from './components/AppText'
import { currencyFormat, confirm } from "../utils";
import { reduce } from "lodash";

class Cart extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { setCart, totalPrice, list } = this.props
        return (
            <Container>
                <Content>
                    {
                        list.length > 0 ?
                            <List dataArray={list} renderRow={product => (
                                <ListItem>
                                    <Thumbnail square size={80} source={{ uri: product.mainPicture }} />
                                    <Body>
                                        <AppText>{product.name}</AppText>
                                        <AppText color='red'>{currencyFormat(product.price)}</AppText>
                                    </Body>
                                    <Right>
                                        <Icon name='md-remove-circle' style={{ color: 'red' }} onPress={() => {
                                            confirm('Confirm', `Are you sure to remove product "${product.name}" from your cart?`,() => setCart(product, 'REMOVE'))
                                        }} />
                                    </Right>
                                </ListItem>
                            )} />
                            :
                            <View style={{ width: '100%', height: 250, alignItems: 'center', justifyContent: 'center' }}>
                                <AppText note large>NO PRODUCTS</AppText>
                            </View>
                    }
                </Content>
                <AppText style={{ fontWeight: 'bold', alignSelf: 'flex-end', marginVertical: 10, marginRight: 10 }}>Total: {currencyFormat(totalPrice)}</AppText>
                <Footer>
                    <FooterTab>
                        <View style={{ width: '100%' }}>
                            <Button block warning disabled={list.length === 0} small>
                                <AppText>
                                    CHECK OUT
                                </AppText>
                            </Button>
                        </View>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }

}

const mapStateToProps = (state) => ({

    list: state.cart.list,
    totalPrice: reduce(state.cart.list, (result, product) => result + product.price, 0)

})

const mapDispatchToProps = (dispatch) => ({

    setCart: (product, type) => dispatch(setCart(product, type))

})

export default connect(mapStateToProps, mapDispatchToProps)(Cart)