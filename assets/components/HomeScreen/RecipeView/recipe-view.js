import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Modal, Image,
         ScrollView, TouchableOpacity, PanResponder, } from "react-native";
import SvgUri from "react-native-svg-uri";
import { LinearGradient } from "expo-linear-gradient";

import { DefaultStyles, Screen } from "../../Const/const";
import { IconChevronLeft } from "../../../icons/icons";
import Auth from "../../Authentication/authentication";
import IngredientItem from "../CreateRecipe/IngredientItem/ingredient-item";
import ImageView from "../../Utilities/ImagePicker/ImageView/image-view";
import Card from "../../UI/Card/card";
import MyMath from "../../Utilities/Math/math";

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
        <Image source={{ uri: 'https://facebook.github.io/react-native/img/tiny_logo.png' }} style={{ width: Screen.width, height: Screen.height }}/>
      </View>
    );
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
                    data={this.state.photos}
                    renderItem={this.renderImage}
                    snapToInterval={Screen.width}
                    decelerationRate="fast"/>

          <LinearGradient colors={["rgba(255, 255, 255, 0.0)", "rgba(255, 255, 255, 0.2)"]}
                          style={{ position: "absolute", left: 0, bottom: 0, zIndex: 2, width: "100%", height: 200 }}/>

          <View style={{ position: "absolute", left: 0, bottom: 0, zIndex: 3, width: "100%",
                         padding: 10, paddingTop: 0, paddingBottom: 20 }}>
            <Text style={{ fontSize: 25 }}>{this.state.recipeTitle}</Text>
          </View>
        </View>

        <View style={[styles.container, styles.fullheight]}>
          <View style={styles.header} {...this.panResponderSetup.panHandlers}>
            <TouchableOpacity style={{ flex: 1, alignItems: "center", justifyContent: "center" }} activeOpacity={0.8}>
              {this.state.recipeTitle !== "" ?
              <Text style={{ fontSize: 25 }} numberOfLines={1}>{this.state.recipeTitle}</Text> :
              <Text style={{ fontSize: 25, fontStyle: "italic" }}>No title</Text>}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            <Card style={styles.section}>
              <View style={styles.subheader}>
                <Text style={styles.subtitle}>Ingredients</Text>
              </View>
              <View style={styles.subbody}>
                {ingredients}
              </View>
            </Card>

            <Card style={styles.section}>
              <View style={styles.subheader}>
                <Text style={styles.subtitle}>Instructions</Text>
              </View>
              <View style={styles.subbody}>
                <Text>{this.state.instructions}</Text>
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
  body: {
    // flex: 11,
  },
  option: {
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  section: {

  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  topsection: {

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
