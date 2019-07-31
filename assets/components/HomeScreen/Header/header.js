import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Alert,
         StatusBar, TouchableOpacity } from "react-native";
import SvgUri from "react-native-svg-uri";

import { DefaultStyles } from "../../Const/const";
import { IconPlus } from "../../../icons/icons";

export default class Header extends Component {
  render() {
    return(
      <View style={[styles.container].concat(this.props.styleList)}>
        <Text style={styles.title}>{this.props.title}</Text>
        <TouchableOpacity onPress={this.props.createRecipeHandler} activeOpacity={1}>
          <SvgUri style={styles.addButton} width="25" height="25" svgXmlData={IconPlus} fill="black"/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingRight: 20,
    paddingLeft: 20,
  },
  title: {
    fontSize: DefaultStyles.headerFontSize,
    fontWeight: "600",
  },
  addButton: {
    width: 25,
    height: 25,
  }
});
