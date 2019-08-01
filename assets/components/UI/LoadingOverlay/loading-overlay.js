import React, { Component } from "react";
import { StyleSheet, Text, View, Image,
         TouchableOpacity, Dimensions, Animated,
         ActivityIndicator, } from "react-native";
import SvgUri from "react-native-svg-uri";
import { Overlay } from "react-native-elements";

export default class LoadingOverlay extends Component {
  constructor(props) {
    super(props);

    this.width = Dimensions.get("window").width;
  }

  render() {
    return(
      <Overlay isVisible={this.props.isVisible} width={this.width/2} height={this.width/2}
               borderRadius={5}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#ffa64d" animating={true} style={{ marginTop: 30, marginBottom: 30 }}/>
          <Text style={{ fontSize: 20 }}>{this.props.title}</Text>
        </View>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  }
})
