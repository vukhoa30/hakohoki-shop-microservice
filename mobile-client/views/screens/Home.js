import React, { Component } from "react";
import {
  Platform,
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Right,
  Body,
  Left,
  Form,
  Item,
  Spinner,
  Input,
  List,
  ListItem
} from "native-base";
import { connect } from "react-redux";
import {
  loadProductList,
  loadCategories,
  selectProduct,
  loadPromotion
} from "../../api";
import { SearchBar } from "react-native-elements";
import AppText from "../components/AppText";
import AppIconButton from "../components/AppIconButton";
import ProductShowcase from "../components/ProductShowcase";
import { alert } from "../../utils";
import PromotionCarousel from "../components/Carousel";

const { width, height } = Dimensions.get("window");

class Home extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { search, category } = params;

    return {
      header: null
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      searchBarHeight: 0,
      firstLoad: true,
      categoryStatus: "LOADING",
      categories: [],
      latestProductStatus: "LOADING",
      latestProductList: [],
      fadingBanner: false,
      fadingOffset: 150,
      //opacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    if (this.state.firstLoad) {
      this.setState({ firstLoad: false });
      this.loadCategories();
      this.loadLatestProducts();
    }
  }

  async loadLatestProducts() {
    let offset = 0,
      limit = 10;
    this.setState({ latestProductStatus: "LOADING" });
    const result = await loadProductList({ category: "Latest" }, offset, limit);

    if (result.ok)
      this.setState({
        latestProductStatus: "LOADED",
        latestProductList: result.data
      });
    else this.setState({ latestProductStatus: "LOADING_FAILED" });
  }

  async selectCategory(category) {
    this.props.navigation.navigate("Catalog", { category });
  }

  async loadCategories() {
    this.setState({ categoryStatus: "LOADING" });
    const result = await loadCategories();

    if (result.ok) {
      this.setState({
        categoryStatus: "LOADED",
        categories: result.list
      });
    } else {
      this.setState({ categoryStatus: "LOADING_FAILED" });
    }
  }

  // changeCategoryPosition(isFixed = false) {
  //   let initValue = isFixed ? 0 : 1,
  //     finalValue = isFixed ? 1 : 0;

  //   this.state.opacity.setValue(initValue);

  //   Animated.timing(this.state.opacity, {
  //     toValue: finalValue,
  //     duration: 300
  //   }).start();
  // }

  render() {
    const {
      categoryStatus,
      categories,
      latestProductStatus,
      latestProductList,
      fadingBanner
    } = this.state;

    const {
      selectProduct,
      navigation,
      promotionStatus,
      promotionList,
      loadPromotion
    } = this.props;

    return (
      <Container>
        <Content
          onScroll={({ nativeEvent }) => {
            const { contentOffset } = nativeEvent;
            let fadingBanner = true;
            let categoryFixedMode = true
            if (contentOffset.y < this.state.fadingOffset) {
              fadingBanner = false;
            }
            if (contentOffset.y < this.state.categoryOffset) {
              categoryFixedMode = false;
            }
            if (this.state.fadingBanner !== fadingBanner) {
              this.setState({ fadingBanner });
            }
            if (this.state.categoryFixedMode !== categoryFixedMode) {
              this.setState({ categoryFixedMode });
            }
          }}
        >
          <SearchBar
            onLayout={e =>
              this.setState({
                searchBarHeight: e.nativeEvent.layout.height + 13
              })
            }
            containerStyle={{
              position: "absolute",
              paddingBottom: 0,
              zIndex: 100,
              top: 0,
              backgroundColor: "transparent",
              width: width,
              borderBottomWidth: 0
            }}
            lightTheme
            inputStyle={{ backgroundColor: "white" }}
            placeholder="Searching for product"
            onTouchStart={() => navigation.navigate("Search")}
          />
          <PromotionCarousel
            navigation={navigation}
            isHide={fadingBanner}
            list={promotionList}
            status={promotionStatus}
            load={() => loadPromotion()}
          />
          <View
            style={{
              backgroundColor: "black"
            }}
          >
            {
              <ScrollView
                style={{ width: "100%" }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <AppIconButton
                  name="md-apps"
                  buttonName="All"
                  color="white"
                  onPress={() => this.selectCategory("All")}
                />
                {categoryStatus === "LOADING" && (
                  <Spinner style={{ marginLeft: 100 }} />
                )}
                {categoryStatus === "LOADING_FAILED" && (
                  <AppText
                    color="yellow"
                    center
                    small
                    onPress={() => this.loadCategories()}
                  >
                    Could not load categories! Tap to try again
                  </AppText>
                )}
                {categoryStatus === "LOADED" &&
                  categories.map(category => (
                    <AppIconButton
                      key={"category-" + category.name}
                      name={category.icon}
                      buttonName={category.name}
                      color="white"
                      onPress={() => this.selectCategory(category.name)}
                    />
                  ))}
              </ScrollView>
            }
          </View>
          <View
            style={{
              width: "100%",
              height: 500
            }}
          >
            <List style={{ marginBottom: 5 }}>
              <ListItem itemHeader first>
                <Body>
                  <AppText note>LATEST PRODUCT</AppText>
                </Body>
                <Right>
                  <AppText
                    note
                    small
                    onPress={() => this.selectCategory("Latest")}
                  >
                    See all ...
                  </AppText>
                </Right>
              </ListItem>
            </List>
            {latestProductStatus === "LOADING" && (
              <Spinner style={{ alignSelf: "center" }} />
            )}
            {latestProductStatus === "LOADING_FAILED" && (
              <AppText
                color="red"
                center
                onPress={() => this.loadLatestProducts()}
              >
                Tap to load again
              </AppText>
            )}
            {latestProductStatus === "LOADED" && (
              <ScrollView horizontal={true} style={{ width: "100%" }}>
                {latestProductList.map(product => (
                  <View key={product._id} style={{ width: width / 2 }}>
                    <ProductShowcase
                      onSelected={productId => selectProduct(productId)}
                      item={product}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  promotionStatus: state.promotion.status,
  promotionList: state.promotion.list
});

const mapDispatchToProps = dispatch => ({
  selectProduct: productId => dispatch(selectProduct(productId)),
  loadPromotion: () => dispatch(loadPromotion())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
