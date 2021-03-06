import React, { Component } from 'react';
import AppText from './AppText'
import { Button, Icon, Spinner } from "native-base";
class AppButton extends Component {
    state = {
    }
    render() {
        const { icon, style, textColor, small, large, processing, textStyle } = this.props
        return (
            <Button {...this.props} iconLeft={icon} style={style}>
                {processing ? <Spinner /> : null}
                {icon ? <Icon name={icon} /> : null}
                <AppText small={small} large={large} color={textColor} style={textStyle}>{this.props.children}</AppText>
            </Button>
        );
    }
}

export default AppButton;