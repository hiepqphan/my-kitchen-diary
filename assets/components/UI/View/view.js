import React from "react";
import { View, StyleSheet, } from "react-native";
import SvgUri from "react-native-svg-uri";

import { Colors } from "../../Const/const";
import { IconCircle } from "../../../icons/icons";

export default class MyView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dotTop: 0 };
  }

  render() {
    let dotColor = this.props.color !== undefined ? this.props.color : Colors.orange_tint;
    let dotOffset = this.props.dotOffset !== undefined ? this.props.dotOffset : 0;
    let defaultDotLeft = this.props.dotSize === "sm" ? -28 : -31;
    let dotLeft = this.props.dotPadding !== undefined ? this.props.dotPadding : defaultDotLeft;
    let dotSize = this.props.dotSize === "sm" ? 6 : 14;

    return (
      <View style={{ ...styles.container, ...this.props.style }} onLayout={this.layoutHandler}>
        {this.props.showDot && this.props.dotImage === undefined &&
        <View style={[ this.props.dotSize === "sm" ? styles.smallDot : styles.largeDot ].concat({ top: this.state.dotTop+dotOffset, left: dotLeft, backgroundColor: "white", })}>
          <SvgUri svgXmlData={IconCircle} fill={dotColor} width={dotSize} height={dotSize}/>
        </View>}
        {this.props.dotImage !== undefined &&
        <View style={{ ...styles.largeDot, top: dotTop, backgroundColor: "none", borderWidth: 0, borderRadius: 0, }}>
          {this.props.dotImage}
        </View>}

        {this.props.children}
      </View>
    );
  }

  layoutHandler = (event) => {
    let height = event.nativeEvent.layout.height;
    let halfDot = this.props.dotSize === "sm" ? 12/2 : 20/2;
    this.setState({ dotTop: height/2 - halfDot });
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  largeDot: {
    position: "absolute",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
  },
  smallDot: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 12,
    height: 12,
  }
});
