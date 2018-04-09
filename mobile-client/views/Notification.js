import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { selectProduct, makeNotificationAsRead, loadNotifications } from '../presenters'
import { Spinner, Container, Content, Button, List, ListItem, Left, Icon, Body } from 'native-base'
import AppText from './components/AppText'
import { formatTime } from "../utils";

class Notification extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        const { token, loadNotifications, status } = this.props
        if (status !== 'LOADED')
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
                content = `Your comment about product with ID "${productId}" has been replied`
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

        console.log(notification.read)

        return (
            <Body>
                <AppText style={notification.read ? {} : { fontWeight: 'bold' }} onPress={() => { makeNotificationAsRead(notification._id); callback() }} >{title}</AppText>
                <AppText style={notification.read ? {} : { fontWeight: 'bold' }} note>{content}</AppText>
                <AppText style={notification.read ? {} : { fontWeight: 'bold' }} small note >{formatTime(notification.createdAt)}</AppText>
            </Body>
        )


    }

    render() {
        const { connectionStatus, status, list, loadNotifications, token, makeNotificationAsRead } = this.props

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
                        <AppText color='red' small style={{ marginBottom: 10 }} >Could not load data</AppText>
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
                    {
                        connectionStatus === 'CONNECTING' &&
                        <AppText color='green' center small >Attemping to connect to server ...</AppText>
                    }
                    {
                        connectionStatus === 'NOT_CONNECTED' &&
                        <View style={{ width: '100%', backgroundColor: 'orange', paddingVertical: 10 }} >
                            <AppText color='red' center small >Could not connect to server! Tap to reconnect</AppText>
                        </View>
                    }
                    <List dataArray={list} renderRow={notification =>
                        <ListItem key={'notification-' + notification._id} onPress={() => !notification.read && makeNotificationAsRead(token,notification._id)} >
                            {
                                this.renderNotification(notification)
                            }
                        </ListItem>
                    } />
                </Content>
            </Container>
        )
    }

}

const mapStateToProps = (state) => {

    const { isLoggedIn, token } = state.user
    const { status, list, connectionStatus } = state.notification

    return {

        connectionStatus,
        isLoggedIn,
        token,
        status,
        list

    }

}


const mapDispatchToProps = (dispatch) => ({

    selectProduct: productId => dispatch(selectProduct(productId)),
    makeNotificationAsRead: (token,notificationId) => dispatch(makeNotificationAsRead(token,notificationId)),
    loadNotifications: token => dispatch(loadNotifications(token))

})

export default connect(mapStateToProps, mapDispatchToProps)(Notification)