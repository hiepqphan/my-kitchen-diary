import React, { Component } from "react";
import { StyleSheet, View, Image, Alert,
         TouchableOpacity, TextInput, ScrollView, Modal,
         Dimensions, Platform, StatusBar, Animated, BackHandler,
         Keyboard, UIManager, } from "react-native";
import SvgUri from "react-native-svg-uri";
import { Overlay } from "react-native-elements";

import { MealTypes, DefaultStyles, Rules, Colors } from "../../Const/const";
import Card from "../../UI/Card/card";
import MealTypeItem from "./MealTypeItem/meal-type-item";
import Ingredient from "./IngredientItem/ingredient-item";
import ImagePicker from "../../Utilities/ImagePicker/image-picker";
import ImageView from "../../Utilities/ImagePicker/ImageView/image-view";
import { IconCamera, IconPlus, IconMinusRound, IconChevronLeft } from "../../../icons/icons";
import Auth from "../../Authentication/authentication";
import KeyboardSafeView from "../../UI/KeyboardSafeView/keyboard-safe-view";
import LoadingOverlay from "../../UI/LoadingOverlay/loading-overlay";
import MyText, { TextTitle, TextSubtitle, MyTextInput } from "../../UI/Text/text";
import MyView from "../../UI/View/view";
import InstructionsEdit from "./InstructionsEdit/instructions-edit";
import IngredientsEdit from "./IngredientsEdit/ingredients-edit";

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
                   showInstructionsModal: false,
                   showIngredientsModal: false, };

    this.paddingWhenEditing = 5;
    this.windowWidth = Dimensions.get("window").width;
    this.state.photoSize = (this.windowWidth - 3*3 - 47) / 4;

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

  render() {
    let mealTypesItems = MealTypes.map(item => (
      <MealTypeItem key={item} name={item} style={{ marginTop: 15, marginRight: 7.5, marginLeft: 7.5 }}
                    isSelected={this.state.isMealTypeSelected.includes(item)} onPressHandler={this.mealTypeHandler.bind(this)}/>
    ));

    let ingredients = this.state.ingredients.map((item, index) => (
      <Ingredient key={index} index={index} style={index === 0 ? { marginTop: 0 } : styles.ingredient}
                  ingredientText={this.state.ingredients[index].ingredient}
                  quantityText={this.state.ingredients[index].quantity}
                  deleteIcon={IconMinusRound}
                  editable={false}/>
    ));

    let photos = this.state.selectedPhotos.map((item, index) => (
      <ImageView key={index} index={index} uri={item.node.image.uri} size={this.state.photoSize} style={[styles.photo, { marginTop: index < 4 ? 0 : 3, marginRight: index % 4 === 3 ? 0 : 3, }]}
                 selected={this.state.selectedEditPhotos.includes(index)} selectToggler={this.selectPhotoHandler}/>
    ));

    return(
      <>
      <View style={[styles.container, { position: "absolute", zIndex: 0, height: "100%" }]}/>
      <View style={[styles.header, { borderBottomWidth: 0 } ]}>
        <TouchableOpacity style={styles.option} onPress={this.closeRecipeScreen}>
          <SvgUri svgXmlData={IconChevronLeft} fill="white" width="20" height="20"/>
        </TouchableOpacity>
        <TextTitle style={{ color: "white" }}>New Recipe</TextTitle>
        <TouchableOpacity style={styles.option} onPress={this.createRecipe}>
          <MyText style={{ textAlign: "right", color: "white", fontWeight: "600" }}>Create</MyText>
        </TouchableOpacity>
      </View>

      <KeyboardSafeView style={styles.container}>
        <LoadingOverlay isVisible={this.state.isCreatingRecipe} title="Creating Recipe"/>

        <ScrollView style={[styles.body]}>
          <View style={{ ...styles.section, ...styles.topsection }}>
            <MyView style={{ alignItems: "center", borderWidth: this.state.recipeNameOnFocus ? 1 : 0, borderColor: "white", borderBottomColor: "#ff6633" }}
                    showDot={true} >
              <MyTextInput style={{ textAlign: "center" }} placeholder="Recipe name" multiline={false} maxLength={Rules.maxCharRecipeTitle}
                         onChangeText={(text) => this.setState({ recipeTitle: text })} value={this.state.recipeTitle}
                         onFocus={() => this.setState({ recipeNameOnFocus: true })} onBlur={() => this.setState({ recipeNameOnFocus: false })}/>
            </MyView>
            <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
              {mealTypesItems}
            </View>
          </View>


          <Modal animationType="slide" visible={this.state.showIngredientsModal}>
            <IngredientsEdit closeHandler={this.ingredientsModalCloseHandler} ingredients={this.state.ingredients}/>
          </Modal>
          <View style={{ ...styles.section }}>
            <MyView style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
                    showDot={true}>
              <TextSubtitle style={styles.subtitle}>
                Ingredients
              </TextSubtitle>
              <TouchableOpacity style={styles.editButton} onPress={() => this.setState({ showIngredientsModal: true })}>
                <MyText style={{ color: Colors.orange, fontWeight: "600", }}>Edit</MyText>
              </TouchableOpacity>
            </MyView>
            <View style={styles.sectionBody}>
              {ingredients.length !== 0 ?
              ingredients :
              <MyText style={{ fontStyle: "italic", color: DefaultStyles.standardBlack }}>No ingredients added</MyText>}
            </View>
          </View>

          <Modal animationType="slide" visible={this.state.showInstructionsModal}>
            <InstructionsEdit closeHandler={this.instructionsModalCloseHandler} text={this.state.instructions}/>
          </Modal>
          <View style={{ ...styles.section }}>
            <MyView style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}
                    showDot={true}>
              <TextSubtitle style={styles.subtitle}>
                Instructions
              </TextSubtitle>
              <TouchableOpacity style={styles.editButton} onPress={() => this.setState({ showInstructionsModal: true })}>
                <MyText style={{ color: Colors.orange, fontWeight: "600", }}>Edit</MyText>
              </TouchableOpacity>
            </MyView>
            <View style={[styles.sectionBody, { paddingBottom: this.state.instructionsInputSelected ? 10 : 0 }]}>
              {this.state.instructions !== "" ?
              <MyText>{this.state.instructions}</MyText> :
              <MyText style={{ fontStyle: "italic", color: DefaultStyles.standardBlack }}>No instructions added</MyText>}
            </View>
          </View>

          <Modal animationType="slide" visible={this.state.showImagePicker}>
            <ImagePicker handleClose={this.closeImagePicker} onSubmit={this.onSubmitImagePicker} existsCount={this.state.selectedEditPhotos.length}/>
          </Modal>
          <View style={{ ...styles.section, marginBottom: 200 }}>
            <MyView style={styles.sectionHeader} showDot={true}>
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <TextSubtitle style={styles.subtitle}>
                  Images
                </TextSubtitle>
                {this.state.selectedPhotos.length !== 0 && !this.state.isEditingPhotos &&
                <TouchableOpacity style={styles.photoSectionButton} onPress={() => this.setState({ isEditingPhotos: true, photoSize: (this.windowWidth-3*3-this.paddingWhenEditing*2-47)/4 })}>
                  <MyText style={{ color: Colors.orange, fontWeight: "600", }}>Edit</MyText>
                </TouchableOpacity>}
                {this.state.isEditingPhotos &&
                <TouchableOpacity style={styles.photoSectionButton} onPress={() => this.setState({ isEditingPhotos: false, selectedEditPhotos: [], photoSize: (this.windowWidth-3*3-47)/4 })}>
                  <MyText style={{ color: Colors.orange, fontWeight: "600", }}>Done</MyText>
                </TouchableOpacity>}
                {this.state.isEditingPhotos && this.state.selectedEditPhotos.length !== 0 &&
                <TouchableOpacity style={styles.photoSectionButton} onPress={this.removePhotosHandler}>
                  <MyText style={{ color: Colors.orange, fontWeight: "600", }}>Remove selected</MyText>
                </TouchableOpacity>}
                {this.state.isEditingPhotos && this.state.selectedEditPhotos.length === 0 &&
                <TouchableOpacity style={styles.photoSectionButton} onPress={() => this.setState({ selectedPhotos: [], isEditingPhotos: false })} >
                  <MyText style={{ color: Colors.orange, fontWeight: "600", }}>Clear</MyText>
                </TouchableOpacity>}
              </View>
              <View>
                {!this.state.isEditingPhotos &&
                <TouchableOpacity onPress={this.openImagePicker} style={{ flexDirection: "row", alignItems: "center", height: 25 }}
                                  activeOpacity={1}>
                  <SvgUri svgXmlData={IconPlus} width="15" height="15" fill={Colors.orange} />
                  <SvgUri svgXmlData={IconCamera} width="20" height="20" fill={Colors.orange} style={{ marginLeft: 3 }}/>
                </TouchableOpacity>}
              </View>
            </MyView>
            <View style={[styles.sectionBody, { flexDirection: "row", flexWrap: "wrap",
                                                backgroundColor: this.state.isEditingPhotos ? Colors.lightgray : "white",
                                                padding: this.state.isEditingPhotos ? this.paddingWhenEditing : 0,
                                                borderRadius: 5, }]}>
              {photos}
            </View>
          </View>

        </ScrollView>

      </KeyboardSafeView>
      </>
    );
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

  ingredientsModalCloseHandler = (ingredients) => {
    let newState = [];
    for (let i = 0; i < ingredients.length; ++i)
      if (ingredients[i].ingredient !== "")
        newState.push(ingredients[i]);

    this.setState({ showIngredientsModal: false, ingredients: newState });
  }

  instructionsModalCloseHandler = (text) => {
    let newValue = text.trim();
    this.setState({ instructions: newValue, showInstructionsModal: false });
  }

  // doneEditingIngredientsHandler = () => {
  //   let newState = [];
  //   for (let i = 0; i < this.state.ingredients.length; ++i)
  //     if (this.state.ingredients[i].ingredient !== "")
  //       newState.push(this.state.ingredients[i]);
  //
  //   this.setState({ isEditingIngredients: false, ingredients: newState });
  // }

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
    backgroundColor: Colors.orange,
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
    width: 60,
    height: 50,
  },
  section: {
    paddingLeft: 15,
    paddingBottom: 20,
    borderLeftWidth: 2,
    borderLeftColor: Colors.yellow_tint,
    marginLeft: 15,
    marginRight: 15,
  },
  subtitle: {

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
