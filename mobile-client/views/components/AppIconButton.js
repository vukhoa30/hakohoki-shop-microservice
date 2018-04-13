import React, { Component } from "react";
import { View, Animated, Easing } from "react-native";
import { Icon } from "native-base";
import AppText from "./AppText";
const AnimatedIcon = Animated.createAnimatedComponent(Icon);
class AppIconButton extends Component {
  state = {
    iconSize: new Animated.Value(this.props.smallSize ? 20 : 50)
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.smallSize !== nextProps.smallSize) {
      let initialValue = nextProps.smallSize ? 50 : 20,
        finalValue = nextProps.smallSize ? 20 : 50;

      this.state.iconSize.setValue(initialValue); //Step 3
      Animated.timing(
        //Step 4
        this.state.iconSize,
        {
          toValue: finalValue,
          duration: 300
        }
      ).start(); //Step 5
    }
  }
  render() {
    const { buttonName, color, selected, smallSize } = this.props;
    return (
      <View
        style={[
          {
            flex: 1,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10
          }
        ]}
      >
        <AnimatedIcon
          {...this.props}
          style={{
            fontSize: this.state.iconSize,
            color: selected ? "red" : color ? color : "black"
          }}
        />
        {!smallSize && (
          <AppText small color={selected ? "red" : color}>
            {buttonName}
          </AppText>
        )}
      </View>
    );
  }
}

export default AppIconButton;
