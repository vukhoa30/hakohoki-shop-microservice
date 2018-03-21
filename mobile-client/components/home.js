import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Image } from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Card, CardItem, Content, Separator, List, ListItem, Body } from 'native-base';
class Home extends Component {
    
    render() {
        var items = ['Simon Mignolet', 'Nathaniel Clyne', 'Dejan Lovren', 'Mama Sakho', 'Emre Can'];
        return (
            <Container>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Tìm kiếm sản phẩm" />
                        <Icon name="ios-notifications" />
                    </Item>
                </Header>
                <Content>
                    <Card>
                        <CardItem>
                            <Image source={{ uri: 'http://slvrdlphn.com/wp-content/uploads/2017/11/sale-at-lazada.jpg' }} style={{ height: 200, width: '100%' }} />
                        </CardItem>
                    </Card>
                    <Separator bordered>
                        <Text style={{ fontSize: 15, padding: 10 }}>PHỔ BIẾN NHẤT</Text>
                    </Separator>
                    <List dataArray={items}
                        horizontal={true}
                        renderRow={(item) =>
                            <ListItem>
                                <Card>
                                    <CardItem>
                                        <Body>

                                            <Image source={{ uri: 'http://slvrdlphn.com/wp-content/uploads/2017/11/sale-at-lazada.jpg' }} style={{ height: 100, width: 100 }} />
                                            <Text>
                                                {item}
                                            </Text>

                                        </Body>
                                    </CardItem>
                                </Card>
                            </ListItem>
                        }>
                    </List>
                    <Separator bordered>
                        <Text style={{ fontSize: 15, padding: 10 }}>MỚI NHẤT</Text>
                    </Separator>
                    <List dataArray={items}
                        horizontal={true}
                        renderRow={(item) =>
                            <ListItem>
                                <Card>
                                    <CardItem>
                                        <Body>

                                            <Image source={{ uri: 'http://slvrdlphn.com/wp-content/uploads/2017/11/sale-at-lazada.jpg' }} style={{ height: 100, width: 100 }} />
                                            <Text>
                                                {item}
                                            </Text>

                                        </Body>
                                    </CardItem>
                                </Card>
                            </ListItem>
                        }>
                    </List>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

const HomeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)

export default HomeContainer