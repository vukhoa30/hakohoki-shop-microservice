import React, { Component } from 'react';
import { } from 'native-base'
import AppContainer from './components/AppContainer'
import AppText from './components/AppText'

class Home extends Component {
    static navigationOptions = {
        header: null
    }
    state = {}
    render() {
        return (
            <AppContainer>
                <AppText center>Home screen</AppText>
            </AppContainer>
        );
    }
}

export default Home;