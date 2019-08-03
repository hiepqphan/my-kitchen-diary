import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Modal,
         Platform, StatusBar, ScrollView, PanResponder,
         Animated} from "react-native";

import Firebase, { FirebaseContext } from "../Firebase";
import Header from "./Header/header";
import { DefaultStyles } from "../Const/const";
import RecipeItem from "./RecipeItem/recipe-item";
import Auth from "../Authentication/authentication";
import RecipeView from "./RecipeView/recipe-view";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { lastRecipe: null,
                   recipes: [],
                   hasMoreRecipes: true,
                   hasResponder: { index: null, released: true },
                   currentRecipeData: null,
                   currentRecipeId: null,
                   showRecipeModal: false, };
  }

  componentDidMount() {
    this.getOneRecipePage();
  }

  openCreateRecipe = () => {
    this.props.navigation.navigate("CreateRecipe");
  }

  getOneRecipePage = () => {
    if (this.state.hasMoreRecipes) {
      let limit = 20;
      Auth.getRecipes(this.state.lastRecipe, limit).then(result => {
        this.setState({ lastRecipe: result[result.length-1],
                        recipes: this.state.recipes.concat(result) });

        if (result.length < limit)
          this.setState({ hasMoreRecipes: false });
      });
    }
  }

  rerenderItemHandler = (index, released) => {
    this.setState({ hasResponder: { index: index, released: released } });
  }

  showRecipe = (index) => {
    this.setState({ currentRecipeData: this.state.recipes[index].data(),
                    currentRecipeId: this.state.recipes[index].id,
                    showRecipeModal: true, });
  }

  closeRecipeModal = () => {
    this.setState({ showRecipeModal: false, })
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal visible={this.state.showRecipeModal} animationType="slide">
          <RecipeView data={this.state.currentRecipeData} recipeId={this.state.currentRecipeId}
                      handleClose={this.closeRecipeModal} />
        </Modal>
        <Header title="Recipes" styleList={[styles.header]} createRecipeHandler={this.openCreateRecipe}/>
        <View style={styles.recipesContainer}>
          <FlatList data={this.state.recipes}
                    extraData={this.state.hasResponder}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={ ({item, index}) => <RecipeItem index={index} data={item.data()} rerender={this.rerenderItemHandler}
                                                                hasResponder={this.state.hasResponder.index === index}
                                                                showRecipe={this.showRecipe} /> }
                    onEndReached={this.getOneRecipePage}/>
        </View>

        <View style={{ height: 60, width: "100%", backgroundColor: "orange" }}>

        </View>
        {
          //<Text>{Firebase.auth().currentUser.displayName}</Text>
      }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingTop: DefaultStyles.headerHeight,
  },
  header: {

  },
  recipesContainer: {
    flex: 1,
    width: "100%",
  }
});
