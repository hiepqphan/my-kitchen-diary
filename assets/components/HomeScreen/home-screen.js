import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Modal,
         Platform, StatusBar, ScrollView } from "react-native";

import Firebase, { FirebaseContext } from "../Firebase";
import Header from "./Header/header";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  openCreateRecipe = () => {
    this.props.navigation.navigate("CreateRecipe");
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Recipes" styleList={[styles.header]} createRecipeHandler={this.openCreateRecipe}/>

        <View style={styles.recipesContainer}>
          <FlatList/>
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
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
  },
  header: {
    width: "100%",
    height: 60,
  },
  recipesContainer: {
    flex: 1
  }
});
