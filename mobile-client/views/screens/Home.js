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
  Animated,
  RefreshControl
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
  static navigationOptions = ({ navigation }) => ({
    title: "Home"
  });

  constructor(props) {
    super(props);
    this.state = {
      searchBarHeight: 0,
      firstLoad: true,
      latestProductStatus: "LOADING",
      latestProductList: [],
      fadingBanner: false,
      fadingOffset: 150,
      categoryMinimized: false
      //opacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    if (this.state.firstLoad) {
      this.setState({ firstLoad: false });
      this.props.loadCategories();
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
    const { latestProductStatus, latestProductList, fadingBanner } = this.state;

    const {
      category,
      selectProduct,
      navigation,
      promotionStatus,
      promotionList,
      loadPromotion,
      loadCategories
    } = this.props;

    const { status: categoryStatus, data: categories } = category;

    return (
      <Container>
        <View
          style={{
            backgroundColor: "black",
            width: "100%",
          }}
        >
          {
            <ScrollView
              style={{ width: "100%" }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <AppIconButton
                //smallSize={categoryMinimized}
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
                  onPress={() => loadCategories()}
                >
                  Could not load categories! Tap to try again
                </AppText>
              )}
              {categoryStatus === "LOADED" &&
                categories.map(category => {
                  let icon = "info";

                  switch (category) {
                    case "Phone":
                      icon = "md-phone-portrait";
                      break;
                    case "Tablet":
                      icon = "md-tablet-portrait";
                      break;
                    case "Accessory":
                      icon = "md-headset";
                      break;
                    case "SIM":
                      icon = "ios-card";
                      break;
                    case "Card":
                      icon = "md-card";
                      break;
                  }

                  return (
                    <AppIconButton
                      //smallSize={categoryMinimized}
                      key={"category-" + category}
                      name={icon}
                      buttonName={category}
                      color="white"
                      onPress={() => this.selectCategory(category)}
                    />
                  );
                })}
            </ScrollView>
          }
        </View>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={
                latestProductStatus === "LOADING" ||
                promotionStatus === "LOADING"
              }
              onRefresh={() => {
                loadPromotion();
                this.loadLatestProducts();
              }}
            />
          }
        >
          <View>
            {(promotionStatus === "INIT" ||
              promotionStatus === "LOADING" ||
              (promotionStatus === "LOADED" && promotionList.length > 0)) && (
              <PromotionCarousel
                navigation={navigation}
                isHide={fadingBanner}
                list={promotionList}
                status={promotionStatus}
                load={() => loadPromotion()}
              />
            )}
            <View
              style={{
                width: "100%",
                height: 500
              }}
            >
              <List style={{ marginBottom: 0 }}>
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
                        onSelected={productId =>
                          selectProduct({ product, productId: product._id })
                        }
                        item={product}
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
          {/* <SearchBar
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
          /> */}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  promotionStatus: state.promotion.status,
  promotionList: state.promotion.list,
  category: state.category
});

const mapDispatchToProps = dispatch => ({
  selectProduct: productInfo => dispatch(selectProduct(productInfo)),
  loadPromotion: () => dispatch(loadPromotion()),
  loadCategories: () => dispatch(loadCategories())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
