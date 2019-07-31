const Data = {
  mealTypes: [ "appetizer", "main course", "dessert", "drink", "cake",
               "noodles", "pasta", "bread", "breakfast", "lunch", "dinner", ],
  styles: {
    headerFontSize: 25,
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
