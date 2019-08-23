import React from "react";
import { View, Text, Animated, StyleSheet,
         TouchableOpacity, } from "react-native";
import SvgUri from "react-native-svg-uri";

import { DefaultStyles, Colors } from "../Const/const";
import MyText from "../UI/Text/text";
import { IconHome, IconBowl } from "../../icons/icons";

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
});
