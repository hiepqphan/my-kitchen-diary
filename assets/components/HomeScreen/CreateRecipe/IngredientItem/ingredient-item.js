import React, { Component } from "react";
import { StyleSheet, Text, View, Image,
         TouchableOpacity, TextInput } from "react-native";
import SvgUri from "react-native-svg-uri";
import { Rules } from "../../../Const/const";

export default class Ingredient extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <View style={[styles.container, this.props.style]}>
        <View style={styles.inputsContainer}>
          <View style={[styles.input, styles.ingredientName]}>
            <TextInput multiline={false} placeholder="ingredient" value={this.props.ingredientText} maxLength={Rules.maxCharPerIngredient}
                       onChange={(event) => this.props.ingredientChangeHandler(event, this.props.index)}
                       editable={this.props.editable}/>
          </View>
          <View style={[styles.input, styles.quantity]}>
            <TextInput multiline={false} placeholder="quantity" value={this.props.quantityText} maxLength={Rules.maxCharPerIngredient}
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
  inputsContainer: {
    flex: 9,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    alignItems: "center",
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
