import React, { Component } from 'react';
import { StyleSheet } from "react-native";
import { Text } from "native-base";

class AppText extends Component {
    state = {}
    render() {
        const { small, large, color } = this.props

        return (
            <Text style={[small ? { fontSize: 12 } : large ? { fontSize: 20 } : {}, color ? { color: color } : {}, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
}

export default AppText;

const style = {


}