import React, { Component } from "react";
import { TextInput, Dimensions, StatusBar, Animated,
         Keyboard, UIManager, } from "react-native";

export default class KeyboardSafeView extends Component {
  constructor(props) {
    super(props);
    this.state = { screenShift: new Animated.Value(0), };
  }

  componentDidMount() {
    this.keyboardDidShowSubscription = Keyboard.addListener("keyboardDidShow", this.keyboardDidShowHandler);
    this.keyboardDidHideSubscription = Keyboard.addListener("keyboardDidHide", this.keyboardDidHideHandler);
    this.screenShiftSubscription = this.state.screenShift.addListener(({value}) => this._value = value);
  }

  componentWillUnmount() {
    this.keyboardDidShowSubscription.remove();
    this.keyboardDidHideSubscription.remove();
  }

  keyboardDidShowHandler = (event) => {
    let windowHeight = Dimensions.get("window").height;
    let keyboardHeight = event.endCoordinates.height;
    this.keyboardHeight = keyboardHeight;
    let currentlyFocusedField = TextInput.State.currentlyFocusedField();
    UIManager.measure(currentlyFocusedField,  (originX, originY, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
      if (gap >= 10) {
        return;
      }
      Animated.timing(
        this.state.screenShift,
        {
          toValue: gap-10,
          duration: 200,
        }
      ).start();
    });
  }

  keyboardDidHideHandler = () => {
    Animated.timing(
      this.state.screenShift,
      {
        toValue: 0,
        duration: 200,
      }
    ).start();
  }

  render() {
    return(
      <Animated.View style={this.props.style.concat([{ transform: [{translateY: this.state.screenShift}] }, ])}>
        {this.props.children}
      </Animated.View>
    );
  }

}
