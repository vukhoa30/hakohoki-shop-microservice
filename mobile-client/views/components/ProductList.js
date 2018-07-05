import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Image, StyleSheet } from "react-native";
import { Spinner, Content, H1, Button } from "native-base";
import AppText from "./AppText";
import AppContainer from "./AppContainer";
import FeatureList from "./FeatureList";
import AppButton from "./AppButton";
import ProductShowcase from "./ProductShowcase";
import { loadProductList, selectProduct } from "../../api";

class ProductList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      navigation,
      setCart,
      selectProduct,
      status,
      list,
      load
    } = this.props;
    return (
      <Content>
        <View style={{ alignItems: "center" }}>
          {list.length > 0 ? (
            <View style={{ width: "100%" }}>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                {list.map(item => (
                  <View key={item._id} style={{ width: "50%" }}>
                    <ProductShowcase
                      onSelected={product =>
                        selectProduct({ product, productId: product._id })
                      }
                      item={item}
                    />
                  </View>
                ))}
              </View>
              {status === "LOADED" && (
                <Button light block onPress={() => load()}>
                  <AppText>Load more products ...</AppText>
                </Button>
              )}
            </View>
          ) : (
            status === "LOADED" && (
              <AppText note style={{ marginTop: 100 }}>
                NO PRODUCTS FOUND
              </AppText>
            )
          )}
        </View>
        {status === "LOADING" ? (
          <Spinner />
        ) : (
          status === "LOADING_FAILED" && (
            <View style={{ alignItems: "center" }}>
              <AppText color="red" small style={{ marginBottom: 10 }}>
                Could not load data
              </AppText>
              <AppButton
                small
                warning
                style={{ alignSelf: "center" }}
                onPress={() => load()}
              >
                Reload
              </AppButton>
            </View>
          )
        )}
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    width: 80,
    height: 80
  },
  background: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    height: "100%"
  }
});

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    setCart: (product, type) => dispatch(setCart(product, type)),
    selectProduct: productInfo => dispatch(selectProduct(productInfo))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
