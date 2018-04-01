import React, { Component } from 'react';
import { Content } from 'native-base'
import AppContainer from './components/AppContainer'
import AppText from './components/AppText'

class Home extends Component {
    static navigationOptions = {
        header: null
    }
    state = {}
    render() {
        return (
            <Content>
                <AppText center>Home screen</AppText>
            </Content>
        );
    }
}

export default Home;