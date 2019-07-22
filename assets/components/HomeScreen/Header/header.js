import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default class Header extends Component {
  render() {
    return(
      <View style={[styles.container].concat(this.props.styleList)}>
        <Image source={require("../../../logo.png")} style={styles.logo}/>
        <Text style={styles.title}>{this.props.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    backgroundColor: "orange",
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    marginTop: 30,
    marginLeft: 5,
  },
  logo: {
    width: 50,
    height: 50,
    marginLeft: 20,
  }
});
