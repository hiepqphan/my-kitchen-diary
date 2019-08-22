import React, { Component } from "react";
import { StyleSheet, Text, View, Image,
         TouchableOpacity, TextInput } from "react-native";
import SvgUri from "react-native-svg-uri";

import { Rules, DefaultStyles, Colors } from "../../../Const/const";
import MyText, { MyTextInput } from "../../../UI/Text/text";

export default class Ingredient extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={[styles.container, this.props.style]}>
        <View style={{ justifyContent: "center", alignItems: "center", width: 25, }}>
          <View style={styles.index}>
            <MyText style={{ color: "white" }}>{this.props.index+1}</MyText>
          </View>
        </View>
        <View style={styles.inputsContainer}>
          <View style={[styles.input, styles.ingredientName]}>
            <MyTextInput multiline={false} placeholder="ingredient" value={this.props.ingredientText} maxLength={Rules.maxCharPerIngredient}
                       onChange={(event) => this.props.ingredientChangeHandler(event, this.props.index)}
                       editable={this.props.editable}/>
          </View>
          <View style={[styles.input, styles.quantity]}>
            <MyTextInput multiline={false} placeholder={this.props.quantityPlaceholder !== undefined ? this.props.quantityPlaceholder : "quantity"}
                       value={this.props.quantityText} maxLength={Rules.maxCharPerIngredient}
                       onChange={(event) => this.props.quantityChangeHandler(event, this.props.index)}
                       editable={this.props.editable}/>
          </View>
        </View>
        {this.props.editable &&
        <TouchableOpacity style={styles.deleteButton} onPress={() => this.props.removeHandler(this.props.index)}
                          activeOpacity={1}>
          <SvgUri svgXmlData={this.props.deleteIcon} width="20" height="20" fill="#ff6633" />
        </TouchableOpacity>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  index: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.yellow,
    width: 25,
    height: 25,
    borderRadius: 12.5,
  },
  inputsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  deleteButton: {
    alignItems: "flex-end",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  input: {
    borderBottomColor: "#e8e8e8",
    borderBottomWidth: 0,
  },
  ingredientName: {
    flex: 3
  },
  quantity: {
    flex: 2,
    marginLeft: 10,
  }
})
