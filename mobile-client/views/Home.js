import React, { Component } from "react";
import { Platform, ScrollView, View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Container, Header, Title, Content, Button, Icon, Right, Body, Left, Picker, Form, Item, Spinner, Input } from "native-base";
import { connect } from 'react-redux'
import { loadProductList, loadCategories } from '../presenters'
import { SearchBar } from "react-native-elements";
import AppText from './components/AppText'
import AppIconButton from './components/AppIconButton'
import ProductList from './ProductList'
import { alert } from "../utils";
import PromotionCarousel from './PromotionCarousel'

const PickerItem = Picker.Item;
class Home extends Component {

    static navigationOptions = ({ navigation }) => {

        const params = navigation.state.params || {}
        const { search, category } = params

        return {

            headerLeft: <Image source={require('../resources/images/logo.png')} style={{ width: 40, height: 35, resizeMode: 'stretch', marginLeft: 10 }} />,
            headerTitle:
                <SearchBar
                    onSubmitEditing={text => search(text.nativeEvent.text)}
                    containerStyle={{ width: '100%', backgroundColor: 'transparent' }}
                    lightTheme
                    placeholder={category ? category : 'Search for product'} />

        }

    }

    constructor(props) {
        super(props)
        this.state = {
            firstLoad: true,
            selectedCategory: 'none',
            categories: [],
            categoryStatus: 'LOADING',
            productStatus: 'LOADING',
            list: [],
            categoryMinimized: false
        }
    }


    componentWillMount() {
        this.props.navigation.setParams({ search: this.search.bind(this) })
    }

    componentDidMount() {

        if (this.state.firstLoad) {
            this.setState({ firstLoad: false })
            this.loadCategories()
            this.selectCategory('Latest')
        }

    }

    async search(keyWords) {

        if (this.state.selectedCategory === 'none') return alert('Error', 'Please select a category')
        const { selectedCategory: category } = this.state
        const q = keyWords === '' ? undefined : keyWords
        this.setState({ productStatus: 'LOADING', list: [], q })
        const result = await loadProductList({ q, category }, 0, 10)

        if (result.ok)
            this.setState({ productStatus: 'LOADED', list: this.state.list.concat(result.data) })
        else
            this.setState({ productStatus: 'LOADING_FAILED' })

    }

    async loadCategories() {

        this.setState({ categoryStatus: 'LOADING' })
        const result = await loadCategories()

        if (result.ok) {
            this.setState({
                categoryStatus: 'LOADED', categories: result.list
            })
        } else {
            this.setState({ categoryStatus: 'LOADING_FAILED' })
        }

    }

    async selectCategory(category) {

        let offset = 0, limit = 10
        if (this.state.selectedCategory === category) {
            offset = this.state.list.length
            this.setState({ selectedCategory: category, productStatus: 'LOADING' })
        }
        else {

            this.props.navigation.setParams({ category })
            this.setState({ selectedCategory: category, productStatus: 'LOADING', list: [], q: undefined })

        }

        const result = await loadProductList({ category, q: this.state.q }, offset, limit)

        if (result.ok)
            this.setState({ productStatus: 'LOADED', list: this.state.list.concat(result.data) })
        else
            this.setState({ productStatus: 'LOADING_FAILED' })


    }


    render() {
        const { categoryStatus, categories, productStatus, list, selectedCategory, categoryMinimized } = this.state

        return (
            <Container>
                {
                    !categoryMinimized && <PromotionCarousel />
                }
                <View style={{ padding: 5, backgroundColor: 'black' }}>
                    {
                        <ScrollView style={{ width: '100%' }} horizontal={true} showsHorizontalScrollIndicator={false} >
                            <AppIconButton smallSize={categoryMinimized} name='md-aperture' buttonName='Latest' color='white' selected={selectedCategory === 'Latest'} onPress={() => selectedCategory !== 'Latest' && this.selectCategory('Latest')} />
                            <AppIconButton smallSize={categoryMinimized} name='md-apps' buttonName='All' color='white' selected={selectedCategory === 'All'} onPress={() => selectedCategory !== 'All' && this.selectCategory('All')} />
                            {
                                categoryStatus === 'LOADING' &&
                                <Spinner style={{ marginLeft: 100 }} />
                            }
                            {
                                categoryStatus === 'LOADING_FAILED' &&
                                <AppText color='red' center small onPress={() => this.selectCategory(selectedCategory)}>Could not load categories! Tap to try again</AppText>
                            }
                            {
                                categoryStatus === 'LOADED' &&
                                categories.map(category => <AppIconButton key={'category-' + category.name} smallSize={categoryMinimized} name={category.icon} buttonName={category.name} color='white' selected={selectedCategory === category.name} onPress={() => selectedCategory !== category.name && this.selectCategory(category.name)} />)
                            }
                        </ScrollView>
                    }
                </View>
                <Content onScroll={({ nativeEvent }) => {

                    const { contentOffset } = nativeEvent
                    let categoryMinimized = true
                    if (contentOffset.y === 0) categoryMinimized = false
                    if (this.state.categoryMinimized !== categoryMinimized) this.setState({ categoryMinimized })

                }} >
                    {
                        selectedCategory === 'none' ?
                            <AppText center note style={{ marginVertical: 50 }} >SELECT A CATEGORY TO SEE PRODUCT LIST</AppText> :
                            <ProductList status={productStatus} list={list} load={() => this.selectCategory(selectedCategory)} />
                    }
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({




})

const mapDispatchToProps = (dispatch) => ({


})

export default connect(mapStateToProps, mapDispatchToProps)(Home)