import React, { Component } from "react";
import { StyleSheet, Text, View, Image,
         TouchableOpacity, TextInput } from "react-native";

import MyText from "../../../UI/Text/text";
import { Colors } from "../../../Const/const";

export default class MealTypeItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={[this.props.style]}>
        <TouchableOpacity style={[styles.container].concat([ !this.props.isSelected && styles.notSelected ])} onPress={() => this.props.onPressHandler(this.props.name)}
                          activeOpacity={1}>
          <MyText style={{ color: this.props.isSelected ? "white" : Colors.orange }}>{this.props.name}</MyText>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.orange,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    borderWidth: 2,
    borderColor: Colors.orange,
    borderRadius: 20,
  },
  notSelected: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: Colors.orange,
  }
})
