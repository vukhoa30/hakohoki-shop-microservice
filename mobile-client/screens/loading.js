import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { checkUserSession } from '../actions'
import { connect } from 'react-redux'

class Loading extends Component {

    constructor(props) {
        super(props)
        this.props.checkingUserState()
    }

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

const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = dispatch => {
    return {
        checkingUserState: () => dispatch(checkUserSession())
    }
}

const LoadingContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Loading)

export default LoadingContainer