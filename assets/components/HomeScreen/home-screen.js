import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Modal,
         Platform, StatusBar, ScrollView, TouchableOpacity,
         Animated, Dimensions, Image, } from "react-native";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

import Firebase, { FirebaseContext } from "../Firebase";
import Header from "./Header/header";
import { DefaultStyles, Paths } from "../Const/const";
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
                   indicatorShift: new Animated.Value(0),
                   loadingRecipes: false, };

    this.focusListener = this.props.navigation.addListener("didFocus", this.animateNavbar);
    this.cachedRecipes = {};

    this.props.navigation.setParams({ fromOtherTab: false, });
  }

  componentDidMount() {
    this.getOneRecipePage();
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Recipes" styleList={[styles.header]} createRecipeHandler={this.openCreateRecipe}/>
        <View style={styles.recipesContainer}>
          <FlatList data={this.state.recipes}
                    extraData={this.state.hasResponder}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={ ({item, index}) => <RecipeItem index={index} data={item.data()} id={item.id}
                                                                showRecipe={this.showRecipe}/> }
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

      </View>
    );
  }

  cacheImages = (images) => {
    return images.map(image => {
      if (image === "")
        return null;

    });
  }

  cacheRecipeAssets = async (id, data) => {
    let photos = data.photos.map((item) => (
      item.node.image.uri
    ));
    photos = photos.slice(1);
    photos = this.cacheImages(photos);

    await Promise.all([...photos]);
  }

  cacheRecipesThumbnail = async (recipes) => {
    let photos = recipes.map((item) => {
      if (item.data().photos.length > 0)
        return { id: item.id, uri: item.data().photos[0].node.image.uri };
      else
        return "";
    });

    let check = (count) => {
      if (count === photos.length)
        this.setState({ lastRecipe: recipes[recipes.length-1],
                        recipes: this.state.recipes.concat(recipes),
                        loadingRecipes: false, });
    };

    let count = 0;

    photos.map(photo => {
      if (photo !== "")
        FileSystem.getInfoAsync(Paths.cachedRecipes+photo.id+"/0.png").then(({ exists }) => {
            if (!exists) {
              FileSystem.makeDirectoryAsync(Paths.cachedRecipes+photo.id, { intermediates: true }).then(() => {
                FileSystem.downloadAsync(photo.uri, Paths.cachedRecipes+photo.id+"/0.png").then(() => {
                  ++count;
                  check(count);
                });
              });
            }
            else {
              ++count;
              check(count);
            }
          });
      else {
        ++count;
        check(count);
      }
    })
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
      this.setState({ loadingRecipes: true });

      let limit = 20;
      Auth.getRecipes(this.state.lastRecipe, limit).then(result => {
        if (result.length > 0)
          this.cacheRecipesThumbnail(result);

        if (result.length < limit)
          this.setState({ hasMoreRecipes: false });
      });
    }
  }

  showRecipe = (index) => {
    let recipeId = this.state.recipes[index].id;
    FileSystem.getInfoAsync(Paths.cachedRecipes+recipeId).then(({ exists }) => {
      let needCached = !exists;
      this.props.navigation.navigate("Recipe", { data: this.state.recipes[index].data(),
                                                 id: recipeId,
                                                 needCached: needCached,
                                                 cacheAssets: this.cacheRecipeAssets, });
    });
  }

  goToCookedMealScreen = () => {
    this.props.navigation.navigate("Meal");

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
