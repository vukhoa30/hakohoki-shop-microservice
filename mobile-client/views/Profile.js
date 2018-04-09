import React, { Component } from 'react';
import { Grid, Row, Icon, Col, Card, CardItem, Container, Content, Badge, List, ListItem, Left, Right, Body } from 'native-base'
import AppContainer from './components/AppContainer'
import AppText from './components/AppText'
import { View, Image, StyleSheet, Dimensions, ImageBackground } from "react-native";
import AppButton from "./components/AppButton";
import AppIconButton from "./components/AppIconButton"
import { connect } from "react-redux";
import { logOut } from "../presenters";

class Profile extends Component {

    static navigationOptions = {
        header: null
    }
    state = {}
    renderAsAnonymousMode() {

        const { navigation } = this.props
        return (
            <Grid>
                <Row size={60}>
                    <Image source={require('../resources/images/profileBackground.jpg')} style={{ resizeMode: 'stretch', width: '100%', height: '100%' }} />
                </Row>
                <Row size={40} style={{ paddingTop: 50 }}>
                    <Container>
                        <AppButton block primary onPress={() => navigation.navigate('LogIn')} style={{ margin: 5 }}>Log in</AppButton>
                        <AppButton block primary bordered onPress={() => navigation.navigate('SignUp')} style={{ margin: 5 }}>Sign up</AppButton>
                    </Container>
                </Row>
            </Grid>
        );

    }

    renderAsLoggedInMode() {

        const { notificationUnreadCount, navigation, logOut, fullName, email, phoneNumber } = this.props
        const { width } = Dimensions.get('window');
        const avatarSize = 100

        const featureList = [
            {
                icon: 'ios-notifications-outline',
                name: 'Notification',
                key: 'NOTIFICATION'
            },
            {
                icon: 'ios-paper-outline',
                name: 'Orders',
                key: 'ORDERS'
            },
            {
                icon: 'md-paper',
                name: 'Watch list',
                key: 'WATCH_LIST'
            }
        ]

        return (
            <Container>
                <Content>
                    <ImageBackground source={{ uri: 'https://opticalcortex.com/app/uploads/2014/08/grad-670x376.jpg' }} style={styles.background}>
                        <Grid>
                            <Col style={{ width: 100, flexDirection: 'column', justifyContent: 'center', marginHorizontal: 20 }}>
                                <Image source={{ uri: 'http://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png', width: avatarSize, height: avatarSize }} />
                            </Col>
                            <Col style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                <AppText color='white' large>{fullName}</AppText>
                                <AppText color='white' small>{email}</AppText>
                                <AppText color='white' small>{phoneNumber}</AppText>
                                <AppButton bordered style={{ marginTop: 5 }} small danger onPress={() => logOut()} >Log out</AppButton>
                            </Col>
                        </Grid>
                    </ImageBackground>
                    <View style={{ marginVertical: 5, flexDirection: 'row', justifyContent: 'center' }}>
                        <AppIconButton name="ios-information-circle-outline" buttonName="Information" />
                        <AppIconButton name="md-key" buttonName="Password" />
                        <AppIconButton name="ios-cart-outline" buttonName="My cart" onPress={() => navigation.navigate('Cart')} />
                    </View>
                    <List style={{ marginVertical: 5 }}>
                        <ListItem icon onPress={() => this.select('WATCH_LIST')} >
                            <Left>
                                <Icon name='md-paper' />
                            </Left>
                            <Body>
                                <AppText>Watch list</AppText>
                            </Body>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );

    }

    select(key) {

        const { navigation } = this.props

        switch (key) {

            case 'NOTIFICATION':
                navigation.navigate('Notification')
                break
            case 'ORDERS':
                break
            case 'WATCH_LIST':
                navigation.navigate('WatchList')
                break

        }

    }


    render() {

        const { isLoggedIn } = this.props
        return isLoggedIn ? this.renderAsLoggedInMode() : this.renderAsAnonymousMode()

    }
}

const styles = StyleSheet.create({
    logo: {
        marginVertical: 150,
        width: 80,
        height: 80,
    },
    background: {
        width: '100%',
        paddingVertical: 20
    }
});

const mapStateToProps = state => {
    return {

        notificationUnreadCount: state.notification.list.filter(notification => !notification.read).length,
        isLoggedIn: state.user.isLoggedIn,
        fullName: state.user.account.fullName,
        phoneNumber: state.user.account.phoneNumber,
        email: state.user.account.email

    }
}

const mapDispatchToProps = dispatch => {
    return {

        logOut: () => dispatch(logOut())

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)