import React from "react";
import { Text, TextInput, StyleSheet } from "react-native";

import { Colors } from "../../Const/const";

export default class MyText extends React.Component {

  render() {
    return (
      <Text style={{ ...styles.defaultText, ...this.props.style }}>
        {this.props.children}
      </Text>
    );
  }
}

export class TextTitle extends React.Component {

  render() {
    return (
      <Text style={{ ...styles.defaultTitle, ...this.props.style }}>
        {this.props.children}
      </Text>
    );
  }
}

export class TextSubtitle extends React.Component {

  render() {
    return (
      <Text style={{ ...styles.defaultSubtitle, ...this.props.style }}>
        {this.props.children}
      </Text>
    );
  }
}

export class MyTextInput extends React.Component {

  render() {
    return (
      <TextInput {...this.props} style={{ ...this.props.style, ...styles.defaultText }}/>
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
    fontWeight: "600",
    color: Colors.black,
  },
  defaultSubtitle: {
    fontSize: 20,
    color: Colors.black,
  }
});
