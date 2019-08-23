import React, { Component } from 'react';
import { StyleSheet, Text, View, Animated,
         TouchableOpacity, } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from "react-navigation";
import SvgUri from "react-native-svg-uri";

import { Screen, DefaultStyles, Colors } from "../Const/const";
import MyText from "../UI/Text/text";
import { IconHome, IconBowl } from "../../icons/icons";
import HomeScreen from "../HomeScreen/home-screen";
import CreateRecipeScreen from "../HomeScreen/CreateRecipe/create-recipe";
import RecipeView from "../HomeScreen/RecipeView/recipe-view";
import CookedMealScreen from "../CookedMealScreen/cooked-meal-screen";

const HomeScreenNavigator = createStackNavigator({
  Home: HomeScreen,
  CreateRecipe: CreateRecipeScreen,
  Recipe: RecipeView,
},
{
  initialRouteName: "Home",
  headerMode: "none",
});

const MainTabNavigator = createBottomTabNavigator({
  Home: HomeScreenNavigator,
  Meal: CookedMealScreen,
},
{
  initialRouteName: "Home",
  defaultNavigationOptions: {
    tabBarVisible: false,
  }
});

const AppContainer = createAppContainer(MainTabNavigator);

export default class MainScreensContainer extends Component {
  static router = MainTabNavigator.router;

  constructor(props) {
    super(props);
    this.state = { indicatorShift: new Animated.Value(0),
                   currentView: "Home", };

    this.targetShift = { "Home": 0,
                         "Meal": DefaultStyles.navbarIndicatorWidth*2 };
  }

  render() {
    return (
      <>
      <View style={{ flex: 1, position: "relative", width: "100%", }}>
        <MainTabNavigator {...this.props} navigation={this.props.navigation} />
      </View>

      <View style={styles.navbar}>
        <Animated.View style={[styles.indicator, { transform: [{translateX: this.state.indicatorShift}] }]}/>
        <View style={styles.navbarOption}>
          <TouchableOpacity style={styles.navbarButton} onPress={this.goToHomeScreen} activeOpacity={1}>
            <SvgUri svgXmlData={IconHome} width="20" height="20" fill={this.state.currentView === "Home" ? Colors.orange : Colors.gray}/>
            <MyText style={{ ...styles.navbarText, color: this.state.currentView === "Home" ? Colors.orange : Colors.gray, }}>Recipes</MyText>
          </TouchableOpacity>
        </View>

        <View style={styles.navbarOption}>
          <TouchableOpacity style={styles.navbarButton} onPress={this.goToCookedMealScreen} activeOpacity={1}>
            <SvgUri svgXmlData={IconBowl} width="20" height="20" fill={this.state.currentView === "Meal" ? Colors.orange : Colors.gray}/>
            <MyText style={{ ...styles.navbarText, color: this.state.currentView === "Meal" ? Colors.orange : Colors.gray, }}>Meals</MyText>
          </TouchableOpacity>
        </View>
      </View>
      </>
    );
  }

  goToHomeScreen = () => {
    this.setState({ currentView: "Home" });
    this.props.navigation.navigate("Home");
    this.animateNavbar("Home");
  }

  goToCookedMealScreen = () => {
    this.setState({ currentView: "Meal" });
    this.props.navigation.navigate("Meal");
    this.animateNavbar("Meal");
  }

  animateNavbar = (screen) => {
    Animated.timing(this.state.indicatorShift, {
      toValue: this.targetShift[screen],
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
}

const styles = StyleSheet.create({
  navbar: {
    position: "relative",
    flexDirection: "row",
    width: "100%",
    height: DefaultStyles.navbarHeight,
    borderTopWidth: 0.5,
    borderTopColor: DefaultStyles.standardBlack,
  },
  navbarOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  navbarButton: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: "100%",
  },
  navbarText: {
    position: "relative",
    // top: 3,
    fontSize: 12,
    fontWeight: "500",
  },
  indicator: {
    position: "absolute",
    zIndex: 2,
    top: 0,
    left: DefaultStyles.navbarIndicatorWidth/2,
    width: DefaultStyles.navbarIndicatorWidth,
    borderTopWidth: 4,
    borderTopColor: Colors.orange,
  },
})
