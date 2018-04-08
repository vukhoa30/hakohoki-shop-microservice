import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { selectProduct, makeNotificationAsRead, loadNotifications } from '../presenters'
import { Spinner, Container, Content, Button, List, ListItem, Left, Icon, Body } from 'native-base'
import AppText from './components/AppText'

class Notification extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        const { token, loadNotifications } = this.props
        loadNotifications(token)
    }

    renderNotification(notification) {

        const { type, productId, productName, amount, promotionId, promotionName } = notification
        const { selectProduct, makeNotificationAsRead } = this.props

        let title = 'Unknown notification', content = '', callback = () => { }

        switch (type) {

            case 'almostOutOfStock':
                title = 'Product unavailable soon'
                content = `The quantity of product ${productName} is only ${amount}`
                callback = () => selectProduct(productId)
                break
            case 'goodsReceipt':
                title = 'Product available'
                content = `The product ${productName} is available now`
                callback = () => selectProduct(productId)
                break
            case 'commentReplied':
                title = 'Comment replied!'
                content = `Your comment about product ${productName} has been replied`
                break
            case 'promotionCreated':
                title = 'New promotion coming up!'
                content = `${promotionName}`
                break
            case 'productBough':
                title = 'New order has been made!'
                content = `You have made an order for product ${productName}`
                break

        }


        return (
            <Body>
                <AppText style={{ fontWeight: 'bold' }} onPress={() => { makeNotificationAsRead(notification._id); callback() }} >{title}</AppText>
                <AppText note>{content}</AppText>
            </Body>
        )


    }

    render() {
        const { status, list, loadNotifications, token } = this.props

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
                        <Button small warning style={{ alignSelf: 'center' }} onPress={() => loadNotifications(token)} >
                            <AppText>
                                Reload
                            </AppText>
                        </Button>
                    </View>
                )

        }

        return (
            <Container>
                <Content>
                    <List dataArray={list} renderRow={notification =>
                        <ListItem key={'notification-' + notification._id} >
                        </ListItem>
                    } />
                </Content>
            </Container>
        )
    }

}

const mapStateToProps = (state) => {

    const { isLoggedIn, token } = state.user
    const { status, list } = state.notification

    return {

        isLoggedIn,
        token,
        status,
        list

    }

}


const mapDispatchToProps = (dispatch) => ({

    selectProduct: productId => dispatch(selectProduct(productId)),
    makeNotificationAsRead: notificationId => dispatch(makeNotificationAsRead(notificationId)),
    loadNotifications: token => dispatch(loadNotifications(token))

})

export default connect(mapStateToProps, mapDispatchToProps)(Notification)