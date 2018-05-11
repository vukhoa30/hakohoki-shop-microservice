import React, { Component } from "react";
import { connect } from "react-redux";
import { View, TouchableHighlight } from "react-native";
import { Container, Content, Button, Icon, Grid, Col } from "native-base";
import AppText from "./AppText";
import Modal from "react-native-modal";
import { alert } from "../../utils";

class NumberPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 1
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.product) return;
    if (
      this.props.product === null ||
      this.props.product._id !== nextProps.product._id
    ) {
      this.setState({
        number: nextProps.product.amount ? nextProps.product.amount : 1
      });
    }
  }

  render() {
    const { product, isVisible, closeDialog, submit } = this.props;
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                    marginVertical: 20
                  }}
                >
                  <View style={{ padding: 5 }}>
                    <AppText style={{ fontSize: 20 }}>Quantity: </AppText>
                  </View>
                  <Button
                    small
                    style={{
                      padding: 5,
                      backgroundColor: "#eee"
                    }}
                  >
                    <AppText
                      style={{ fontSize: 20 }}
                      note
                      onPress={() =>
                        this.state.number + 1 <= product.quantity
                          ? this.setState({ number: this.state.number + 1 })
                          : alert("warning", "NOT ENOUGH PRODUCTS")
                      }
                    >
                      +
                    </AppText>
                  </Button>
                  <View style={{ padding: 5, paddingHorizontal: 20 }}>
                    <AppText style={{ fontSize: 20 }}>
                      {this.state.number}
                    </AppText>
                  </View>
                  <Button
                    small
                    style={{
                      padding: 5,
                      backgroundColor: "#eee",
                    }}
                  >
                    <AppText
                      style={{ fontSize: 20 }}
                      note
                      onPress={() =>
                        this.state.number > 1 &&
                        this.setState({ number: this.state.number - 1 })
                      }
                    >
                      -
                    </AppText>
                  </Button>
                </View>
                <Button
                  success
                  block
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    submit(this.state.number);
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

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NumberPicker);
