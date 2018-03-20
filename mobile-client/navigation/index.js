import React, { Component } from 'react'
import { connect } from "react-redux"
import { addNavigationHelpers } from "react-navigation";
import {
    createReduxBoundAddListener
} from 'react-navigation-redux-helpers';
import NavigationConfig from "./navigation-config";

const addListener = createReduxBoundAddListener("root");

class AppNavigation extends Component {
    render() {
        const { dispatch, navState } = this.props;
        return (
            <NavigationConfig navigation={addNavigationHelpers({ dispatch, state: navState, addListener })} />
        );
    }
}

const mapStateToProps = state => {
    return {
        navState: state.nav
    };
};

export default connect(mapStateToProps)(AppNavigation);