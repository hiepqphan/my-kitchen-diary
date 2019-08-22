import React from "react";
import { StyleSheet, Platform, View, TouchableOpacity,
         ScrollView, } from "react-native";
import SvgUri from "react-native-svg-uri";

import { DefaultStyles, Rules, Colors } from "../../../Const/const";
import { IconMinusRound, IconPlus } from "../../../../icons/icons";
import MyText, { TextTitle, TextSubtitle } from "../../../UI/Text/text";
import MyView from "../../../UI/View/view";
import KeyboardSafeView from "../../../UI/KeyboardSafeView/keyboard-safe-view";
import Ingredient from "../IngredientItem/ingredient-item";

export default class IngredientsEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ingredients: this.props.ingredients };
  }

  render() {
    let ingredients = this.state.ingredients.map((item, index) => (
      <Ingredient key={index} index={index} style={index === 0 ? { marginTop: 0 } : { marginTop: 10 }} removeHandler={this.removeIngredientInput}
                  ingredientChangeHandler={this.ingredientChangeHandler}
                  quantityChangeHandler={this.quantityChangeHandler}
                  ingredientText={this.state.ingredients[index].ingredient}
                  quantityText={this.state.ingredients[index].quantity}
                  deleteIcon={IconMinusRound}
                  editable={true}/>
    ));

    return (
      <KeyboardSafeView style={{ ...this.props.style }}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", }}>
            <TextTitle style={styles.title}>Ingredients</TextTitle>
          </View>
          <TouchableOpacity style={styles.doneButton} onPress={() => this.props.closeHandler(this.state.ingredients)}>
            <MyText style={{ textAlign: "right", color: Colors.orange, fontWeight: "600" }}>Done</MyText>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <ScrollView style={styles.scrollview}>
            {ingredients}
            <TouchableOpacity style={styles.addmoreButton} onPress={this.addIngredientInput} activeOpacity={1}>
              <SvgUri svgXmlData={IconPlus} width="15" height="15" fill={Colors.orange} />
              <MyText style={{ color: Colors.orange, fontWeight: "600", marginLeft: 5 }}>add ingredient</MyText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardSafeView>
    );
  }

  addIngredientInput = () => {
    if (this.state.ingredients.length < Rules.maxIngredientsPerRecipe)
      this.setState({ ingredients: this.state.ingredients.concat([{ingredient: "", quantity: ""}]) });
  }

  removeIngredientInput = (index) => {
    this.state.ingredients.splice(index, 1);
    let newState = this.state.ingredients;
    this.setState({ ingredients: newState });
  }

  ingredientChangeHandler = (event, index) => {
    let newState = this.state.ingredients;
    newState[index].ingredient = event.nativeEvent.text;
    this.setState({ ingredients: newState });
  }

  quantityChangeHandler = (event, index) => {
    let newState = this.state.ingredients;
    newState[index].quantity = event.nativeEvent.text;
    this.setState({ ingredients: newState });
  }
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: Platform.OS === "android" ? DefaultStyles.headerHeightModalAndroid : DefaultStyles.headerHeight,
    paddingTop: Platform.OS === "android" ? 0 : DefaultStyles.headerPaddingTop,
    paddingRight: 20,
    paddingLeft: 20,
  },
  body: {
    width: "100%",
    marginTop: Platform.OS === "android" ? DefaultStyles.headerHeightModalAndroid : DefaultStyles.headerHeight,
    // paddingTop: 10,
    // paddingBottom: 50,
  },
  scrollview: {
    paddingRight: DefaultStyles.standardPadding,
    paddingLeft: DefaultStyles.standardPadding,
  },
  addmoreButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    marginTop: 10,
    marginBottom: 400,
  },
  doneButton: {
    alignItems: "flex-end",
    justifyContent: "center",
    width: 60,
    height: 30,
  },
})
