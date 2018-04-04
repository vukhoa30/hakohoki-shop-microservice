import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Image, StyleSheet } from 'react-native'
import { Spinner, Content } from "native-base";
import AppText from './components/AppText'
import AppContainer from './components/AppContainer'
import FeatureList from './components/FeatureList'
import AppButton from './components/AppButton'
import { loadCategories, selectCategory } from "../presenters";

class Categories extends Component {

    static navigationOptions = {
        title: 'Categories',
    }

    constructor(props) {

        super(props)
        this.state = {
            firstLoad: true,
            status: 'LOADING',
            list: []
        }
    }

    componentDidMount() {

        if (this.state.firstLoad) {
            this.setState({ firstLoad: false })
            this.loadData()
        }

    }

    async loadData() {

        this.setState({ status: 'LOADING' })
        const result = await loadCategories()

        if (result.ok) {
            this.setState({ status: 'LOADED', list: result.list })
        } else {
            this.setState({ status: 'LOADING_FAILED' })
        }

    }

    render() {
        const { list, status } = this.state
        const { selectCategory } = this.props


        switch (status) {

            case 'LOADING':
                return (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Spinner />
                    </View>
                )
            case 'LOADING_FAILED':
                return (
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <AppText color='red' small style={{ marginBottom: 10 }}>Could not load data</AppText>
                        <AppButton small warning style={{ alignSelf: 'center' }} onPress={() => this.loadData()} >Reload</AppButton>
                    </View>
                )

        }

        return (
            <Content>
                <FeatureList list={list} onFeatureSelected={category => selectCategory(category)} />
            </Content>
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

const mapStateToProps = state => ({


})

const mapDispatchToProps = dispatch => ({

    selectCategory: category => dispatch(selectCategory(category))

})

export default connect(mapStateToProps, mapDispatchToProps)(Categories)