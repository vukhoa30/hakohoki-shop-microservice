import React, { Component } from 'react';
import { Container, Header, Content, Button, Thumbnail, Text, Toast } from 'native-base';
import { StyleSheet, View } from 'react-native';
export default class User extends Component {

    render() {
        const isLoggedIn = this.props.isLoggedIn

        return (
            <Container>
                <Content>
                    <Thumbnail square style={styles.titleImage} source={{ uri: 'http://thedunes.ca/wp-content/uploads/2014/03/online-shopping-2130x840.jpg' }} />
                    {isLoggedIn ?
                        (
                            <List>
                                <ListItem avatar>
                                    <Left>
                                        <Thumbnail source={{ uri: 'https://medizzy.com/_nuxt/img/user-placeholder.d2a3ff8.png' }} />
                                    </Left>
                                    <Body>
                                        <Text>Kumar Pratik</Text>
                                        <Text note>Doing what you like will always keep you happy . .</Text>
                                    </Body>
                                    <Right>
                                        <Text note>3:43 pm</Text>
                                    </Right>
                                </ListItem>
                            </List>
                        ) :
                        (
                            <View>
                                <Text style={styles.notification}>Bạn phải đăng nhập trước</Text>
                                <Button bordered primary block style={styles.button} onPress={() => this.props.navigation.navigate('SignIn')}>
                                    <Text>Đăng nhập</Text>
                                </Button>
                                <Button bordered primary block style={styles.button} onPress={() => this.props.navigation.navigate('SignUp')}>
                                    <Text>Đăng ký</Text>
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
        margin: 10
    },

    titleImage: {
        width: '100%',
        height: 100
    },

    notification: {
        alignSelf: 'center',
        marginTop: 20
    }

})