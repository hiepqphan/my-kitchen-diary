import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Modal,
         Platform, StatusBar, ScrollView, TouchableOpacity,
         Animated, Dimensions, } from "react-native";

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
                   indicatorShift: new Animated.Value(0), };

    this.focusListener = this.props.navigation.addListener("didFocus", this.animateNavbar);
    this.props.navigation.setParams({ fromOtherTab: false, });
  }

  componentDidMount() {
    this.getOneRecipePage();
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  animateNavbar = () => {
    let parent = this.props.navigation.dangerouslyGetParent();
    if (parent && parent.getParam("fromOtherTab")) {
      parent.setParams({ fromOtherTab: false });
      this.state.indicatorShift.setValue(DefaultStyles.navbarIndicatorWidth*2);
      Animated.timing(this.state.indicatorShift, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
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
    // this.setState({ hasResponder: { index: index, released: released } });
  }

  showRecipe = (index) => {
    this.props.navigation.navigate("Recipe", { data: this.state.recipes[index].data(),
                                               id: this.state.recipes[index].id });
  }

  goToCookedMealScreen = () => {
    this.props.navigation.navigate("Meal");

  }

  render() {
    return (
      <View style={styles.container}>
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

        <View style={styles.navbar}>
          <Animated.View style={[styles.indicator, { transform: [{translateX: this.state.indicatorShift}] }]}/>
          <View style={styles.navbarOption}>
            <TouchableOpacity style={styles.navbarButton} activeOpacity={1}>

            </TouchableOpacity>
          </View>

          <View style={styles.navbarOption}>
            <TouchableOpacity style={styles.navbarButton} onPress={this.goToCookedMealScreen} activeOpacity={1}>

            </TouchableOpacity>
          </View>
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
  },
  header: {

  },
  recipesContainer: {
    flex: 1,
    width: "100%",
  },
  navbar: {
    position: "relative",
    flexDirection: "row",
    width: "100%",
    height: 60,
    borderTopWidth: 0.5,
    borderTopColor: DefaultStyles.standardBlack,
  },
  navbarOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  navbarButton: {
    backgroundColor: "azure",
    width: "50%",
    height: "100%",
  },
  indicator: {
    position: "absolute",
    zIndex: 2,
    top: 0,
    left: DefaultStyles.navbarIndicatorWidth/2,
    width: DefaultStyles.navbarIndicatorWidth,
    borderTopWidth: 4,
    borderTopColor: "#ff6633",
  },
});
