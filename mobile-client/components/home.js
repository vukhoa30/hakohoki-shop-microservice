import React, { Component } from 'react';
import { connect } from 'react-redux'
import appStyles from '../styles'
import {
    StyleSheet,
    View,
    Image
} from 'react-native';
import { Thumbnail, Container, Content, Header, DeckSwiper, Card, CardItem, Left, Body, Icon, Input, Button, Item, List, ListItem, Grid, Col, Spinner, Text } from 'native-base'
import Swiper from 'react-native-swiper';
import { loadNewestProducts } from '../actions/async-process'

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
        this.props.loadNewestProducts()
    }

    componentWillMount() {
        setTimeout(() => {
            this.setState({
                width: '100%',
            });
        }, 500);
    }

    renderNewestProductList() {

        const { state, data } = this.props.newestProducts
        const { loadNewestProducts } = this.props

        switch (state) {

            case 'LOADING':
                return (<Spinner style={appStyles.center} />)
            case 'LOADING_FAILED':
                return (
                    <View style={appStyles.center}>
                        <Text style={[appStyles.center, appStyles.errorText]}>Load dữ liệu thất bại</Text>
                        <Button style={[appStyles.center, { margin: 10 }]} onPress={() => loadNewestProducts()}>
                            <Text>Reload</Text>
                        </Button>
                    </View>
                )
            default:
                return (
                    <List dataArray={data}
                        horizontal={true}
                        renderRow={(item) =>
                            <ListItem>
                                <View style={[appStyles.card, { paddingBottom: 20 }]}>
                                    <Text style={[appStyles.price,{ alignSelf: 'flex-start' }]}>{item.price ? item.price : '???'} VND</Text>
                                    <Image source={{ uri: item.mainPicture === '' ? 'https://www.stellarinfo.com/blog/wp-content/uploads/2017/02/error-thinkstock-100655502-primary.idge_.jpg' : item.mainPicture }} style={{ height: 150, width: 150, resizeMode: 'stretch' }} />
                                    <Text style={appStyles.center}>
                                        {item.name}
                                    </Text>
                                </View>
                            </ListItem>
                        }>
                    </List>
                )

        }

    }

    render() {

        const { ads, newestProducts } = this.props
        const titleImage = require('../resources/images/title.png')

        return (
            <Container>
                <View style={{ backgroundColor: '#0B5353', paddingVertical: 10 }}>
                    <Thumbnail style={{ height: 50, width: 200, marginBottom: 10, alignSelf: 'center', resizeMode: 'stretch' }} source={titleImage} />
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
                                <Text style={[appStyles.center, { fontSize: 10 }]}>Hướng dẫn</Text>
                            </Col>
                            <Col>
                                <Icon name='ios-color-wand' style={[appStyles.center, appStyles.iconButton, appStyles.iconButtonTheme2, { paddingHorizontal: 12 }]} />
                                <Text style={[appStyles.center, { fontSize: 10 }]}>Các đợt khuyến mãi</Text>
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
                                    {
                                        this.renderNewestProductList()
                                    }
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

        newestProducts: state.data.newestProducts
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadNewestProducts: () => dispatch(loadNewestProducts())
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)