import React from "react";
import { View, Text, Animated, StyleSheet,
         TouchableOpacity, } from "react-native";

import { DefaultStyles } from "../Const/const";

export default class CookedMealScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { indicatorShift: new Animated.Value(-DefaultStyles.navbarIndicatorWidth*2), };

    this.focusListener = this.props.navigation.addListener("didFocus", this.animateNavbar);
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  animateNavbar = () => {
    this.state.indicatorShift.setValue(-DefaultStyles.navbarIndicatorWidth*2);
    Animated.timing(this.state.indicatorShift, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  goToHomeScreen = () => {
    this.props.navigation.navigate("Home", { fromOtherTab: true });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.body}>

        </View>

        <View style={styles.navbar}>
          <Animated.View style={[styles.indicator, { transform: [{translateX: this.state.indicatorShift}] }]}/>
          <View style={styles.navbarOption}>
            <TouchableOpacity style={styles.navbarButton} onPress={this.goToHomeScreen} activeOpacity={1}>

            </TouchableOpacity>
          </View>

          <View style={styles.navbarOption}>
            <TouchableOpacity style={styles.navbarButton} onPress={this.goToCookedMealScreen} activeOpacity={1}>

            </TouchableOpacity>
          </View>
        </View>
        {
          //<Text>{Firebase.auth().currentUser.displayName}</Text>
      }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  header: {

  },
  body: {
    flex: 1,
  },
  navbar: {
    position: "relative",
    flexDirection: "row",
    width: "100%",
    height: 60,
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
    backgroundColor: "azure",
    width: "50%",
    height: "100%",
  },
  indicator: {
    position: "absolute",
    zIndex: 2,
    top: 0,
    left: DefaultStyles.navbarIndicatorWidth*(5/2),
    width: DefaultStyles.navbarIndicatorWidth,
    borderTopWidth: 4,
    borderTopColor: "#ff6633",
  },
});
