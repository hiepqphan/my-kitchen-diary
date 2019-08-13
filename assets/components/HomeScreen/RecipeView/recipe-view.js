import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Modal, Image,
         ScrollView, TouchableOpacity, PanResponder, } from "react-native";
import SvgUri from "react-native-svg-uri";
import { LinearGradient } from "expo-linear-gradient";

import { DefaultStyles, Screen } from "../../Const/const";
import { IconChevronLeft, IconChevronUp } from "../../../icons/icons";
import Auth from "../../Authentication/authentication";
import IngredientItem from "../CreateRecipe/IngredientItem/ingredient-item";
import ImageView from "../../Utilities/ImagePicker/ImageView/image-view";
import Card from "../../UI/Card/card";
import MyMath from "../../Utilities/Math/math";
import BackgroundImage from "../../UI/BackgroundImage/background-image";
import { NotFoundIngredients, NotFoundInstructions } from "../../UI/NotFoundDisplay/not-found-display";

export default class RecipeView extends Component {
  constructor(props) {
    super(props);
    this.state = { photoSize: (Screen.width-10-40-9)/4,
                   scrollEnabled: true, };

    this.data = this.props.navigation.getParam("data", {});
    this.state.recipeTitle = this.data.recipeTitle;
    this.state.ingredients = this.data.ingredients;
    this.state.instructions = this.data.instructions;
    this.state.photos = this.data.photos;

    this.defaultPhoto = [{ uri: "../../../images/default_recipe_photo.png" }]

    this.panResponderSetup = PanResponder.create({
      onStartShouldSetPanResponder: (event) => true,
      onMoveShouldSetPanResponder: (event) => true,
      onPanResponderMove: this.scrollToTopHandler,
    });
  }

  closeView = () => {
    this.props.navigation.navigate("Home");
  }

  scrollControl = (event) => {
    let pos = event.nativeEvent.contentOffset.y;
    if (pos === Screen.height)
      this.setState({ scrollEnabled: false });
    else
      this.setState({ scrollEnabled: true });
  }

  scrollToTopHandler = (event, gestureState) => {
    if (MyMath.isSwipingDown(gestureState) && Math.abs(gestureState.vy) >= 0.5) {
      this.scrollView.scrollTo({ y: 0, animated: true });
      this.setState({ scrollEnabled: true });
    }
  }

  renderImage = ({item}) => {
    return (
      <View>
        <Image source={{ uri: null }} style={{ width: Screen.width, height: Screen.height }}/>
      </View>
    );
  }

  renderImageDefault = ({item}) => {
    return (
      <View>
        <Image source={require("../../../images/default_recipe_photo.png")} style={{ width: Screen.width, height: Screen.height }}/>
      </View>
    )
  }

  render() {

    let ingredients = this.state.ingredients.map((item, index) => (
      <IngredientItem editable={false} ingredientText={item.ingredient}
                      quantityText={item.quantity} style={{ marginTop: index !== 0 ? 3 : 0 }}
                      quantityPlaceholder=""
                      key={index}/>
    ));

    return (
      <ScrollView style={{  }} snapToOffsets={[Screen.height]} decelerationRate="fast" showsVerticalScrollIndicator={false}
                  onScroll={this.scrollControl} scrollEnabled={this.state.scrollEnabled}
                  ref={(ref) => this.scrollView = ref}>
        <View style={styles.fullheight}>
          <View style={{ ...styles.header, position: "absolute", top: 0, left: 0, zIndex: 2, backgroundColor: "none" }}>
            <View style={styles.option}>
              <TouchableOpacity onPress={this.closeView}>
                <SvgUri svgXmlData={IconChevronLeft} width="20" height="20" fill="#ff6633"/>
              </TouchableOpacity>
            </View>
            <View style={styles.option}>

            </View>
          </View>

          <FlatList horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.photos.length > 0 ? this.state.photos : this.defaultPhoto}
                    renderItem={this.state.photos.length > 0 ? this.renderImage : this.renderImageDefault}
                    snapToInterval={Screen.width}
                    decelerationRate="fast"/>

          <LinearGradient colors={["rgba(255, 255, 255, 0.0)", "rgba(255, 255, 255, 1.0)"]}
                          style={{ position: "absolute", left: 0, bottom: 0, zIndex: 2, width: "100%", height: 200 }}/>

          <View style={{ position: "absolute", left: 0, bottom: 0, zIndex: 3, width: "100%",
                         padding: 10, paddingTop: 0, paddingBottom: 40 }}>
            {this.state.recipeTitle !== "" ?
            <Text style={{ fontSize: 25 }}>{this.state.recipeTitle}</Text> :
            <Text style={{ fontSize: 25, fontStyle: "italic" }}>No title</Text>}
          </View>
        </View>

        <View style={[styles.container, styles.fullheight]}>
          <View style={{...styles.header, ...styles.recipeHeader }} {...this.panResponderSetup.panHandlers}>
            <View style={{ backgroundColor: DefaultStyles.standardBlack, width: 35, height: 8, borderRadius: 4, marginTop: 5}}/>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              {this.state.recipeTitle !== "" ?
              <Text style={{ fontSize: DefaultStyles.headerFontSize }} numberOfLines={1}>{this.state.recipeTitle}</Text> :
              <Text style={{ fontSize: DefaultStyles.headerFontSize, fontStyle: "italic" }}>No title</Text>}
            </View>
          </View>

          <ScrollView style={styles.body}>
            <Card style={styles.section}>
              <BackgroundImage source={require("../../../images/header_ingredients.png")} style={styles.backgroundImage}>
                <View style={styles.subheader}>
                  <Text style={styles.subtitle}>Ingredients</Text>
                </View>
              </BackgroundImage>

              <View style={styles.subbody}>
                {ingredients.length > 0 ? ingredients :
                <NotFoundIngredients/>}
              </View>
            </Card>

            <Card style={{ ...styles.section, marginBottom: 20, }}>
              <BackgroundImage source={require("../../../images/header_instructions.png")} style={styles.backgroundImage}>
                <View style={styles.subheader}>
                  <Text style={styles.subtitle}>Instructions</Text>
                </View>
              </BackgroundImage>
              <View style={styles.subbody}>
                {this.state.instructions !== "" ?
                <Text>{this.state.instructions}</Text> :
                <NotFoundInstructions/>}
              </View>
            </Card>

          </ScrollView>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  fullheight: {
    position: "relative",
    top: 0,
    left: 0,
    height: Screen.height,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
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
    paddingRight: DefaultStyles.standardPadding,
    paddingLeft: DefaultStyles.standardPadding,
  },
  recipeHeader: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 0.5,
    borderBottomColor: DefaultStyles.standardBlack,
  },
  body: {
    // flex: 11,
    backgroundColor: DefaultStyles.standardLightGray,
  },
  option: {
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  section: {
    padding: 0,
  },
  subtitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  topsection: {

  },
  subheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  subbody: {
    marginTop: 10,
    padding: 20,
    paddingTop: 0,
  },
  backgroundImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  }
})
