import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Dimensions, ScrollView } from "react-native";
import { selectProduct } from "../../api";
import { Container, Header, Content, Button } from "native-base";
import AppText from "../components/AppText";
import ProductShowcase from "../components/ProductShowcase";
import { formatTime } from "../../utils";

const { width } = Dimensions.get("window");

class PromotionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { params } = this.props.navigation.state;
    const { promotion } = params ? params : {};
    return (
      <Container>
        <Content>
          <View>
            <AppText large color="red" style={{ margin: 5 }} >
              {promotion.name}
            </AppText>
            <AppText note small style={{ margin: 5 }} >
              {formatTime(promotion["start_at"]) +
                " - " +
                formatTime(promotion["end_at"])}
            </AppText>
            <ScrollView horizontal={true} style={{ width: "100%" }}>
              {promotion.products.map(product => (
                <View key={product._id} style={{ width: width / 2 }}>
                  <ProductShowcase
                    onSelected={productId => this.props.selectProduct(productId)}
                    item={product}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  selectProduct: productId => dispatch(selectProduct(productId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionDetail);
