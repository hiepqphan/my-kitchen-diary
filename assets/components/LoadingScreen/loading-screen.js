import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import Firebase, { FirebaseContext } from "../Firebase";
import Auth from "../Authentication/authentication";

export default class LoadingScreen extends Component {

  componentDidMount() {
    Firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? "Home" : "Login");
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
