import React, { Component } from "react";
import { StyleSheet, Text, View, Image,
         TouchableOpacity, TextInput } from "react-native";

export default class MealTypeItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={[this.props.style].concat([ { opacity: this.props.isSelected ? 1 : 0.7 } ])}>
        <TouchableOpacity style={styles.container} onPress={() => this.props.onPressHandler(this.props.name)}
                          activeOpacity={1}>
          <Text style={{ color: "white" }}>{this.props.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffa64d",
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    borderRadius: 20,
  }
})
