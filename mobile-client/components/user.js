import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux'
import { USER_LOG_OUT, getAction } from '../actions'
import { List, ListItem, Left, Right, Body, Container, Header, Content, Button, Thumbnail, Text, Toast } from 'native-base';
import { StyleSheet, View, ImageBackground } from 'react-native';
class User extends Component {

    render() {
        const isLoggedIn = this.props.isLoggedIn

        return (
            <Container>
                <Content>
                    {isLoggedIn ?
                        (
                            <View>
                                <ImageBackground style={styles.titleImage} source={{ uri: 'http://thedunes.ca/wp-content/uploads/2014/03/online-shopping-2130x840.jpg' }}>
                                    <List>
                                        <ListItem avatar>
                                            <Left>
                                                <Thumbnail source={{ uri: 'https://medizzy.com/_nuxt/img/user-placeholder.d2a3ff8.png' }} />
                                            </Left>
                                            <Body>
                                                <Text style={{ color: 'white' }}>TONY</Text>
                                            </Body>
                                            <Right>
                                                <Ionicons name='ios-log-out' style={{ fontSize: 30, color: 'red', fontWeight: 'bold' }} onPress={() => this.props.logOut()}/>
                                            </Right>
                                        </ListItem>
                                    </List>
                                </ImageBackground>
                                <Button block success style={{ margin: 5 }}>
                                    <Text>Đổi mật khẩu</Text>
                                </Button>
                                <Button block style={styles.button}>
                                    <Text style={styles.buttonText}>Thông tin cá nhân</Text>
                                </Button>
                                <Button block style={styles.button}>
                                    <Text style={styles.buttonText}>Đơn hàng của bạn</Text>
                                </Button>
                                <Button block style={styles.button}>
                                    <Text style={styles.buttonText}>Lịch sử mua hàng</Text>
                                </Button>
                            </View>
                        ) :
                        (
                            <View>
                                <ImageBackground style={styles.titleImage} source={{ uri: 'http://thedunes.ca/wp-content/uploads/2014/03/online-shopping-2130x840.jpg' }}>
                                    <List>
                                        <ListItem avatar>
                                            <Left>
                                                <Thumbnail source={{ uri: 'https://medizzy.com/_nuxt/img/user-placeholder.d2a3ff8.png' }} />
                                            </Left>
                                            <Body>
                                                <Text style={{ color: 'white'}}>Đăng nhập để xem thông tin người dùng</Text>
                                            </Body>
                                        </ListItem>
                                    </List>
                                </ImageBackground>
                                <Button style={styles.button} block onPress={() => this.props.navigation.navigate('SignIn')}>
                                    <Text style={styles.buttonText}>Đăng nhập</Text>
                                </Button>
                                <Button style={styles.button} block onPress={() => this.props.navigation.navigate('SignUp')}>
                                    <Text style={styles.buttonText}>Đăng ký</Text>
                                </Button>
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

    buttonText: {
        color: 'black'
    },

    titleImage: {
        width: '100%',
        paddingTop: 100,
        paddingBottom: 10
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