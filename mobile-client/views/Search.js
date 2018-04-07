import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { View, Dimensions } from 'react-native'
import { Container, Content, Button, Form, Spinner, Item, Input, Icon } from 'native-base'
//import { Header, SearchBar } from 'react-native-elements'
import AppText from './components/AppText'
import { SearchBar } from 'react-native-elements'

const { width } = Dimensions.get('window')

class Search extends Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {}

        return {

            headerTitle:
                <View style={{ flexDirection: 'row', width: '100%' }} onPress={() => navigation.navigate('Search')}>
                    <SearchBar
                        noIcon={true}
                        inputStyle={{ backgroundColor: 'transparent', fontSize: 17, color: 'white' }}
                        placeholderTextColor='white'
                        containerStyle={{ backgroundColor: 'transparent', width: '100%' }}
                        lightTheme
                        placeholder='Search for product...'
                        blurOnSubmit={true}
                        onSubmitEditing={params.search}
                        autoFocus={true}
                    />
                </View>,
            headerRight: <View />

        }

    }

    constructor(props) {
        super(props)
        this.state = {}
        this.search = this.search.bind(this)
    }

    componentWillMount() {
        this.props.navigation.setParams({ search: this.search });
    }

    search(text) {
        const { navigation } = this.props
        const q = text.nativeEvent.text
        if (q.length > 0)
            navigation.navigate('ProductList', { q })
        return true
    }

    render() {
        const { error, invalid, submitting, handleSubmit, navigation } = this.props
        return (
            <Container>
                <Content>
                    <View>
                    </View>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({


})

const mapDispatchToProps = (dispatch) => ({


})

const ReduxForm = reduxForm({
    form: 'search_form',
    touchOnBlur: false,
    enableReinitialize: true,
    onSubmitFail: () => { },
    validate: values => {
        const errors = {}
        return errors
    },
})(Search)

export default connect(mapStateToProps, mapDispatchToProps)(ReduxForm)