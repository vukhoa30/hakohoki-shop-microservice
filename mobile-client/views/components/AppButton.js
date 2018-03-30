import React, { Component } from 'react';
import AppText from './AppText'
import { Button, Icon, Spinner } from "native-base";
class AppButton extends Component {
    state = {
    }
    render() {
        const { icon, style, textColor, small, large, onProcess } = this.props
        return (
            <Button {...this.props} iconLeft={icon} style={style}>
                {onProcess ? <Spinner /> : null}
                {icon ? <Icon name={icon} /> : null}
                <AppText small={small} large={large} color={textColor}>{this.props.children}</AppText>
            </Button>
        );
    }
}

export default AppButton;