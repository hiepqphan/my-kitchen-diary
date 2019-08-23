import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Font from "expo-font";

import Firebase, { FirebaseContext } from "../Firebase";
import Auth from "../Authentication/authentication";

export default class LoadingScreen extends Component {

  componentDidMount() {
    let pathToFont = "../../fonts/";
    Font.loadAsync({
      "open-sans": require(pathToFont+"OpenSans-Regular.ttf"),
      "open-sansitalic": require(pathToFont+"OpenSans-RegularItalic.ttf"),
      "open-sanslight": require(pathToFont+"OpenSans-Light.ttf"),
      "open-sanslightitalic": require(pathToFont+"OpenSans-LightItalic.ttf"),
      "open-sanssemibold": require(pathToFont+"OpenSans-SemiBold.ttf"),
      "open-sanssemibolditalic": require(pathToFont+"OpenSans-SemiBoldItalic.ttf"),
      "open-sansbold": require(pathToFont+"OpenSans-Bold.ttf"),
      "open-sansbolditalic": require(pathToFont+"OpenSans-BoldItalic.ttf"),
      "open-sansextrabold": require(pathToFont+"OpenSans-ExtraBold.ttf"),
      "open-sansextrabolditalic": require(pathToFont+"OpenSans-ExtraBoldItalic.ttf"),
    }).then(() => {
      Firebase.auth().onAuthStateChanged(user => {
        this.props.navigation.navigate(user ? "Home" : "Login");
      });
    });
  }

  render() {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
}
