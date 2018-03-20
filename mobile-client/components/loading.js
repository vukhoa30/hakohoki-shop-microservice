import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default class Loading extends Component {
    render() {
        return (
            <View style={styles.background}>
                <Image
                    style={styles.logo}
                    source={require('../resources/images/logo.png')}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        width: 80,
        height: 80,
    },
    background: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        height: '100%'
    }
});