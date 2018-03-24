import React, { Component } from 'react';
import { connect } from 'react-redux'
import appStyles from '../styles'
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import { Thumbnail, Container, Content, Header, DeckSwiper, Card, CardItem, Left, Body, Icon, Input, Button, Item, List, ListItem, Grid, Col } from 'native-base'
import Swiper from 'react-native-swiper';

var styles = StyleSheet.create({
    wrapper: {
        overflow: 'visible',
        borderWidth: 1
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
    }
})

class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            width: '99%',
        };

    }

    componentWillMount() {
        setTimeout(() => {
            this.setState({
                width: '100%',
            });
        }, 500);
    }

    render() {

        const { ads, newestProducts } = this.props

        return (
            <Container>
                <View style={{ backgroundColor: '#0B5353', paddingVertical: 10 }}>
                    <Thumbnail style={{ height: 50, width: 150, marginBottom: 10, alignSelf: 'center' }} source={{ uri: 'https://vignette.wikia.nocookie.net/logopedia/images/e/e7/Shopee-700x217.png/revision/latest?cb=20170128004048' }} />
                    <Item style={{ width: '90%', alignSelf: 'center', backgroundColor: 'white', paddingHorizontal: 10, height: 35 }}>
                        <Icon active name="search" />
                        <Input placeholder="Search" />
                        <Icon active name="ios-notifications" />
                    </Item>
                </View>
                <Content>
                    <View style={{ flex: 1 }}>
                        <Swiper width={this.state.width} height={200} activeDotColor="black" loop={true}>
                            {
                                ads.map((item, key) => {
                                    return (
                                        <View key={"ads-" + key} style={{ flex: 1 }}>
                                            <Image style={{ height: 200, width: null, flex: 1, resizeMode: 'stretch' }} source={{ uri: item.image }} />
                                        </View>
                                    )
                                })
                            }
                        </Swiper>
                    </View>
                    <View style={{ margin: 10, flexDirection: 'row', alignSelf: 'center' }}>
                        <Grid>
                            <Col>
                                <Icon name='md-bulb' style={[appStyles.center, appStyles.iconButton, appStyles.iconButtonTheme1, { paddingHorizontal: 11 }]} />
                                <Text style={appStyles.center}>Hướng dẫn</Text>
                            </Col>
                            <Col>
                                <Icon name='ios-color-wand' style={[appStyles.center, appStyles.iconButton, appStyles.iconButtonTheme2, { paddingHorizontal: 12 }]} />
                                <Text style={appStyles.center}>Các đợt khuyến mãi</Text>
                            </Col>
                        </Grid>
                    </View>
                    <View>
                        <Card style={{ flex: 0, padding: 0 }}>
                            <CardItem>
                                <Left>
                                    <Body>
                                        <Text style={{ color: 'gray' }}>SẢN PHẨM MỚI NHẤT</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <List dataArray={newestProducts}
                                        horizontal={true}
                                        renderRow={(item) =>
                                            <ListItem>
                                                {/* <Card style={{ padding: 0 }}>
                                                    <CardItem style={{ padding: 0 }}>
                                                        <Body style={{ padding: 0 }}>
                                                            <Image source={{ uri: item.mainPicture === '' ? 'http://www.jaaymasn.com/wp-content/uploads/2018/03/iphone-x-kf-device-tab-d-3-retina.png' : item.mainPicture }} style={{ height: 150, width: 150, resizeMode: 'stretch' }} />
                                                            <Text style={appStyles.center}>
                                                                {item.name}
                                                            </Text>
                                                        </Body>
                                                    </CardItem>
                                                </Card> */}
                                                <View style={[appStyles.card,{ paddingBottom: 20 }]}>
                                                    <Text style={appStyles.price}>{item.price ? item.price : '???' } VND</Text>
                                                    <Image source={{ uri: item.mainPicture === '' ? 'http://www.jaaymasn.com/wp-content/uploads/2018/03/iphone-x-kf-device-tab-d-3-retina.png' : item.mainPicture }} style={{ height: 150, width: 150, resizeMode: 'stretch' }} />
                                                    <Text style={appStyles.center}>
                                                        {item.name}
                                                    </Text>
                                                </View>
                                            </ListItem>
                                        }>
                                    </List>
                                </Body>
                            </CardItem>
                        </Card>
                    </View>
                </Content>
            </Container >
        );

    }
}

const mapStateToProps = state => {
    return {
        ads: [
            {
                image: 'https://s3-ap-southeast-1.amazonaws.com/s3.loopme.my/img/newos/posts/d/9970_kPunvIdgpVvH62ag_.jpg',
                link: 'adsfasd'
            },
            {
                image: 'http://www.themalaymailonline.com/uploads/articles/2017/2017-12/shoppee_5_111217.jpg',
                link: 'adsfasd'
            }

        ],

        newestProducts: [
            {
                "additionPicture": [],
                "addedAt": "2018-03-22T14:11:10.075Z",
                "_id": "5ab3bc590507400a44611ae6",
                "mainPicture": "",
                "category": "Phone",
                "name": "Xiaomi Redmi 5A",
                "description": "very noice",
                "price": 90,
                "__v": 0
            },
            {
                "additionPicture": [],
                "addedAt": "2018-03-19T04:32:17.110Z",
                "_id": "5aaf4f1118f25a2864033e26",
                "mainPicture": "",
                "category": "Phone",
                "name": "HTC U11 Plus",
                "description": "Good overall, trust me",
                "__v": 0
            }
        ]
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)