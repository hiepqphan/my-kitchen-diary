import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from "react-navigation";

import { FirebaseContext } from "./assets/components/Firebase";
import LoadingScreen from "./assets/components/LoadingScreen/loading-screen";
import LoginScreen from "./assets/components/LoginScreen/login-screen";
import HomeScreen from "./assets/components/HomeScreen/home-screen";
import CreateRecipeScreen from "./assets/components/HomeScreen/CreateRecipe/create-recipe";
import RecipeView from "./assets/components/HomeScreen/RecipeView/recipe-view";
import CookedMealScreen from "./assets/components/CookedMealScreen/cooked-meal-screen";
import MainScreensContainer from "./assets/components/MainScreensContainer/main-screens-container";

const AppNavigator = createStackNavigator({
  Loading: LoadingScreen,
  Login: LoginScreen,
  Home: MainScreensContainer,
},
{
  initialRouteName: "Loading",
  headerMode: "none",
  defaultNavigationOptions: {
    gesturesEnabled: false,
  }
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {

  render() {
    return (
      <AppContainer />
    );
  }
}
