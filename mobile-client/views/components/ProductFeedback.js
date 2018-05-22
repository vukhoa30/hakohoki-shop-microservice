import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { Container, Content, Button, Spinner } from "native-base";
import { loadProductFeedback } from "../../api";
import AppText from "./AppText";
import ProductReviews from "./ProductReviews";

class ProductFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "INIT",
      comments: [],
      reviews: [],
      statistic: []
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { productId } = this.props;
    this.setState({ status: "LOADING" });
    loadProductFeedback(productId).then(
      result => {
        const { ok, comments, reviews, statistic } = result;
        return ok
          ? this.setState({ status: "LOADED", comments, reviews, statistic })
          : this.setState({ status: "ERROR" });
      },
      err => {
        this.setState({ status: "ERROR" });
      }
    );
  }

  renderBasedOnStatus() {
    const { status, reviews, statistic, comments, err } = this.state;
    switch (status) {
      case "LOADING":
        return <Spinner style={{ alignSelf: "center" }} />;
      case "ERROR":
        return (
          <View style={{ width: "100%", alignItems: "center" }}>
            <AppText color="red">COULD NOT LOAD USER FEEDBACK</AppText>
            <Button warning onPress={() => this.loadData()}>
              <AppText>RELOAD</AppText>
            </Button>
          </View>
        );
      default:
        return (
          <View>
            <ProductReviews reviews={reviews} statistic={statistic} />
          </View>
        );
    }
  }

  render() {
    return this.renderBasedOnStatus();
  }
}

const mapStateToProps = (state, props) => {
  const { productId } = props;

  return {
    productId: productId ? productId : null
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ProductFeedback);
