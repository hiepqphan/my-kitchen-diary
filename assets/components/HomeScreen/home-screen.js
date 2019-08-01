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

  getOneRecipePage = () => {
//     var first = db.collection("cities")
//         .orderBy("population")
//         .limit(25);
//
// return first.get().then(function (documentSnapshots) {
//   // Get the last visible document
//   var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
//   console.log("last", lastVisible);
//
//   // Construct a new query starting at this document,
//   // get the next 25 cities.
//   var next = db.collection("cities")
//           .orderBy("population")
//           .startAfter(lastVisible)
//           .limit(25);
// });
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
  },
  header: {
    
  },
  recipesContainer: {
    flex: 1
  }
});
