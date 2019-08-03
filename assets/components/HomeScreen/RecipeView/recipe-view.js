import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Modal,
         Platform, StatusBar, ScrollView, TouchableOpacity,
         Dimensions, } from "react-native";
import SvgUri from "react-native-svg-uri";

import { DefaultStyles } from "../../Const/const";
import { IconChevronLeft } from "../../../icons/icons";
import Auth from "../../Authentication/authentication";
import IngredientItem from "../CreateRecipe/IngredientItem/ingredient-item";
import ImageView from "../../Utilities/ImagePicker/ImageView/image-view";

export default class RecipeView extends Component {
  constructor(props) {
    super(props);
    this.state = { instructions: this.props.data.instructions,
                   photoSize: (Dimensions.get("window").width-10-40-9)/4 };
  }

  render() {

    let ingredients = this.props.data.ingredients.map((item, index) => (
      <IngredientItem editable={false} ingredientText={item.ingredient}
                      quantityText={item.quantity} style={{ marginTop: index !== 0 ? 3 : 0 }}
                      quantityPlaceholder=""
                      key={index}/>
    ));

    let photos = this.props.data.photos.map((item, index) => (
      <ImageView key={index} index={index} uri={item.node.image.uri} size={this.state.photoSize}
                 style={{ marginRight: index % 4 !== 3 ? 3 : 0, }}/>
    ));

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.option}>
            <TouchableOpacity onPress={this.props.handleClose}>
              <SvgUri svgXmlData={IconChevronLeft} width="20" height="20"/>
            </TouchableOpacity>
          </View>
          {this.props.data.recipeTitle !== "" ?
          <Text style={{ fontSize: 25 }}>{this.props.data.recipeTitle}</Text> :
          <Text style={{ fontSize: 25, fontStyle: "italic" }}>No title</Text>}
          <View style={styles.option}>

          </View>
        </View>

        <ScrollView style={styles.body}>
          <View style={styles.topsection}>

          </View>

          <View style={styles.section}>
            <View style={styles.subheader}>
              <Text style={styles.subtitle}>Ingredients</Text>
            </View>
            <View style={styles.subbody}>
              {ingredients}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.subheader}>
              <Text style={styles.subtitle}>Instructions</Text>
            </View>
            <View style={styles.subbody}>
              <Text>{this.state.instructions}</Text>
            </View>
          </View>

          <View style={[styles.section, { marginBottom: 20 }]}>
            <View style={styles.subheader}>
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <Text style={styles.subtitle}>
                  Images
                </Text>
              </View>
            </View>
            <View style={[styles.subbody, { flexDirection: "row", flexWrap: "wrap", }]}>
              {photos}
            </View>
          </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultStyles.standardLightGray,
    width: "100%",
  },
  header: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: DefaultStyles.headerHeight,
    paddingTop: DefaultStyles.headerPaddingTop,
    paddingRight: 20,
    paddingLeft: 20,
  },
  body: {
    // flex: 11,
  },
  option: {
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  topsection: {
    backgroundColor: "white",
    padding: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  subheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subbody: {
    marginTop: 10,
  },
})
