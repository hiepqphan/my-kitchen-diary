import React from "react";
import { View, StyleSheet, } from "react-native";

import { Colors } from "../../Const/const";

export default class MyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dotTop: 0 };
  }

  render() {
    let dotColor = this.props.color !== undefined ? this.props.color : Colors.yellow;

    return (
      <View style={{ ...styles.container, ...this.props.style }} onLayout={this.layoutHandler}>
        {this.props.showDot &&
        <View style={[ this.props.dotSize === "sm" ? styles.smallDot : styles.largeDot ].concat({ top: this.state.dotTop, backgroundColor: "white", borderColor: dotColor, borderWidth: 4 })} />}

        {this.props.children}
      </View>
    );
  }

  layoutHandler = (event) => {
    let height = event.nativeEvent.layout.height;
    let halfDot = this.props.dotSize === "sm" ? 12/2 : 16/2;
    this.setState({ dotTop: height/2 - halfDot });
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  largeDot: {
    position: "absolute",
    // top: 7,
    left: -26,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  smallDot: {
    position: "absolute",
    // top: 7,
    left: -22,
    width: 12,
    height: 12,
    borderRadius: 6,
  }
});
