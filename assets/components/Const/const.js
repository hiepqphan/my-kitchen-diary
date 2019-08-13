import { getStatusBarHeight } from "react-native-status-bar-height";
import { Dimensions } from "react-native";

const Data = {
  mealTypes: [ "appetizer", "main course", "dessert", "drink", "other", ],
  styles: {
    headerFontSize: 20,
    headerHeight: 50+getStatusBarHeight(),
    headerPaddingTop: getStatusBarHeight(),
    headerStandardColor: "#e8e8e8",
    standardPadding: 15,
    standardBlue: "rgb(0, 122, 255)",
    standardBlack: "#ddd",
    standardLightGray: "#f5f5f5",
    listItemHeight: 100,
    navbarIndicatorWidth: Dimensions.get("window").width / 4,
  },
  rules: {
    maxPhotosPerRecipe: 20,
    maxIngredientsPerRecipe: 40,
    maxCharPerIngredient: 50,
    maxCharRecipeTitle: 80,
    maxCharInstructions: 1000,
  },
  screen: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  }
}

export const Screen = Data.screen;
export const Rules = Data.rules;
export const DefaultStyles = Data.styles;
export const MealTypes = Data.mealTypes;
export default Data;
