import React, { Component } from 'react';
import { Text } from "native-base";
class AppText extends Component {
    state = {}
    render() {
        const { bold, color, small, large, center, children, onPress } = this.props
        const fontWeight = bold ? { fontWeight: 'bold' } : {}
        const colorObj = color ? { color: color } : {}
        const fontSize = small ? { fontSize: 12 } : large ? { fontSize: 20 } : {}
        const centerObj = center ? { alignSelf: 'center' } : {}
        const style = Object.assign(fontWeight, colorObj, fontSize, centerObj, this.props.style)
        return (
            <Text {...this.props} style={style}>{children}</Text>
        );
    }
}

export default AppText;