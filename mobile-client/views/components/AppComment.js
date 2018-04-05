import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Dimensions } from 'react-native'
import { Container, Content, Button, Grid, Col, Body, Icon, Thumbnail } from 'native-base'
import AppText from './AppText'
import { formatTime } from "../../utils";

const { width, height } = Dimensions.get('window')

class AppComment extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    renderStars(reviewScore, large = false) {

        const stars = [];
        let i = 0
        for (; i < reviewScore; i++)
            stars.push(<Icon key={'star-' + i} name="ios-star" style={{ color: 'orange', fontSize: large ? 15 : 10, fontWeight: 'bold', marginVertical: 5 }} />)
        for (; i < 5; i++)
            stars.push(<Icon key={'star-' + i} name="ios-star-outline" style={{ color: 'orange', fontSize: large ? 15 : 10, fontWeight: 'bold', marginVertical: 5 }} />)
        return stars

    }

    render() {
        const { comment } = this.props

        return (
            <Grid style={{ marginVertical: 5 }}>
                <Col style={{ width: width / 4 }}>
                    <Body>
                        <Thumbnail source={{ uri: 'https://medizzy.com/_nuxt/img/user-placeholder.d2a3ff8.png' }} />
                    </Body>
                </Col>
                <Col>
                    <Body>
                        <AppText style={{ fontWeight: 'bold' }}>{comment.userName}</AppText>
                        {
                            comment.reviewScore && <View style={{ flexDirection: 'row' }}>
                                {
                                    this.renderStars(comment.reviewScore)
                                }
                            </View>
                        }
                        <AppText note>{comment.content}</AppText>
                        <AppText note small style={{ marginVertical: 5 }} >{formatTime(comment.createdAt)}</AppText>
                    </Body>

                </Col>
            </Grid>
        )

    }

}

const mapStateToProps = () => ({


})

const mapDispatchToProps = () => ({


})

export default connect(mapStateToProps, mapDispatchToProps)(AppComment)