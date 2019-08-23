import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList, Modal, Image,
         ScrollView, TouchableOpacity, PanResponder,
         Platform, Animated } from "react-native";
import SvgUri from "react-native-svg-uri";
import { LinearGradient } from "expo-linear-gradient";
import { Video } from "expo-av";

import { DefaultStyles, Screen, Colors } from "../../Const/const";
import { IconChevronLeft, IconChevronUp } from "../../../icons/icons";
import Auth from "../../Authentication/authentication";
import IngredientItem from "../CreateRecipe/IngredientItem/ingredient-item";
import ImageView from "../../Utilities/ImagePicker/ImageView/image-view";
import Card from "../../UI/Card/card";
import MyMath from "../../Utilities/Math/math";
import BackgroundImage from "../../UI/BackgroundImage/background-image";
import { NotFoundIngredients, NotFoundInstructions } from "../../UI/NotFoundDisplay/not-found-display";
import MyText, { TextSubtitle } from "../../UI/Text/text";

export default class RecipeView extends Component {
  constructor(props) {
    super(props);
    this.state = { photoSize: (Screen.width-10-40-9)/4,
                   scrollEnabled: true,
                   loaded: !this.props.navigation.getParam("needCached", false),
                   currentView: "ingredients",
                   indicatorShift: new Animated.Value(0),
                   indicatorTop: 0,
                   indicatorWidth: 0, };

    this.data = this.props.navigation.getParam("data", {});
    this.recipeId = this.props.navigation.getParam("id", null);
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

  componentDidMount() {
    if (!this.state.loaded) {
      let cacheAssets = this.props.navigation.getParam("cacheAssets", null);
      if (cacheAssets)
        cacheAssets(this.recipeId, this.data, () => {
          this.setState({ loaded: true });
        });
    }
  }

  render() {
    let ingredients = this.state.ingredients.map((item, index) => (
      <IngredientItem editable={false} ingredientText={item.ingredient} index={index}
                      quantityText={item.quantity} style={{ marginTop: index !== 0 ? 5 : 0 }}
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

          {this.state.loaded ?
          <FlatList horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    data={this.state.photos.length > 0 ? this.state.photos : this.defaultPhoto}
                    renderItem={this.state.photos.length > 0 ? this.renderImage : this.renderImageDefault}
                    snapToInterval={Screen.width}
                    decelerationRate="fast"/> :
          <Video source={{ uri: "" }} style={{ width: Screen.width, height: Screen.height }} resizeMode="cover"
                 useNativeControls={false} shouldPlay isLooping/>}

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
          <View style={{ ...styles.header, ...styles.recipeHeader }} {...this.panResponderSetup.panHandlers}>
            <View style={{ backgroundColor: DefaultStyles.standardBlack, width: 35, height: 8, borderRadius: 4, marginTop: 5}}/>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              {this.state.recipeTitle !== "" ?
              <Text style={{ fontSize: DefaultStyles.headerFontSize }} numberOfLines={1}>{this.state.recipeTitle}</Text> :
              <Text style={{ fontSize: DefaultStyles.headerFontSize, fontStyle: "italic" }}>No title</Text>}
            </View>
          </View>
          <View style={{ ...styles.navbar }} onLayout={this.navbarIndicatorHandler}>
            <Animated.View style={{ ...styles.indicator, top: this.state.indicatorTop, width: this.state.indicatorWidth, transform: [{ translateX: this.state.indicatorShift }], }}/>

            <TouchableOpacity style={styles.navbarOption} onPress={this.ingredientsOnPress}>
              <MyText style={{ color: this.state.currentView === "ingredients" ? Colors.orange : Colors.gray, fontWeight: "500", }}>Ingredients</MyText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navbarOption} onPress={this.instructionsOnPress}>
              <MyText style={{ color: this.state.currentView === "instructions" ? Colors.orange : Colors.gray, fontWeight: "500" }}>
                Instructions
              </MyText>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            {this.state.currentView === "ingredients" &&
            <View style={styles.section}>
              <View style={styles.subheader}>
                {false && <TextSubtitle style={styles.subtitle}>Ingredients</TextSubtitle>}
              </View>

              <View style={styles.subbody}>
                {ingredients.length > 0 ? ingredients :
                <NotFoundIngredients/>}
              </View>
            </View>}

            {this.state.currentView === "instructions" &&
            <View style={{ ...styles.section, }}>
              <View style={styles.subheader}>
                {false && <TextSubtitle style={styles.subtitle}>Instructions</TextSubtitle>}
              </View>

              <View style={styles.subbody}>
                {this.state.instructions !== "" ?
                <MyText>{this.state.instructions}</MyText> :
                <NotFoundInstructions/>}
              </View>
            </View>}

          </ScrollView>
        </View>
      </ScrollView>
    );
  }

  ingredientsOnPress = () => {
    this.setState({ currentView: "ingredients" });
    this.animateIndicatorTo("ingredients");
  }

  instructionsOnPress = () => {
    this.setState({ currentView: "instructions"});
    this.animateIndicatorTo("instructions");
  }

  animateIndicatorTo = (section) => {
    Animated.timing(this.state.indicatorShift, {
      toValue: this.targetShift[section],
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  navbarIndicatorHandler = (event) => {
    let width = event.nativeEvent.layout.width;
    let height = event.nativeEvent.layout.height;
    let shift = width/100*20/4;
    let indicatorWidth = width/100*40;
    this.targetShift = { ingredients: shift, instructions: shift+indicatorWidth+shift*2 };
    this.setState({ indicatorTop: height-4, indicatorShift: new Animated.Value(shift), indicatorWidth: indicatorWidth });
  }

  closeView = () => {
    this.props.navigation.navigate("Home");
  }

  scrollControl = (event) => {
    let pos = event.nativeEvent.contentOffset.y;
    if (pos >= Screen.height/2)
      this.setState({ scrollEnabled: false });
    else
      this.setState({ scrollEnabled: true });
  }

  scrollToTopHandler = (event, gestureState) => {
    if (MyMath.isSwipingDown(gestureState) && Math.abs(gestureState.vy) >= 0.5) {
      this.scrollView.scrollTo(Platform.OS === "android" ? { y: 0, duration: 500 } : { y: 0, animated: true });
      this.setState({ scrollEnabled: true });
    }
    else {
      this.scrollView.scrollToEnd({ animated: true });
    }
  }

  renderImage = ({item}) => {
    return (
      <View>
        <Image source={{ uri: item.node.image.uri, cache: "force-cache", }} style={{ width: Screen.width, height: Screen.height }}/>
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
    // borderBottomWidth: 0.5,
    borderBottomColor: DefaultStyles.standardBlack,
  },
  navbar: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightgray,
  },
  navbarOption: {
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
    height: 30,
  },
  indicator: {
    position: "absolute",
    zIndex: 2,
    left: 0,
    borderBottomWidth: 4,
    borderBottomColor: Colors.orange,
  },
  body: {
    // flex: 11,
    backgroundColor: "white",
  },
  option: {
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  section: {
    padding: 0,
    margin: DefaultStyles.standardPadding,
    marginBottom: 100,
  },
  subtitle: {

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
    padding: 20,
    paddingTop: 0,
  },
  backgroundImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  }
})
