import React, { Component } from 'react';
import { Grid, Row, Icon, Col, Card, CardItem, Container } from 'native-base'
import AppContainer from './components/AppContainer'
import AppText from './components/AppText'
import { View, Image, StyleSheet, Dimensions, ImageBackground } from "react-native";
import AppButton from "./components/AppButton";
import AppIconButton from "./components/AppIconButton"
import FeatureList from "./components/FeatureList"
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
                    <Image source={{ uri: 'https://png.pngtree.com/thumb_back/fw800/back_pic/04/31/19/06584239fd5bff7.jpg', width: '100%', height: '100%' }} style={{ resizeMode: 'stretch' }} />
                </Row>
                <Row size={40} style={{ paddingTop: 50 }}>
                    <Container>
                        <AppButton block primary onPress={() => navigation.navigate('LogIn')} style={{ margin: 5 }}>Đăng nhập</AppButton>
                        <AppButton block primary bordered onPress={() => navigation.navigate('SignUp')} style={{ margin: 5 }}>Đăng ký</AppButton>
                    </Container>
                </Row>
            </Grid>
        );

    }

    renderAsLoggedInMode() {

        const { navigation, logOut } = this.props
        const { width } = Dimensions.get('window');
        const avatarSize = 100

        const featureList = [
            {
                icon: 'ios-notifications-outline',
                name: 'Thông báo',
                key: 'NOTIFICATION'
            },
            {
                icon: 'ios-paper-outline',
                name: 'Đơn hàng',
                key: 'ORDER'
            },
            {
                icon: 'md-paper',
                name: 'Danh sách theo dõi',
                key: 'WATCH_LIST'
            }
        ]

        return (
            <AppContainer>
                <ImageBackground source={{ uri: 'https://opticalcortex.com/app/uploads/2014/08/grad-670x376.jpg' }} style={styles.background}>
                    <Grid>
                        <Col style={{ width: 100, flexDirection: 'column', justifyContent: 'center', marginHorizontal: 20 }}>
                            <Image source={{ uri: 'http://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png', width: avatarSize, height: avatarSize }} />
                        </Col>
                        <Col style={{ flexDirection: 'column', justifyContent: 'center' }}>
                            <AppText color='white' large>TONY</AppText>
                            <AppText color='white' small>duykhoi.bui96@gmail.com</AppText>
                            <AppButton bordered style={{ marginTop: 5 }} small danger onPress={() => logOut()} >Đăng xuất</AppButton>
                        </Col>
                    </Grid>
                </ImageBackground>
                <View style={{ marginVertical: 5, flexDirection: 'row', justifyContent: 'center' }}>
                    <AppIconButton name="ios-information-circle-outline" buttonName="Thông tin" />
                    <AppIconButton name="md-key" buttonName="Đổi mật khẩu" />
                    <AppIconButton name="ios-cart-outline" buttonName="Giỏ hàng" />
                </View>
                <Card style={{ marginVertical: 5 }}>
                    <CardItem>
                        <FeatureList list={featureList} onFeatureSelected={(key) => alert(key)} />
                    </CardItem>
                </Card>
            </AppContainer>
        );

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

        isLoggedIn: state.user.isLoggedIn

    }
}

const mapDispatchToProps = dispatch => {
    return {

        logOut: () => dispatch(logOut())

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)