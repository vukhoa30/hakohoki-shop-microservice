import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { setCart, setWatchList, logOut } from '../../presenters'
import { Container, Content, Button, Footer, FooterTab, Grid, Col, Icon, Spinner } from 'native-base'
import AppText from './AppText'
import { alert, confirm } from "../../utils";

class AppProductFooter extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        console.log(props.data)
    }

    render() {
        const { needToUpdateWatchList, isAddedToCart, data, token, status, setCart, setWatchList } = this.props

        return (
            <Footer>
                <FooterTab >
                    <View style={{ width: '100%' }}>
                        <Grid>
                            <Col>
                                {
                                    isAddedToCart ?
                                        <Button danger full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                            confirm('Confirm', `Are you sure to remove product "${data.name}" from your cart?`, () => setCart(data, 'REMOVE'))
                                        }}>
                                            <Icon name='close' />
                                            <AppText>CART</AppText>
                                        </Button> :
                                        <Button disabled={data.quantity === 0} success full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                            setCart(data, 'ADD')
                                            alert('Success', 'Product has been added to cart')
                                        }}>
                                            <Icon name='add' />
                                            <AppText>CART</AppText>
                                        </Button>
                                }
                            </Col>
                            <Col>
                                {
                                    status === 'WATCH_LIST_STATUS_FETCHING' ?
                                        <Button block disabled>
                                            <Spinner />
                                        </Button> :
                                        data.existsInWatchlist ?
                                            <Button warning full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                                confirm('Confirm', `Are you sure to remove product "${data.name}" from your watch list?`, () => setWatchList(data._id, 'REMOVE', token, needToUpdateWatchList))
                                            }}>
                                                <Icon name='close' />
                                                <AppText>WATCH LIST</AppText>
                                            </Button> :
                                            <Button primary full small iconLeft style={{ flexDirection: 'row' }} onPress={() => {
                                                setWatchList(data._id, 'ADD', token, needToUpdateWatchList)
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

    const { list: cardList } = state.cart
    const { id, status, data } = state.product.current
    const { token, isLoggedIn } = state.user
    const { status: watchListStatus } = state.watchList

    return {

        needToUpdateWatchList: watchListStatus !== 'INIT',
        token,
        status,
        data,
        isAddedToCart: cardList.find(product => product._id === id)

    }

}

const mapDispatchToProps = (dispatch) => ({

    setCart: (product, type) => dispatch(setCart(product, type)),
    setWatchList: (id, type, token) => dispatch(setWatchList(id, type, token)),
    logOut: () => dispatch(logOut())

})

export default connect(mapStateToProps, mapDispatchToProps)(AppProductFooter)