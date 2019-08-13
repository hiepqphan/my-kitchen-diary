import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import SvgUri from "react-native-svg-uri";

import { DefaultStyles } from "../../Const/const";
import { IconCartEmpty, IconPaperTorn } from "../../../icons/icons";

export class NotFoundIngredients extends React.Component {
  render() {
    return (
      <View style={{ ...styles.container, ...this.props.style }}>
        <SvgUri svgXmlData={IconCartEmpty} width="100" height="100" fill={DefaultStyles.standardBlack}/>
        <Text style={styles.missingText}>No ingredients added</Text>
      </View>
    );
  }
}

export class NotFoundInstructions extends React.Component {
  render() {
    return (
      <View style={{ ...styles.container, ...this.props.style }}>
        <SvgUri svgXmlData={IconPaperTorn} width="100" height="100" fill={DefaultStyles.standardBlack}/>
        <Text style={styles.missingText}>No instructions added</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  missingText: {
    color: DefaultStyles.standardBlack,
    fontStyle: "italic",
    marginTop: 10,
  }
});
