import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Alert,
         TouchableOpacity, TextInput, ScrollView, Modal,
         Dimensions, Platform, StatusBar, Animated, BackHandler,
         Keyboard, UIManager, } from "react-native";
import SvgUri from "react-native-svg-uri";
import { Overlay } from "react-native-elements";

import { MealTypes, DefaultStyles, Rules, } from "../../Const/const";
import MealTypeItem from "./MealTypeItem/meal-type-item";
import Ingredient from "./IngredientItem/ingredient-item";
import ImagePicker from "../../Utilities/ImagePicker/image-picker";
import ImageView from "../../Utilities/ImagePicker/ImageView/image-view";
import { IconCamera, IconPlus, IconMinusRound, IconChevronLeft } from "../../../icons/icons";
import Auth from "../../Authentication/authentication";
import KeyboardSafeView from "../../UI/KeyboardSafeView/keyboard-safe-view";
import LoadingOverlay from "../../UI/LoadingOverlay/loading-overlay";

export default class CreateRecipe extends Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this.state = { ingredients: [],
                   isMealTypeSelected: [],
                   ingredients: [],
                   recipeTitle: "",
                   recipeNameOnFocus: false,
                   instructions: "",
                   showImagePicker: false,
                   selectedPhotos: [],
                   isEditingPhotos: false,
                   selectedEditPhotos: [],
                   isCreatingRecipe: false,
                   currentOpacity: new Animated.Value(0),
                   showHeaderShadow: false, };

    this.paddingWhenEditing = 5;
    this.windowWidth = Dimensions.get("window").width;
    this.state.photoSize = (this.windowWidth - 3*3 - 40) / 4;
    this.defaultShiftX = 0;
    this.transitionShiftX = this.windowWidth;
    this.state.screenShiftX = new Animated.Value(this.transitionShiftX);

    // Custom back behavior on Android
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.closeRecipeScreen)
    );
  }

  componentDidMount() {
    this.onFocusListener = this.props.navigation.addListener("didFocus", () => {
      Animated.parallel([
        Animated.timing(this.state.currentOpacity,
          {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }
        ),
        Animated.timing(this.state.screenShiftX,
          {
            toValue: this.defaultShiftX,
            duration: 200,
            useNativeDriver: true,
          })
      ]).start();
    });

    // Custom back behavior on Android
    this._willBlurSubscription = this.props.navigation.addListener("willBlur", payload =>
      BackHandler.removeEventListener("hardwareBackPress", this.closeRecipeScreen)
    );
  }

  componentWillUnmount() {
    this.onFocusListener.remove();
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  closeRecipeScreen = () => {
    Animated.parallel([
      Animated.timing(this.state.currentOpacity,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }
      ),
      Animated.timing(this.state.screenShiftX,
        {
          toValue: this.transitionShiftX,
          duration: 200,
          useNativeDriver: true,
        })
    ]).start();

    setTimeout(() => this.props.navigation.navigate("Home"), 200);
  }

  mealTypeHandler = (item) => {
    let newState = this.state.isMealTypeSelected;
    if (newState.includes(item))
      newState = newState.filter(type => type !== item);
    else
      newState.push(item);

    this.setState({ isMealTypeSelected: newState });
  }

  addIngredientInput = () => {
    if (this.state.ingredients.length < Rules.maxIngredientsPerRecipe)
      this.setState({ ingredients: this.state.ingredients.concat([{ingredient: "", quantity: ""}]) });
  }

  removeIngredientInput = (index) => {
    this.state.ingredients.splice(index, 1);
    let newState = this.state.ingredients;
    this.setState({ ingredients: newState });
  }

  ingredientChangeHandler = (event, index) => {
    let newState = this.state.ingredients;
    newState[index].ingredient = event.nativeEvent.text;
    this.setState({ ingredients: newState });
  }

  quantityChangeHandler = (event, index) => {
    let newState = this.state.ingredients;
    newState[index].quantity = event.nativeEvent.text;
    this.setState({ ingredients: newState });
  }

  openImagePicker = () => {
    this.setState({ showImagePicker: true, isEditingPhotos: false, selectedEditPhotos: [] });
  }

  closeImagePicker = () => {
    this.setState({ showImagePicker: false });
  }

  onSubmitImagePicker = (photos) => {
    // Add `photos` to selected photos in state
    let len = this.state.selectedPhotos.length;
    let newPhotos = [];
    for (var i = 0; i < photos.length; ++i) {
      let exists = false;
      for (var j = 0; j < len; ++j)
        if (photos[i].node.image.uri === this.state.selectedPhotos[j].node.image.uri) {
          exists = true;
          break;
        }
      if (!exists && len + newPhotos.length < Rules.maxPhotosPerRecipe)
        newPhotos.push(photos[i]);
    }

    this.setState({ showImagePicker: false,
                    selectedPhotos: this.state.selectedPhotos.concat(newPhotos), });
  }

  selectPhotoHandler = (index) => {
    if (this.state.isEditingPhotos) {
      let newState = this.state.selectedEditPhotos;
      if (newState.includes(index)) {
        this.setState({ selectedEditPhotos: newState.filter(item => item !== index) });
      }
      else {
        this.setState({ selectedEditPhotos: newState.concat([index]) });
      }
    }
  }

  removePhotosHandler = () => {
    let oldState = this.state.selectedPhotos;
    let newState = [];
    for (var i = 0; i < oldState.length; ++i) {
      if (!this.state.selectedEditPhotos.includes(i))
        newState.push(oldState[i]);
    };

    this.setState({ selectedPhotos: newState, selectedEditPhotos: [] });

    if (newState.length === 0)
      this.setState({ isEditingPhotos: false, photoSize: (this.windowWidth - 3*3 - 40) / 4, });
  }

  createRecipe = () => {
    this.setState({ isCreatingRecipe: true });

    let data = { photos: this.state.selectedPhotos,
                 ingredients: this.state.ingredients,
                 instructions: this.state.instructions,
                 recipeTitle: this.state.recipeTitle,
                 tags: this.state.isMealTypeSelected, };

    if (typeof data.recipeTitle !== typeof "string")
      data.recipeTitle = "";
    if (typeof data.instructions !== typeof "string")
      data.instructions = "";

    let blobs = {};
    let blobCount = 0;
    for (let i = 0; i < data.photos.length; ++i) {
      fetch(data.photos[i].node.image.uri).then(response => response.blob()).then(blob => {
        blobs[i] = blob;
        ++blobCount;
        if (blobCount === data.photos.length) {
          data.blobs = blobs;
          Auth.createRecipe(data, this.createRecipeSuccessCallback);
        }
      });
    }

    // if (data.photos.length === 0)
    //   Auth.createRecipe(data, this.createRecipeSuccessCallback);
  }

  createRecipeSuccessCallback = () => {
    this.setState({ isCreatingRecipe: false,
                    selectedPhotos: [],
                    ingredients: [],
                    instructions: "",
                    recipeTitle: "",
                    tag});
  }

  render() {
    let mealTypesItems = MealTypes.map(item => (
      <MealTypeItem key={item} name={item} style={{ marginTop: 15, marginRight: 7.5, marginLeft: 7.5 }}
                    isSelected={this.state.isMealTypeSelected.includes(item)} onPressHandler={this.mealTypeHandler.bind(this)}/>
    ));

    let ingredients = this.state.ingredients.map((item, index) => (
      <Ingredient key={index} index={index} style={index === 0 ? { marginTop: 0 } : styles.ingredient} removeHandler={this.removeIngredientInput.bind(this)}
                  ingredientChangeHandler={this.ingredientChangeHandler}
                  quantityChangeHandler={this.quantityChangeHandler}
                  ingredientText={this.state.ingredients[index].ingredient}
                  quantityText={this.state.ingredients[index].quantity}
                  deleteIcon={IconMinusRound}/>
    ));

    let photos = this.state.selectedPhotos.map((item, index) => (
      <ImageView key={index} index={index} uri={item.node.image.uri} size={this.state.photoSize} style={[styles.photo, { marginTop: index < 4 ? 0 : 3, marginRight: index % 4 === 3 ? 0 : 3, }]}
                 selected={this.state.selectedEditPhotos.includes(index)} selectToggler={this.selectPhotoHandler}/>
    ));

    return(
      <KeyboardSafeView style={[styles.container, { opacity: this.state.currentOpacity, }]}
                        transform={[{translateX: this.state.screenShiftX}]}>
        <LoadingOverlay isVisible={this.state.isCreatingRecipe}/>

        <View style={[styles.header, { shadowOpacity: this.state.showHeaderShadow ? 0.3 : 0, elevation: this.state.showHeaderShadow ? 30 : 0 } ]}>
          <TouchableOpacity style={styles.option} onPress={this.closeRecipeScreen}>
            <SvgUri svgXmlData={IconChevronLeft} fill="#ff6633" width="20" height="20"/>
          </TouchableOpacity>
          <Text style={{ fontSize: DefaultStyles.headerFontSize, fontWeight: "600", color: "black" }}>New Recipe</Text>
          <TouchableOpacity style={styles.option} onPress={this.createRecipe}>
            <Text style={{ textAlign: "right", color: "#ff6633", fontWeight: "600" }}>Create</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.body}
                    onScroll={this.handleHeaderShadow} onScrollEndDrag={this.handleHeaderShadow} onMomentumScrollEnd={this.handleHeaderShadow}>
          <View style={styles.topsection}>
            <View style={{ alignItems: "center", borderWidth: this.state.recipeNameOnFocus ? 1 : 0, borderColor: "white", borderBottomColor: "#ff6633" }}>
              <TextInput style={{ textAlign: "center", fontSize: 20 }} placeholder="Recipe name" multiline={false} maxLength={Rules.maxCharRecipeTitle}
                         onChangeText={(text) => this.setState({ recipeTitle: text })}
                         onFocus={() => this.setState({ recipeNameOnFocus: true })} onBlur={() => this.setState({ recipeNameOnFocus: false })}/>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
              {mealTypesItems}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>
              Ingredients
            </Text>
            <View style={styles.sectionBody}>
              {ingredients}
            </View>
            <TouchableOpacity style={styles.addmoreButton} onPress={this.addIngredientInput} activeOpacity={1}>
              <SvgUri svgXmlData={IconPlus} width="15" height="15" fill="#ff6633" />
              <Text style={{ color: "#ffa64d", fontWeight: "600", marginLeft: 5 }}>add ingredient</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>
              Instructions
            </Text>
            <View style={styles.sectionBody}>
              <TextInput multiline={true} placeholder="Add instructions" onChangeText={(text) => this.setState({ instructions: text })}
                         maxLength={Rules.maxCharInstructions}/>
            </View>
          </View>

          <Modal animationType="slide" visible={this.state.showImagePicker}>
            <ImagePicker handleClose={this.closeImagePicker} onSubmit={this.onSubmitImagePicker} existsCount={this.state.selectedEditPhotos.length}/>
          </Modal>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <Text style={styles.subtitle}>
                  Images
                </Text>
                {this.state.selectedPhotos.length !== 0 && !this.state.isEditingPhotos &&
                <TouchableOpacity style={styles.photoSectionButton} onPress={() => this.setState({ isEditingPhotos: true, photoSize: (this.windowWidth-3*3-this.paddingWhenEditing*2-20*2)/4 })}>
                  <Text style={{ color: "#ffa64d", fontWeight: "600", }}>Edit</Text>
                </TouchableOpacity>}
                {this.state.isEditingPhotos &&
                <TouchableOpacity style={styles.photoSectionButton} onPress={() => this.setState({ isEditingPhotos: false, selectedEditPhotos: [], photoSize: (this.windowWidth-3*3-20*2)/4 })}>
                  <Text style={{ color: "#ffa64d", fontWeight: "600", }}>Done</Text>
                </TouchableOpacity>}
                {this.state.isEditingPhotos && this.state.selectedEditPhotos.length !== 0 &&
                <TouchableOpacity style={styles.photoSectionButton} onPress={this.removePhotosHandler}>
                  <Text style={{ color: "#ffa64d", fontWeight: "600", }}>Remove selected</Text>
                </TouchableOpacity>}
                {this.state.isEditingPhotos && this.state.selectedEditPhotos.length === 0 &&
                <TouchableOpacity style={styles.photoSectionButton} onPress={() => this.setState({ selectedPhotos: [] })} >
                  <Text style={{ color: "#ffa64d", fontWeight: "600", }}>Clear</Text>
                </TouchableOpacity>}
              </View>
              <View>
                <TouchableOpacity onPress={this.openImagePicker} style={{ flexDirection: "row", alignItems: "center", }}
                                  activeOpacity={1}>
                  <SvgUri svgXmlData={IconPlus} width="15" height="15" fill="#ff6633" />
                  <SvgUri svgXmlData={IconCamera} width="20" height="20" fill="#ff6633" style={{ marginLeft: 3 }}/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.sectionBody, { flexDirection: "row", flexWrap: "wrap",
                                                backgroundColor: this.state.isEditingPhotos ? "#e8e8e8" : "white",
                                                padding: this.state.isEditingPhotos ? this.paddingWhenEditing : 0, }]}>
              {photos}
            </View>
          </View>

        </ScrollView>

      </KeyboardSafeView>
    );
  }

  handleHeaderShadow = (event) => {
    let scrollPos = event.nativeEvent.contentOffset.y;
    if (scrollPos > 0.1)
      this.setState({ showHeaderShadow: true });
    else
      this.setState({ showHeaderShadow: false });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8e8e8",
    width: "100%",
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
  },
  header: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: 60,
    paddingRight: 20,
    paddingLeft: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 30,
    // borderBottomWidth: 0.5,
    // borderBottomColor: "black",
  },
  body: {
    // flex: 11,
  },
  option: {
    width: 50,
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginTop: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  addmoreButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  topsection: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  ingredient: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  photo: {
    marginTop: 3,
    marginRight: 3,
  },
  sectionBody: {
    marginTop: 10,
  },
  photoSectionButton: {
    marginTop: 3,
    marginLeft: 20,
  },
});
