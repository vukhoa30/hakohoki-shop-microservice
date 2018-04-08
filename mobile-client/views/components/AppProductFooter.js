import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { setCart, addOrRemoveProductFromWatchList, logOut } from '../../presenters'
import { Container, Content, Button, Footer, FooterTab, Grid, Col, Icon, Spinner } from 'native-base'
import AppText from './AppText'
import { alert, confirm } from "../../utils";

class AppProductFooter extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { logOut, token, isLoggedIn, isAvailableInCart, isAvailableInWatchList, product, isUpdatingWatchListStatus, setCart } = this.props

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
                                    isUpdatingWatchListStatus ?
                                        <Button block disabled>
                                            <Spinner />
                                        </Button> :
                                        isAvailableInWatchList ?
                                            <Button warning full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                                if (!isLoggedIn)
                                                    logOut()
                                                else
                                                    confirm('Confirm', `Are you sure to remove product "${product.name}" from your watch list?`, () => console.log('Hello'))
                                            }}>
                                                <Icon name='close' />
                                                <AppText>WATCH LIST</AppText>
                                            </Button> :
                                            <Button primary full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                                if (!isLoggedIn)
                                                    logOut()
                                                else
                                                    console.log('Hello')
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

    const { status, productId, data } = state.product
    const { list: cartList } = state.cart
    const { token, isLoggedIn } = state.user

    return {

        isLoggedIn,
        token,
        product: data,
        isAvailableInCart: cartList.find(product => product._id === data._id),
        isAvailableInWatchList: data !== null ? data.existsInWatchlist : false,
        isUpdatingWatchListStatus: status === 'WATCH_LIST_STATUS_UPDATING'

    }

}

const mapDispatchToProps = (dispatch) => ({

    setCart: (product, type) => dispatch(setCart(product, type)),
    addOrRemoveProductFromWatchList: (productId, token, type, watchList, updateCurrentProduct) => dispatch(addOrRemoveProductFromWatchList(productId, token, type, watchList, updateCurrentProduct)),
    logOut: () => dispatch(logOut())
})

export default connect(mapStateToProps, mapDispatchToProps)(AppProductFooter)