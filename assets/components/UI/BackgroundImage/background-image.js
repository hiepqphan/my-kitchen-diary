import React from "react";
import { Image, View, StyleSheet } from "react-native";

export default class BackgroundImage extends React.Component {

  render() {
    return (
      <View style={{ ...styles.container, ...this.props.style, }}>
        <View style={styles.imageContainer}>
          <Image source={this.props.source} style={{ width: "100%", height: "100%", }} resizeMode="cover"/>
        </View>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    top: 0,
    left: 0,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  }
})
