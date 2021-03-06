import React, { Component } from "react";
import { StyleSheet, Text, View, Image,
         TouchableOpacity, PanResponder, Dimensions,
         Animated, } from "react-native";
import SvgUri from "react-native-svg-uri";

import { DefaultStyles, Paths } from "../../Const/const";
import { IconChevronRight, IconTrashBin } from "../../../icons/icons";
import MyMath from "../../Utilities/Math/math";

// This component is for displaying a recipe in the recipe list in Homescreen
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
      onPanResponderGrant: this.responderGrantHandler,
      onPanResponderMove: this.responderMoveHandler,
      onPanResponderRelease: this.responderReleaseHandler,
      onPanResponderTerminate: () => console.log("terminate"),
    });

    this.initWidth = Dimensions.get("window").width;

  }

  shouldSetResponderHandler = (event, gestureState) => {
    // Origin is the touch's starting position. Ox goes right, Oy goes down.
    let angle = MyMath.getSwipeAngle(gestureState);

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

  responderGrantHandler = (event, gestureState) => {
    console.log(this.props.index);
  }

  responderMoveHandler = (event, gestureState) => {
    let current = this.state.deleteButtonWidth;
    let moved = current < this.initWidth/2 ? Math.abs(gestureState.x0-gestureState.moveX) / 10 : 0;
    console.log(gestureState.vx);
    if (!this.state.animating) {
      this.setState({ animating: true });
      if (this.state.swipingDir === "left" && gestureState.vx < -0.5)
        Animated.spring(this.state.deleteButtonWidth, {
          toValue: -DefaultStyles.listItemHeight,
          bounciness: Math.max(5,Math.min(-8*gestureState.vx,15)),
          useNativeDriver: true,
        }).start(() => this.setState({ animating: false, swiped: true }));
      else if (this.state.swipingDir === "right")
        Animated.spring(this.state.deleteButtonWidth, {
          toValue: 0,
          bounciness: Math.max(5,Math.min(8*gestureState.vx,15)),
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
    this.setState({ animating: false });

    setTimeout(this.slideItem, 5000);
  }

  render() {
    let thumbnailUri = this.props.data.photos.length !== 0 ? Paths.cachedRecipes+this.props.id+"/0.png" : null;

    let tags = this.props.data.tags.map((item, index) => (
      <View key={index} style={styles.tag}><Text style={{ color: "white" }}>{item}</Text></View>
    ));

    return (
      <View style={{ position: "relative", top: 0, left: 0, flexDirection: "row" }} {...this.panResponderSetup.panHandlers}>

        <Animated.View style={[styles.container, this.props.style, { transform: [{translateX: this.state.deleteButtonWidth}] }]}>
          <TouchableOpacity style={styles.touchableContainer} onPress={() => this.props.showRecipe(this.props.index)}
                            activeOpacity={1}>
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: thumbnailUri, cache: "force-cache" }} style={{ width: "100%", height: "100%", }}/>
            </View>

            <View style={styles.infoContainer}>
              <View>
                {this.props.data.recipeTitle === "" ?
                <Text style={{ fontSize: 16, fontStyle: "italic" }}>No title</Text> :
                <Text style={{ fontSize: 16, }}>{this.props.data.recipeTitle}</Text>}
              </View>

              <View style={styles.tags}>
                {tags}
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                <View>
                  {this.props.data.mealCooked === undefined ? <Text style={[styles.subinfo, { fontStyle: "italic" }]}>No rating</Text> : <Text>{this.props.data.rating}</Text>}
                </View>
                <View>
                  {this.props.data.mealCooked === undefined ? null : <Text style={styles.subinfo}>{this.props.data.mealCooked}</Text>}
                </View>
              </View>
            </View>

            <View styles={styles.iconContainer}>
              <SvgUri svgXmlData={IconChevronRight} width="10" height="10" fill={DefaultStyles.standardBlack}/>
            </View>

          </TouchableOpacity>
        </Animated.View>
        <View style={[styles.deleteButtonContainer, { width: "100%" }]}>
          <View style={{ backgroundColor: "white", width: DefaultStyles.listItemHeight, height: "100%", }}/>
          <TouchableOpacity style={[{ flex: 1, flexDirection: "row", justifyContent: "flex-end", backgroundColor: "red", height: "100%" }]} onPress={null}>
            <View style={{ zIndex: 1, alignItems: "center", justifyContent: "center", width: DefaultStyles.listItemHeight, height: "100%" }}>
              <SvgUri svgXmlData={IconTrashBin} width="40" height="40" fill="white" />
            </View>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "white",
    width: "100%",
    height: DefaultStyles.listItemHeight,
    padding: DefaultStyles.standardPadding,
    borderBottomWidth: 0.5,
    borderBottomColor: DefaultStyles.standardBlack,
  },
  touchableContainer: {
    position: "relative",
    top: 0,
    left: 0,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
    marginRight: 10,
    marginLeft: 10,
  },
  deleteButtonContainer: {
    position: "absolute",
    zIndex: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
  },
  thumbnailContainer: {
    backgroundColor: "#ddd",
    width: DefaultStyles.listItemHeight-DefaultStyles.standardPadding*2,
    height: "100%",
    borderRadius: 5,
    overflow: "hidden",
  },
  tags: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  tag: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffa64d",
    paddingTop: 2,
    paddingRight: 7,
    paddingBottom: 2,
    paddingLeft: 7,
    borderRadius: 20,
    marginRight: 5,
  },
  subinfo: {
    color: DefaultStyles.standardBlack,
  }
})
