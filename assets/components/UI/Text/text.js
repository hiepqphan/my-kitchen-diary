import React from "react";
import { Text, TextInput, StyleSheet } from "react-native";

import { Colors } from "../../Const/const";

function getFontFamily(fontstyle, fontweight) {
  let style = "";
  if (fontstyle === "italic")
    style = "italic";

  let weight = "";
  if (fontweight === "300")
    weight = "light";
  else if (fontweight === "500")
    weight = "semibold";
  else if (fontweight === "600")
    weight = "bold";
  else if (fontweight === "700")
    weight = "extrabold";

  return "open-sans"+weight+style;
}

export default class MyText extends React.Component {

  render() {
    let fontstyle = this.props.style && this.props.style.fontStyle ? this.props.style.fontStyle : null;
    let fontweight = this.props.style && this.props.style.fontWeight ? this.props.style.fontWeight : null;

    return (
      <Text style={{ ...styles.defaultText, ...this.props.style, fontFamily: getFontFamily(fontstyle, fontweight) }}>
        {this.props.children}
      </Text>
    );
  }
}

export class TextTitle extends React.Component {

  render() {
    let fontstyle = this.props.style && this.props.style.fontStyle ? this.props.style.fontStyle : null;
    let fontweight = this.props.style && this.props.style.fontWeight ? this.props.style.fontWeight : "500";

    return (
      <Text style={{ ...styles.defaultTitle, ...this.props.style, fontFamily: getFontFamily(fontstyle, fontweight) }}>
        {this.props.children}
      </Text>
    );
  }
}

export class TextSubtitle extends React.Component {

  render() {
    let fontstyle = this.props.style && this.props.style.fontStyle ? this.props.style.fontStyle : null;
    let fontweight = this.props.style && this.props.style.fontWeight ? this.props.style.fontWeight : "500";

    return (
      <Text style={{ ...styles.defaultSubtitle, ...this.props.style, fontFamily: getFontFamily(fontstyle, fontweight) }}>
        {this.props.children}
      </Text>
    );
  }
}

export class MyTextInput extends React.Component {

  render() {
    let fontstyle = this.props.style && this.props.style.fontStyle ? this.props.style.fontStyle : null;
    let fontweight = this.props.style && this.props.style.fontWeight ? this.props.style.fontWeight : null;

    return (
      <TextInput {...this.props} style={{ ...this.props.style, ...styles.defaultText, fontFamily: getFontFamily(fontstyle, fontweight) }}/>
    );
  }
}

const styles = StyleSheet.create({
  defaultText: {
    fontSize: 17,
    color: Colors.black,
  },
  defaultTitle: {
    fontSize: 22,
    color: Colors.black,
  },
  defaultSubtitle: {
    fontSize: 20,
    color: Colors.black,
  }
});
