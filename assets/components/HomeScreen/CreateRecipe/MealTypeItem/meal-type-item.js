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
      <View style={[this.props.style].concat([ { opacity: this.props.isSelected ? 1 : 0.5 } ])}>
        <TouchableOpacity style={styles.container} onPress={() => this.props.onPressHandler(this.props.name)}
                          activeOpacity={1}>
          <MyText style={{ color: "white" }}>{this.props.name}</MyText>
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
    borderRadius: 20,
  }
})
