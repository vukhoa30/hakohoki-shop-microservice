import React, { Component } from 'react';
import { View } from "react-native";
import { Icon } from "native-base";
import AppText from "./AppText"
class AppIconButton extends Component {
    state = {}
    render() {
        const { buttonName, color, selected, smallSize } = this.props
        return (
            <View style={[{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 }]} >
                <Icon {...this.props} style={{ fontSize: smallSize ? 20 : 50, color: selected ? 'red' : color ? color : 'black' }} />
                {
                    !smallSize && <AppText small color={selected ? 'red' : color} >{buttonName}</AppText>
                }
            </View>
        );
    }
}

export default AppIconButton;