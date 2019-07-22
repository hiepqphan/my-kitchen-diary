import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";

import { FirebaseContext } from "./assets/components/Firebase";
import LoadingScreen from "./assets/components/LoadingScreen/loading-screen";
import LoginScreen from "./assets/components/LoginScreen/login-screen";
import HomeScreen from "./assets/components/HomeScreen/home-screen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppNavigator = createStackNavigator({
  Loading: LoadingScreen,
  Login: LoginScreen,
  Home: HomeScreen
},
{
  initialRouteName: "Loading",
  headerMode: "none",
  naviationOptions: {
    headerVisible: false
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
