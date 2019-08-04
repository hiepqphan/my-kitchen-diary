import { getStatusBarHeight } from "react-native-status-bar-height";

const Data = {
  mealTypes: [ "appetizer", "main course", "dessert", "drink", "cake",
               "noodles", "pasta", "bread", "breakfast", "lunch", "dinner", ],
  styles: {
    headerFontSize: 25,
    headerHeight: 60+getStatusBarHeight(),
    headerPaddingTop: getStatusBarHeight(),
    headerStandardColor: "#e8e8e8",
    standardPadding: 15,
    standardBlue: "rgb(0, 122, 255)",
    standardBlack: "#ddd",
    standardLightGray: "#f5f5f5",
    listItemHeight: 100,
    cardStyle: {
      backgroundColor: "white",
      padding: 15,
      borderRadius: 10,
      marginTop: 20,
      marginRight: 10,
      marginLeft: 10,
      shadowColor: "#ddd",
      shadowOffset: {width: 5, height: 5},
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
  },
  rules: {
    maxPhotosPerRecipe: 20,
    maxIngredientsPerRecipe: 40,
    maxCharPerIngredient: 50,
    maxCharRecipeTitle: 80,
    maxCharInstructions: 1000,
  }
}

export const Rules = Data.rules;
export const DefaultStyles = Data.styles;
export const MealTypes = Data.mealTypes;
export default Data;
