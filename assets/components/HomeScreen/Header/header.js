import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Alert,
         StatusBar, TouchableOpacity } from "react-native";
import SvgUri from "react-native-svg-uri";

import { DefaultStyles, Colors } from "../../Const/const";
import { IconPlus } from "../../../icons/icons";
import { TextTitle } from "../../UI/Text/text";

export default class Header extends Component {
  render() {
    return(
      <View style={[styles.container].concat(this.props.styleList)}>
        <TextTitle style={{  }}>{this.props.title}</TextTitle>
        <TouchableOpacity onPress={this.props.createRecipeHandler} activeOpacity={1} style={styles.addButtonContainer}>
          <SvgUri style={styles.addButton} width="25" height="25" svgXmlData={IconPlus} fill={Colors.orange}/>
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
    width: "100%",
    height: DefaultStyles.headerHeight,
    paddingTop: DefaultStyles.headerPaddingTop,
    paddingLeft: DefaultStyles.standardPadding,
    // borderBottomWidth: 0.5,
    borderBottomColor: DefaultStyles.standardBlack,
  },
  addButtonContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: 35,
    height: 35,
    paddingRight: DefaultStyles.standardPadding,
  },
  addButton: {
    width: 25,
    height: 25,
  }
});
