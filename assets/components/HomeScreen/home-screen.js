import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

import Firebase, { FirebaseContext } from "../Firebase";
import Header from "./Header/header";

export default class HomeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Header title="Recipes" styleList={[styles.header]}/>
        <View style={styles.recipesContainer}>
          <FlatList/>
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
    width: "100%"
  },
  header: {
    flex: 1,
    width: "100%",
  },
  recipesContainer: {
    flex: 9
  }
});
