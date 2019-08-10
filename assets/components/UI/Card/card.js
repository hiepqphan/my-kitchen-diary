import React from "react";
import { View, StyleSheet, } from "react-native";

import { DefaultStyles } from "../../Const/const";

export default class Card extends React.Component {

  render() {
    return (
      <View style={[styles.container].concat(this.props.style)} elevation={1}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: DefaultStyles.standardPadding,
    borderRadius: 10,
    // borderWidth: 0.5,
    borderColor: DefaultStyles.standardLightGray,
    marginTop: 20,
    marginRight: 10,
    marginLeft: 10,
    shadowColor: "#ddd",
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
});
