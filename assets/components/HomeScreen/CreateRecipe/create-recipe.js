import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Alert,
         TouchableOpacity, TextInput, ScrollView, Modal,
         Dimensions, Platform, StatusBar, Animated, BackHandler,
         Keyboard, UIManager, } from "react-native";
import SvgUri from "react-native-svg-uri";
import { Overlay } from "react-native-elements";

import { MealTypes, DefaultStyles, Rules, } from "../../Const/const";
import Card from "../../UI/Card/card";
import MealTypeItem from "./MealTypeItem/meal-type-item";
import Ingredient from "./IngredientItem/ingredient-item";
import ImagePicker from "../../Utilities/ImagePicker/image-picker";
import ImageView from "../../Utilities/ImagePicker/ImageView/image-view";
import { IconCamera, IconPlus, IconMinusRound, IconChevronLeft } from "../../../icons/icons";
import Auth from "../../Authentication/authentication";
import KeyboardSafeView from "../../UI/KeyboardSafeView/keyboard-safe-view";
import LoadingOverlay from "../../UI/LoadingOverlay/loading-overlay";
import InstructionsEdit from "./InstructionsEdit/instructions-edit";

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
                   showHeaderShadow: false,
                   showInstructionsModal: false,
                   isEditingIngredients: false, };

    this.paddingWhenEditing = 5;
    this.windowWidth = Dimensions.get("window").width;
    this.state.photoSize = (this.windowWidth - 3*3 - 40) / 4;

    // Custom back behavior on Android
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.closeRecipeScreen)
    );
  }

  componentDidMount() {

    // Custom back behavior on Android
    this._willBlurSubscription = this.props.navigation.addListener("willBlur", payload =>
      BackHandler.removeEventListener("hardwareBackPress", this.closeRecipeScreen)
    );
  }

  componentWillUnmount() {
    // this.onFocusListener.remove();
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  closeRecipeScreen = () => {
    this.props.navigation.navigate("Home");
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

  instructionsModalCloseHandler = (text) => {
    let newValue = text.trim();
    this.setState({ instructions: newValue, showInstructionsModal: false });
  }

  doneEditingIngredientsHandler = () => {
    let newState = [];
    for (let i = 0; i < this.state.ingredients.length; ++i)
      if (this.state.ingredients[i].ingredient !== "")
        newState.push(this.state.ingredients[i]);

    this.setState({ isEditingIngredients: false, ingredients: newState });
  }

  createRecipe = () => {
    this.setState({ isCreatingRecipe: true });

    let data = { photos: this.state.selectedPhotos,
                 ingredients: [],
                 instructions: this.state.instructions,
                 recipeTitle: this.state.recipeTitle,
                 tags: this.state.isMealTypeSelected, };

    if (typeof data.recipeTitle !== typeof "string")
      data.recipeTitle = "";
    if (typeof data.instructions !== typeof "string")
      data.instructions = "";

    for (let i = 0; i < this.state.ingredients.length; ++i)
      if (this.state.ingredients[i].ingredient !== "")
        data.ingredients.push(this.state.ingredients[i]);

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

    if (data.photos.length === 0)
      Auth.createRecipe(data, this.createRecipeSuccessCallback);
  }

  createRecipeSuccessCallback = () => {
    // this.setState({ isCreatingRecipe: false,
    //                 selectedPhotos: [],
    //                 ingredients: [],
    //                 instructions: "",
    //                 recipeTitle: "",
    //                 isMealTypeSelected: [], });

    this.closeRecipeScreen();
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
                  deleteIcon={IconMinusRound}
                  editable={this.state.isEditingIngredients}/>
    ));

    let photos = this.state.selectedPhotos.map((item, index) => (
      <ImageView key={index} index={index} uri={item.node.image.uri} size={this.state.photoSize} style={[styles.photo, { marginTop: index < 4 ? 0 : 3, marginRight: index % 4 === 3 ? 0 : 3, }]}
                 selected={this.state.selectedEditPhotos.includes(index)} selectToggler={this.selectPhotoHandler}/>
    ));

    return(
      <>
      <View style={[styles.container, { position: "absolute", zIndex: 0, height: "100%" }]}/>
      <View style={[styles.header, { borderBottomWidth: 0.5 } ]}>
        <TouchableOpacity style={styles.option} onPress={this.closeRecipeScreen}>
          <SvgUri svgXmlData={IconChevronLeft} fill="#ff6633" width="20" height="20"/>
        </TouchableOpacity>
        <Text style={{ fontSize: DefaultStyles.headerFontSize, fontWeight: "600", color: "black" }}>New Recipe</Text>
        <TouchableOpacity style={styles.option} onPress={this.createRecipe}>
          <Text style={{ textAlign: "right", color: "#ff6633", fontWeight: "600" }}>Create</Text>
        </TouchableOpacity>
      </View>

      <KeyboardSafeView style={[styles.container]}>
        <LoadingOverlay isVisible={this.state.isCreatingRecipe} title="Creating Recipe"/>

        <ScrollView style={[styles.body]}
                    onScroll={null} onScrollEndDrag={this.handleHeaderShadow} onMomentumScrollEnd={this.handleHeaderShadow}>
          <Card style={[styles.topsection]}>
            <View style={{ alignItems: "center", borderWidth: this.state.recipeNameOnFocus ? 1 : 0, borderColor: "white", borderBottomColor: "#ff6633" }}>
              <TextInput style={{ textAlign: "center", fontSize: 20 }} placeholder="Recipe name" multiline={false} maxLength={Rules.maxCharRecipeTitle}
                         onChangeText={(text) => this.setState({ recipeTitle: text })} value={this.state.recipeTitle}
                         onFocus={() => this.setState({ recipeNameOnFocus: true })} onBlur={() => this.setState({ recipeNameOnFocus: false })}/>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
              {mealTypesItems}
            </View>
          </Card>

          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.subtitle}>
                Ingredients
              </Text>
              {!this.state.isEditingIngredients &&
              <TouchableOpacity style={styles.editButton} onPress={() => this.setState({ isEditingIngredients: true })}>
                <Text style={{ color: "#ffa64d", fontWeight: "600", }}>Edit</Text>
              </TouchableOpacity>}
              {this.state.isEditingIngredients &&
              <TouchableOpacity style={styles.editButton} onPress={this.doneEditingIngredientsHandler}>
                <Text style={{ color: "#ffa64d", fontWeight: "600", }}>Done</Text>
              </TouchableOpacity>}
            </View>
            <View style={styles.sectionBody}>
              {ingredients}
            </View>
            {this.state.isEditingIngredients &&
            <TouchableOpacity style={styles.addmoreButton} onPress={this.addIngredientInput} activeOpacity={1}>
              <SvgUri svgXmlData={IconPlus} width="15" height="15" fill="#ff6633" />
              <Text style={{ color: "#ffa64d", fontWeight: "600", marginLeft: 5 }}>add ingredient</Text>
            </TouchableOpacity>}
          </Card>

          <Modal animationType="slide" visible={this.state.showInstructionsModal}>
            <InstructionsEdit closeHandler={this.instructionsModalCloseHandler} text={this.state.instructions}/>
          </Modal>
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
              <Text style={styles.subtitle}>
                Instructions
              </Text>
              <TouchableOpacity style={styles.editButton} onPress={() => this.setState({ showInstructionsModal: true })}>
                <Text style={{ color: "#ffa64d", fontWeight: "600", }}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.sectionBody, { paddingBottom: this.state.instructionsInputSelected ? 10 : 0 }]}>
              <TextInput multiline={true} placeholder="Add instructions" onChangeText={(text) => this.setState({ instructions: text })}
                         editable={false}
                         maxLength={Rules.maxCharInstructions} value={this.state.instructions}/>
            </View>
          </Card>

          <Modal animationType="slide" visible={this.state.showImagePicker}>
            <ImagePicker handleClose={this.closeImagePicker} onSubmit={this.onSubmitImagePicker} existsCount={this.state.selectedEditPhotos.length}/>
          </Modal>
          <Card style={[{ marginBottom: 20 }]}>
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
                <TouchableOpacity style={styles.photoSectionButton} onPress={() => this.setState({ selectedPhotos: [], isEditingPhotos: false })} >
                  <Text style={{ color: "#ffa64d", fontWeight: "600", }}>Clear</Text>
                </TouchableOpacity>}
              </View>
              <View>
                {!this.state.isEditingPhotos &&
                <TouchableOpacity onPress={this.openImagePicker} style={{ flexDirection: "row", alignItems: "center", height: 25 }}
                                  activeOpacity={1}>
                  <SvgUri svgXmlData={IconPlus} width="15" height="15" fill="#ff6633" />
                  <SvgUri svgXmlData={IconCamera} width="20" height="20" fill="#ff6633" style={{ marginLeft: 3 }}/>
                </TouchableOpacity>}
              </View>
            </View>
            <View style={[styles.sectionBody, { flexDirection: "row", flexWrap: "wrap",
                                                backgroundColor: this.state.isEditingPhotos ? "#e8e8e8" : "white",
                                                padding: this.state.isEditingPhotos ? this.paddingWhenEditing : 0, }]}>
              {photos}
            </View>
          </Card>

        </ScrollView>

      </KeyboardSafeView>
      </>
    );
  }

  handleHeaderShadow = (event) => {
    // Unused
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
    backgroundColor: "white",
    width: "100%",
  },
  header: {
    // flex: 1,
    position: "absolute",
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: DefaultStyles.headerHeight,
    paddingTop: DefaultStyles.headerPaddingTop,
    paddingRight: DefaultStyles.standardPadding,
    paddingLeft: DefaultStyles.standardPadding,
    borderBottomColor: DefaultStyles.standardBlack,
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
  addmoreButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    marginTop: 10,
  },
  topsection: {
    marginTop: DefaultStyles.headerHeight+20,
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
  editButton: {

  }
});
