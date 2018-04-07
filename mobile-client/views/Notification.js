import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { } from '../presenters'
import { Container, Content, Button } from 'native-base'
import AppText from './components/AppText'

class Notification extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Container>
                <Content>
                </Content>
            </Container>
        )
    }

}

const mapStateToProps = () => ({


})

const mapDispatchToProps = () => ({


})

export default connect(mapStateToProps, mapDispatchToProps)(Notification)