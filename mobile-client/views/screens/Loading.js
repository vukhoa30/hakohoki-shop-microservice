import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, StyleSheet } from 'react-native'
import { loadUserInfo } from "../../api";

class Loading extends Component {
    state = {}
    constructor(props) {
        super(props)
        this.props.loadUserInfo()
    }
    render() {
        return (
            <View style={styles.background}>
                <Image
                    style={styles.logo}
                    source={require('../../resources/images/logo.png')}
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

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUserInfo: () => dispatch(loadUserInfo())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading)