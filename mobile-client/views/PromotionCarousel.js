import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ImageBackground, TouchableOpacity } from "react-native";
import { Spinner } from 'native-base'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { loadPromotion } from "../presenters";
import { connect } from "react-redux";
const { width } = Dimensions.get('window')

class PromotionCarousel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeSlide: 0
        }
        const { status, loadPromotion } = this.props
        if (status !== 'LOADED')
            loadPromotion()

    }

    _renderItem = ({ item, index }) => {
        return (
            <ImageBackground style={{ flexDirection: 'row', width, height: '100%' }} source={{ uri: 'http://backgroundcheckall.com/wp-content/uploads/2017/12/background-png-2-1.png' }} >
                <TouchableOpacity style={{ flexDirection: 'row', width, height: '100%' }}>
                    <Image source={{ uri: item.mainPicture }} style={{ height: '90%', width: '35%', resizeMode: 'stretch', margin: 10, marginLeft: 20 }} />
                    <View style={{ width: '65%', height: '100%', padding: 10 }}>
                        <Text style={{ color: 'orange' }} >{item.name}</Text>
                    </View>
                </TouchableOpacity>
            </ImageBackground>
        );
    }

    get pagination() {
        const { activeSlide } = this.state
        const { list: entries } = this.props
        return (
            <Pagination
                dotsLength={entries.length}
                activeDotIndex={activeSlide}
                containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.92)'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    render = () => {

        const { status, loadPromotion, list } = this.props

        return (
            <View style={{ width: width, height: 150, alignItems: 'center', justifyContent: 'center' }} >
                {
                    status === 'LOADING' && <Spinner />
                }
                {
                    status === 'LOADING_FAILED' && <Text style={{ color: 'red' }} onPress={() => loadPromotion()} >Some error occurs! Tap to load promotion again</Text>
                }
                {
                    status === 'LOADED' &&
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={list}
                        renderItem={this._renderItem.bind(this)}
                        sliderWidth={width}
                        itemWidth={width}
                        itemHeight={150}
                        layout={'default'}
                        firstItem={0}
                    >
                        {
                            this.pagination
                        }
                    </Carousel>
                }
            </View>
        );
    }
}

const mapStateToProps = (state) => {

    const { status, list } = state.promotion

    return {

        status,
        list
    }

}

const mapDispatchToProps = (dispatch) => ({

    loadPromotion: () => dispatch(loadPromotion())

})

export default connect(mapStateToProps, mapDispatchToProps)(PromotionCarousel)