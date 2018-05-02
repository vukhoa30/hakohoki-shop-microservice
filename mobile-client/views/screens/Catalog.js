import React, { Component } from "react";
import {
  Platform,
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity
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
  Picker,
  Form,
  Item,
  Spinner,
  Input
} from "native-base";
import { connect } from "react-redux";
import { loadProductList, loadCategories } from "../../api";
import { SearchBar } from "react-native-elements";
import AppText from "../components/AppText";
import AppIconButton from "../components/AppIconButton";
import ProductList from "../components/ProductList";
import { alert } from "../../utils";

const PickerItem = Picker.Item;
class Catalog extends Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    const { search, category, q } = params;

    return {
      headerTitle: (
        <SearchBar
          onSubmitEditing={text => search(text.nativeEvent.text)}
          containerStyle={{ width: "100%", backgroundColor: "transparent" }}
          inputStyle={{ backgroundColor: "white" }}
          lightTheme
          placeholder={category ? category : "Search for product"}
        />
      )
    };
  };

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      firstLoad: true,
      selectedCategory: "none",
      productStatus: "LOADING",
      list: [],
      categoryMinimized: false,
      q: params ? params.q : undefined
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({ search: this.search.bind(this) });
  }

  componentDidMount() {
    if (this.state.firstLoad) {
      this.setState({ firstLoad: false });
      const { params } = this.props.navigation.state;
      const { category } = params ? params : { category: "Latest" };
      this.selectCategory(category);
    }
  }

  async search(keyWords) {
    if (this.state.selectedCategory === "none")
      return alert("Error", "Please select a category");
    const { selectedCategory: category } = this.state;
    const q = keyWords === "" ? undefined : keyWords;
    this.setState({ productStatus: "LOADING", list: [], q });
    const result = await loadProductList({ q, category }, 0, 10);

    if (result.ok)
      this.setState({
        productStatus: "LOADED",
        list: this.state.list.concat(result.data)
      });
    else this.setState({ productStatus: "LOADING_FAILED" });
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

  async selectCategory(category) {
    let offset = 0,
      limit = 10;
    if (
      this.state.selectedCategory === category ||
      this.state.selectedCategory === "none"
    ) {
      offset = this.state.list.length;
      this.setState({ selectedCategory: category, productStatus: "LOADING" });
    } else {
      this.props.navigation.setParams({ category });
      this.setState({
        selectedCategory: category,
        productStatus: "LOADING",
        list: [],
        q: undefined
      });
    }

    const result = await loadProductList(
      { category, q: this.state.q },
      offset,
      limit
    );

    if (result.ok)
      this.setState({
        productStatus: "LOADED",
        list: this.state.list.concat(result.data)
      });
    else this.setState({ productStatus: "LOADING_FAILED" });
  }

  render() {
    const {
      productStatus,
      list,
      selectedCategory,
      categoryMinimized
    } = this.state;
    const { category, loadCategories } = this.props;
    const { status: categoryStatus, data: categories } = category;

    return (
      <Container>
        <View
          style={{
            padding: 5,
            backgroundColor: "black",
            position: "absolute",
            zIndex: 100,
            width: "100%"
          }}
        >
          {
            <ScrollView
              style={{ width: "100%" }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <AppIconButton
                smallSize={categoryMinimized}
                name="md-aperture"
                buttonName="Latest"
                color="white"
                selected={selectedCategory === "Latest"}
                onPress={() =>
                  selectedCategory !== "Latest" && this.selectCategory("Latest")
                }
              />
              <AppIconButton
                smallSize={categoryMinimized}
                name="md-apps"
                buttonName="All"
                color="white"
                selected={selectedCategory === "All"}
                onPress={() =>
                  selectedCategory !== "All" && this.selectCategory("All")
                }
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
                      key={"category-" + category}
                      smallSize={categoryMinimized}
                      name={icon}
                      buttonName={category}
                      color="white"
                      selected={selectedCategory === category}
                      onPress={() =>
                        selectedCategory !== category &&
                        this.selectCategory(category)
                      }
                    />
                  );
                })}
            </ScrollView>
          }
          {this.state.q && (
            <AppText style={{ margin: 10, color: "black" }} note>
              >> Keyword: {this.state.q}
            </AppText>
          )}
        </View>
        <Content
          onScroll={({ nativeEvent }) => {
            const { contentOffset } = nativeEvent;
            let categoryMinimized = true;
            if (contentOffset.y < 100) categoryMinimized = false;
            if (this.state.categoryMinimized !== categoryMinimized)
              this.setState({ categoryMinimized });
          }}
        >
          {selectedCategory === "none" ? (
            <AppText center note style={{ marginVertical: 50 }}>
              SELECT A CATEGORY TO SEE PRODUCT LIST
            </AppText>
          ) : (
            <View style={{ marginTop: 100 }}>
              <ProductList
                status={productStatus}
                list={list}
                load={() => this.selectCategory(selectedCategory)}
              />
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  category: state.category
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
