import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from "react-navigation";

import { FirebaseContext } from "./assets/components/Firebase";
import LoadingScreen from "./assets/components/LoadingScreen/loading-screen";
import LoginScreen from "./assets/components/LoginScreen/login-screen";
import HomeScreen from "./assets/components/HomeScreen/home-screen";
import CreateRecipeScreen from "./assets/components/HomeScreen/CreateRecipe/create-recipe";

const HomeScreenNavigator = createBottomTabNavigator({
  Home: HomeScreen,
  CreateRecipe: CreateRecipeScreen,
},
{
  initialRouteName: "Home",
  defaultNavigationOptions: {
    tabBarVisible: false,
  }
});

const AppNavigator = createStackNavigator({
  Loading: LoadingScreen,
  Login: LoginScreen,
  Home: HomeScreenNavigator,
},
{
  initialRouteName: "Loading",
  headerMode: "none",
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return (
      <AppContainer />
    );
  }
}
