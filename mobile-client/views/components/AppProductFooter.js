import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { setCart, updateWatchList, logOut, loadWatchList, updateWatchListStateOfProduct } from '../../presenters'
import { Container, Content, Button, Footer, FooterTab, Grid, Col, Icon, Spinner } from 'native-base'
import AppText from './AppText'
import { alert, confirm } from "../../utils";

class AppProductFooter extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isWatchListUpdating: false
        }
    }

    render() {
        const { logOut, token, isLoggedIn, isAvailableInCart, isAvailableInWatchList, product, setCart } = this.props

        return (
            <Footer>
                <FooterTab >
                    <View style={{ width: '100%' }}>
                        <Grid>
                            <Col>
                                {
                                    isAvailableInCart ?
                                        <Button danger full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                            confirm('Confirm', `Are you sure to remove product "${product.name}" from your cart?`, () => setCart(product, 'REMOVE'))
                                        }}>
                                            <Icon name='close' />
                                            <AppText>CART</AppText>
                                        </Button> :
                                        <Button disabled={product.quantity === 0} success full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                            setCart(product, 'ADD')
                                            alert('Success', 'Product has been added to cart')
                                        }}>
                                            <Icon name='add' />
                                            <AppText>CART</AppText>
                                        </Button>
                                }
                            </Col>
                            <Col>
                                {
                                    this.state.isWatchListUpdating ?
                                        <Button block disabled>
                                            <Spinner />
                                        </Button> :
                                        isAvailableInWatchList ?
                                            <Button warning full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                                if (!isLoggedIn)
                                                    logOut()
                                                else
                                                    confirm('Confirm', `Are you sure to remove product "${product.name}" from your watch list?`, () => updateWatchList.call(this, 'REMOVE'))
                                            }}>
                                                <Icon name='close' />
                                                <AppText>WATCH LIST</AppText>
                                            </Button> :
                                            <Button primary full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                                if (!isLoggedIn)
                                                    logOut()
                                                else
                                                    updateWatchList.call(this, 'ADD')
                                            }}>
                                                <Icon name='add' />
                                                <AppText>WATCH LIST</AppText>
                                            </Button>

                                }
                            </Col>
                        </Grid>
                    </View>
                </FooterTab>
            </Footer>
        )
    }

}

const mapStateToProps = (state) => {

    const { status, data } = state.product
    const { list: cartList } = state.cart
    const { token, isLoggedIn } = state.user
    const { list: watchList } = state.watchList

    return {

        isLoggedIn,
        watchList,
        token,
        product: data,
        isAvailableInCart: cartList.find(product => product._id === data._id),
        isAvailableInWatchList: data !== null ? data.existsInWatchlist : false,

    }

}

const mapDispatchToProps = (dispatch) => ({

    setCart: (product, type) => dispatch(setCart(product, type)),
    logOut: () => dispatch(logOut()),
    loadWatchList: (token, offset, length) => dispatch(loadWatchList(token, offset, length)),
    updateWatchListStateOfProduct: (existsInWatchlist) => dispatch(updateWatchListStateOfProduct(existsInWatchlist))

})

export default connect(mapStateToProps, mapDispatchToProps)(AppProductFooter)