import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Alert,
         TouchableOpacity } from "react-native";

export default class ImageView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let borderWidth = this.props.selected ? 5 : 0;
    return (
      <TouchableOpacity style={[styles.container, this.props.style].concat([{ borderWidth: borderWidth }])} onPress={() => this.props.selectToggler(this.props.index)}
                        activeOpacity={1}>
        <Image source={{ uri: this.props.uri }} style={{ width: this.props.size-borderWidth*2, height: this.props.size-borderWidth*2 }}/>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: "#3091e6",
  }
})
