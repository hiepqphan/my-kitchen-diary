import { getStatusBarHeight } from "react-native-status-bar-height";
import { Dimensions } from "react-native";
import * as FileSystem from "expo-file-system";

const Data = {
  mealTypes: [ "appetizer", "main course", "dessert", "drink", "other", ],
  styles: {
    headerFontSize: 22,
    headerHeight: 50+getStatusBarHeight(),
    headerHeightModalAndroid: 50,
    headerPaddingTop: getStatusBarHeight(),
    headerStandardColor: "#e8e8e8",
    standardPadding: 15,
    standardBlue: "rgb(0, 122, 255)",
    standardBlack: "#ddd",
    standardLightGray: "rgb(229, 229, 234)",
    listItemHeight: 100,
    navbarIndicatorWidth: Dimensions.get("window").width / 4,
    navbarHeight: 60,
  },
  colors: {
    turquoise: "#35d0ba",
    turquoise_tint: "#89d0c6",
    bisque: "#fefed5",
    yellow: "#ffcd3c",
    yellow_tint: "#ffecb0",
    orange: "#ff9234",
    orange_tint: "#ffb070",
    lightgray: "rgb(229, 229, 234)",
    gray: "rgb(199, 199, 204)",
    black: "#3d3935",
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
  },
  paths: {
    cachedRecipes: FileSystem.documentDirectory+"/cache/recipes/",
  }
}

export const Colors = Data.colors;
export const Paths = Data.paths;
export const Screen = Data.screen;
export const Rules = Data.rules;
export const DefaultStyles = Data.styles;
export const MealTypes = Data.mealTypes;
export default Data;
