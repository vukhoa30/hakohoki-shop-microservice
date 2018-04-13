import React, { Component } from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { Container, Content, Button, Icon } from "native-base";
import AppText from "./AppText";
import Modal from "react-native-modal";

class NumberPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 1
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.product) return
    if (
      this.props.product === null ||
      this.props.product._id !== nextProps.product._id
    ) {
      this.setState({ number: nextProps.product.amount ? nextProps.product.amount : 1 });
    }
  }

  render() {
    const {
      product,
      isVisible,
      closeDialog,
      submit,
    } = this.props;
    return (
      <View>
        <Modal isVisible={isVisible}>
          <View
            style={{
              backgroundColor: "white",
              paddingVertical: 10,
              paddingHorizontal: 10
            }}
          >
            {product === null ? (
              <AppText center>NO PRODUCT SELECTED</AppText>
            ) : (
              <View>
                <AppText color="red" large>
                  {product.name}
                </AppText>
                <AppText center style={{ marginTop: 5 }} note>
                  Quantity
                </AppText>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 10
                  }}
                >
                  <Icon
                    name="add"
                    style={{ marginHorizontal: 10 }}
                    onPress={() =>
                      this.setState({ number: this.state.number + 1 })
                    }
                  />
                  <AppText large>{this.state.number}</AppText>
                  <Icon
                    name="remove"
                    style={{ marginHorizontal: 10 }}
                    onPress={() =>
                      this.state.number > 1 &&
                      this.setState({ number: this.state.number - 1 })
                    }
                  />
                </View>
                <Button
                  success
                  block
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    submit(this.state.number)
                    closeDialog();
                  }}
                >
                  <AppText>APPLY</AppText>
                </Button>
                <Button primary block onPress={() => closeDialog()}>
                  <AppText>CLOSE</AppText>
                </Button>
              </View>
            )}
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(NumberPicker);
