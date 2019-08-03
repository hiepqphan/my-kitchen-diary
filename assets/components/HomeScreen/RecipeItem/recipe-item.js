import React, { Component } from "react";
import { StyleSheet, Text, View, Image,
         TouchableOpacity, PanResponder, Dimensions,
         Animated, } from "react-native";
import SvgUri from "react-native-svg-uri";

import { DefaultStyles } from "../../Const/const";
import { IconChevronRight, IconTrashBin } from "../../../icons/icons";

export default class RecipeItem extends Component {
  constructor(props) {
    super(props);
    this.state = { canGetResponderGrant: false,
                   deleteButtonWidth: new Animated.Value(0),
                   animating: false,
                   swiped: false,  };

    this.panResponderSetup = PanResponder.create({
      onStartShouldSetPanResponder: (event) => false,
      onMoveShouldSetPanResponder: this.shouldSetResponderHandler,
      onPanResponderGrant: this.responderGrandHandler,
      onPanResponderMove: this.responderMoveHandler,
      onPanResponderRelease: this.responderReleaseHandler,
      onPanResponderTerminate: () => console.log("terminate"),
    });

    this.initWidth = Dimensions.get("window").width;

  }

  lengthOfVector(v) {
    return Math.sqrt(Math.pow(v.x,2)+Math.pow(v.y,2));
  }

  getSwipeAngle(gestureState) {
    let dir = { x: gestureState.dx, y: gestureState.dy };
    let horizontal = { x: 1, y: 0 };
    let dotProd = dir.x*horizontal.x + dir.y*horizontal.y;
    let lengthProd = this.lengthOfVector(dir)*this.lengthOfVector(horizontal);
    let cos = dotProd/lengthProd;
    return Math.acos(cos)*180/Math.PI; //Convert radian to degree
  }

  shouldSetResponderHandler = (event, gestureState) => {
    // Origin is the touch's starting position. Ox goes right, Oy goes down.
    console.log("trying to grant");
    let angle = this.getSwipeAngle(gestureState);

    if ((180-angle) <= 10) {
      this.setState({ swipingDir: "left" });
      return true;
    }
    else if (angle <= 10) {
      this.setState({ swipingDir: "right" });
      return true;
    }
    return false;
  }

  responderGrandHandler = (event, gestureState) => {
    console.log(this.props.index);
  }

  responderMoveHandler = (event, gestureState) => {
    let current = this.state.deleteButtonWidth;
    let moved = current < this.initWidth/2 ? Math.abs(gestureState.x0-gestureState.moveX) / 10 : 0;

    if (!this.state.animating) {
      this.setState({ animating: true });
      if (this.state.swipingDir === "left")
        Animated.spring(this.state.deleteButtonWidth, {
          toValue: -DefaultStyles.listItemHeight,
          speed: 10,
          useNativeDriver: true,
        }).start(() => this.setState({ animating: false, swiped: true }));
      else
        Animated.timing(this.state.deleteButtonWidth, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => this.setState({ animating: false, swiped: false }));
    }

  }

  slideItem = () => {
    if (this.state.swiped) {
      this.setState({ swiped: false });
      Animated.timing(this.state.deleteButtonWidth, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }

  responderReleaseHandler = (event, gestureState) => {
    console.log('release');

    this.setState({ animating: false });

    setTimeout(this.slideItem, 5000);
  }

  render() {
    return (
      <View style={{ position: "relative", top: 0, left: 0, flexDirection: "row" }} {...this.panResponderSetup.panHandlers}>

        <Animated.View style={[styles.container, { transform: [{translateX: this.state.deleteButtonWidth}] }]}>
          <TouchableOpacity style={styles.container} onPress={() => this.props.showRecipe(this.props.index)}
                            activeOpacity={1}>
          <View style={styles.thumbnailContainer}>

          </View>
          <View style={styles.infoContainer} onPress={() => console.log("pressed")}>
            {this.props.data.recipeTitle === "" ?
            <Text style={{ fontStyle: "italic" }}>No title</Text> :
            <Text>{this.props.data.recipeTitle}</Text>}
          </View>
          <View styles={styles.iconContainer}>
            <SvgUri svgXmlData={IconChevronRight} width="10" height="10" fill={DefaultStyles.standardBlack}/>
          </View>
          </TouchableOpacity>
        </Animated.View>
        <TouchableOpacity style={[styles.deleteButton, { width: "100%" }]} onPress={null}>
          <View style={{ alignItems: "center", justifyContent: "center", width: DefaultStyles.listItemHeight, height: "100%" }}>
            <SvgUri svgXmlData={IconTrashBin} width="40" height="40" fill="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    top: 0,
    left: 0,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: DefaultStyles.listItemHeight,
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: DefaultStyles.standardBlack,
  },
  touchableWrapper: {
    position: "relative",
    top: 0,
    left: 0,
    zIndex: 1,
    width: "100%",
    height: DefaultStyles.listItemHeight,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
  },
  deleteButton: {
    position: "absolute",
    zIndex: 0,
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "red",
    height: "100%",
  },
})
