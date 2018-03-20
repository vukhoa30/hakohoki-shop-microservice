import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Thumbnail, Icon, Left } from 'native-base';
import { StyleSheet } from 'react-native'

export default class SignIn extends Component {
    render() {
        return (
            <Container style={{ backgroundColor: '#1D144B' }}>
                <Content>
                    <Button success bordered rounded style={{ margin: 10 }}  onPress={() => this.props.navigation.navigate('User') }>
                        <Icon name='arrow-back' />
                    </Button>
                    <Thumbnail square style={styles.titleImage} source={{ uri: 'http://pettigrewspecialty.com/wp-content/uploads/2016/08/ShopOnline.png' }} />
                    <Form style={{ width: '90%', alignSelf: 'center', marginTop: 50 }}>
                        <Item floatingLabel last>
                            <Label style={styles.whiteText}>Email</Label>
                            <Input style={styles.whiteText} />
                        </Item>
                        <Item floatingLabel last>
                            <Label style={styles.whiteText}>Mật khẩu</Label>
                            <Input style={styles.whiteText} />
                        </Item>
                        <Item floatingLabel last>
                            <Label style={styles.whiteText}>Nhập lại mật khẩu</Label>
                            <Input style={styles.whiteText} />
                        </Item>
                        <Button block success style={{ marginTop: 30 }}>
                            <Text>Đăng ký</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({

    whiteText: {
        color: 'white'
    },

    titleImage: {
        alignSelf: 'center',
        width: '60%',
        height: 100,
        marginTop: 100
    }

})
