import React, { Component } from "react";
import { connect } from "react-redux";
import { View, TouchableHighlight, Modal } from "react-native";
import { Container, Content, Button, Icon, Grid, Col } from "native-base";
import AppText from "./AppText";
// import Modal from "react-native-modal";
import { alert } from "../../utils";

class NumberPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 1
    };
  }

  render() {
    const { isVisible, closeDialog, submit } = this.props;
    return (
      <View>
        <Modal
          animationType="slide"
          visible={isVisible}
          onRequestClose={() => {}}
          transparent={true}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end"
            }}
          >
            <View style={{ backgroundColor: "white", padding: 10, paddingBottom: 20 }}>
              <AppText large style={{ fontWeight: "bold" }}>
                SELECT QUANTITY
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
                  <AppText style={{ fontSize: 20 }} note>
                    Quantity:{" "}
                  </AppText>
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
                      this.setState({ number: this.state.number + 1 })
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
                    backgroundColor: "#eee"
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
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NumberPicker);
