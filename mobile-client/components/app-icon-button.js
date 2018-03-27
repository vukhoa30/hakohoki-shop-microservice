import React, { Component } from 'react';
import { StyleSheet } from "react-native";
import AppText from './app-text'
import { Button } from "native-base";

class AppIconButton extends Component {
    state = {}
    render() {
        return (
            <Button style={style} {...this.props} />
        );
    }
}

export default AppIconButton;

const style = {



}