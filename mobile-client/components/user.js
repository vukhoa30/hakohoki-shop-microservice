import React, { Component } from 'react';
import { connect } from 'react-redux'
import { USER_LOG_OUT, getAction } from '../actions'
import { List, ListItem, Left, Right, Body, Container, Header, Content, Button, Thumbnail, Text, Toast, Icon, Grid, Col, Title, CardItem, Card } from 'native-base';
import { StyleSheet, View, ImageBackground } from 'react-native';
import appStyles from '../styles'

class User extends Component {

    render() {
        const { isLoggedIn, navigation } = this.props
        const titleImage = require('../resources/images/title.png')

        return (
            <Container style={appStyles.background}>
                <Content>
                    {
                        isLoggedIn ?
                            (
                                <View>
                                    <View style={{ backgroundColor: '#0B5353', paddingVertical: 10 }}>
                                        <Thumbnail style={{ height: 50, width: 200, marginBottom: 10, alignSelf: 'center', resizeMode: 'stretch' }} source={titleImage} />
                                        <Grid>
                                            <Col size={75}>
                                                <List>
                                                    <ListItem avatar>
                                                        <Left>
                                                            <Thumbnail style={{ width: 50, height: 50 }} source={{ uri: 'https://image.flaticon.com/icons/png/512/149/149071.png' }} />
                                                        </Left>
                                                        <Body>
                                                            <Text style={{ color: 'white' }}>JOHN DOE</Text>
                                                        </Body>
                                                    </ListItem>
                                                </List>
                                            </Col>
                                            <Col size={25}>
                                                <Icon style={{ marginTop: 10, alignSelf: 'center', color: 'red' }} name='log-out' onPress={() => this.props.logOut()}/>
                                            </Col>
                                        </Grid>
                                    </View>
                                    <Card style={{ width: '80%', alignSelf: 'center', borderRadius: 25, paddingVertical: 10, marginTop: 20 }}>
                                        <CardItem >
                                            <Grid>
                                                <Col>
                                                    <View style={{ alignSelf: 'center' }}>
                                                        <Icon name="ios-key" style={[styles.iconButton, { color: 'green' }]} />
                                                        <Text style={{ alignSelf: 'center', fontSize: 10 }}>Đổi mật khẩu</Text>
                                                        <Icon name="ios-notifications" style={[styles.iconButton, { color: 'yellow' }]} />
                                                        <Text style={{ alignSelf: 'center', fontSize: 10 }}>Thông báo</Text>
                                                    </View>
                                                </Col>
                                                <Col>
                                                    <View style={{ alignSelf: 'center' }}>
                                                        <Icon name="information-circle" style={[styles.iconButton, { color: 'blue' }]} />
                                                        <Text style={{ alignSelf: 'center', fontSize: 10 }}>Thông tin cá nhân</Text>
                                                        <Icon name="ios-cart" style={[styles.iconButton, { color: 'orange' }]} />
                                                        <Text style={{ alignSelf: 'center', fontSize: 10 }}>Giỏ hàng</Text>
                                                    </View>
                                                </Col>
                                            </Grid>
                                        </CardItem>
                                    </Card>
                                    <List style={{ marginTop: 20 }}>
                                        <ListItem icon>
                                            <Left>
                                                <Icon name="md-paper" />
                                            </Left>
                                            <Body>
                                                <Text style={appStyles.mediumText}>Đơn hàng của tôi</Text>
                                            </Body>
                                        </ListItem>
                                        <ListItem icon>
                                            <Left>
                                                <Icon name="md-list-box" />
                                            </Left>
                                            <Body>
                                                <Text style={appStyles.mediumText}>Lịch sử mua hàng</Text>
                                            </Body>
                                        </ListItem>
                                        <ListItem icon>
                                            <Left>
                                                <Icon name="ios-paper" />
                                            </Left>
                                            <Body>
                                                <Text style={appStyles.mediumText}>Danh sách theo dõi</Text>
                                            </Body>
                                        </ListItem>
                                    </List>
                                </View>
                            ) :
                            (
                                <View>
                                    <View style={{ backgroundColor: '#0B5353', paddingVertical: 10 }}>
                                        <Thumbnail style={{ height: 50, width: 150, marginBottom: 10, alignSelf: 'center' }} source={{ uri: 'https://vignette.wikia.nocookie.net/logopedia/images/e/e7/Shopee-700x217.png/revision/latest?cb=20170128004048' }} />
                                        <Grid>
                                            <Col size={75}>
                                                <List>
                                                    <ListItem avatar>
                                                        <Left>
                                                            <Thumbnail style={{ width: 50, height: 50 }} source={{ uri: 'https://image.flaticon.com/icons/png/512/149/149071.png' }} />
                                                        </Left>
                                                        <Body>
                                                            <Text style={{ color: 'white' }}>Vui lòng đăng nhập</Text>
                                                        </Body>
                                                    </ListItem>
                                                </List>
                                            </Col>
                                            <Col size={25}>
                                            </Col>
                                        </Grid>
                                    </View>
                                    <View style={{ marginTop: 100, marginHorizontal: 50 }}>
                                        <Button success block style={[appStyles.button, { marginBottom: 20 }]} onPress={() => navigation.navigate('Account')}>
                                            <Text>
                                                Đăng nhập
                                                    </Text>
                                        </Button>
                                        <Button warning block style={appStyles.button} onPress={() => navigation.navigate('SignUp')}>
                                            <Text>
                                                Đăng ký
                                                    </Text>
                                        </Button>
                                    </View>
                                </View>
                            )
                    }
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({

    button: {
        margin: 5,
        backgroundColor: '#CFD0D0',
    },

    iconButton: {

        fontSize: 40,
        marginVertical: 15,
        alignSelf: 'center'

    },

    buttonText: {
        color: 'black'
    },

    titleImage: {
        width: '100%'
    },

    fullImage: {
        width: '100%',
        height: 500
    },

    notification: {
        alignSelf: 'center',
        marginTop: 20
    }

})

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logOut: () => {
            dispatch(getAction(USER_LOG_OUT))
        }
    }
}

const UserContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(User)

export default UserContainer