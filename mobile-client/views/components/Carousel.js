import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Animated
} from "react-native";
import { Spinner } from "native-base";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { loadPromotion } from "../../api";
import { connect } from "react-redux";
import AppText from "./AppText";
const { width } = Dimensions.get("window");

class AppCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0,
      opacity: new Animated.Value(1)
    };
    const { status, load } = this.props;
    if (status !== "LOADED") load();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isHide !== nextProps.isHide) {
      let initialValue = nextProps.isHide ? 1 : 0,
        finalValue = nextProps.isHide ? 0 : 1;

      this.state.opacity.setValue(initialValue); //Step 3
      Animated.timing(
        //Step 4
        this.state.opacity,
        {
          toValue: finalValue,
          duration: 1000
        }
      ).start(); //Step 5
    }
  }

  // componentWillReceiveProps(nextProps) {

  //     if (this.props.isHide !== nextProps.isHide) {
  //         const { isHide } = nextProps
  //         let initialValue = isHide ? this.state.maxHeight : this.state.minHeight,
  //             finalValue = isHide ? this.state.minHeight : this.state.maxHeight

  //         this.state.animation.setValue(initialValue);  //Step 3
  //         Animated.spring(     //Step 4
  //             this.state.animation,
  //             {
  //                 toValue: finalValue
  //             }
  //         ).start();
  //     }

  // }

  _renderItem = ({ item, index }) => {
    const { navigation } = this.props
    return (
      // <ImageBackground style={{ flexDirection: 'row', width, height: '100%' }} source={{ uri: 'http://backgroundcheckall.com/wp-content/uploads/2017/12/background-png-2-1.png' }} >
      //     <TouchableOpacity style={{ flexDirection: 'row', width, height: '100%' }}>
      //         <Image source={{ uri: item.mainPicture }} style={{ height: '90%', width: '35%', resizeMode: 'stretch', margin: 10, marginLeft: 20 }} />
      //         <View style={{ width: '65%', height: '100%', padding: 10 }}>
      //             <Text style={{ color: 'orange' }} >{item.name}</Text>
      //         </View>
      //     </TouchableOpacity>
      // </ImageBackground>
      <TouchableOpacity style={{ flexDirection: "row", width, height: "100%" }} onPress={() => navigation.navigate('PromotionDetail',{ promotion: item })} >
        <Image
          source={{ uri: item["poster_url"] }}
          style={{
            height: "100%",
            width: "100%",
            resizeMode: "stretch"
          }}
        />
      </TouchableOpacity>
    );
  };

  get pagination() {
    const { activeSlide } = this.state;
    const { list: entries } = this.props;
    return (
      <Pagination
        carouselRef={this._carousel}
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          backgroundColor: "transparent",
          position: "absolute",
          bottom: 0,
          right: 30
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 25,
          backgroundColor: "red"
        }}
        inactiveDotStyle={{
          width: 10,
          height: 10,
          backgroundColor: "white"
        }}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
  }

  render = () => {
    const { status, load, list, isHide, height } = this.props;

    return (
      <View
        onLayout={e => console.log(e.nativeEvent.layout.height)}
        style={[
          {
            width: width,
            alignItems: "center",
            justifyContent: "center",
            height: height ? height : 250,
            backgroundColor: 'orange'
          }
        ]}
      >
        {status === "LOADING" && <Spinner />}
        {status === "LOADING_FAILED" && (
          <AppText style={{ color: "red" }} onPress={() => load()}>
            Some error occurs! Tap to load promotion again
          </AppText>
        )}
        {status === "LOADED" &&
          (list.length > 0 ? (
            <Animated.View style={{ opacity: this.state.opacity }}>
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={list}
                renderItem={this._renderItem.bind(this)}
                sliderWidth={width}
                itemWidth={width}
                onSnapToItem={slideIndex =>
                  this.setState({ activeSlide: slideIndex })
                }
                layout={"default"}
                firstItem={0}
                autoplay={true}
                loop={true}
                autoplayInterval={2000}
              />
              {this.pagination}
            </Animated.View>
          ) : (
            <AppText note large onPress={() => load()}>
              NO PROMOTION NOW
            </AppText>
          ))}
      </View>
    );
  };
}

const mapStateToProps = state => ({
 
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(AppCarousel);
