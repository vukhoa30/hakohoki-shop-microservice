import React, { Component } from 'react';
import { View } from "react-native";
import { Icon } from "native-base";
import AppText from "./AppText"
class AppIconButton extends Component {
    state = {}
    render() {
        const { buttonName } = this.props
        return (
            <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Icon {...this.props} style={{ fontSize: 50 }} />
                <AppText small>{buttonName}</AppText>
            </View>
        );
    }
}

export default AppIconButton;