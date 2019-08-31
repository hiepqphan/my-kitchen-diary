import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import MyText, { TextTitle, TextSubtitle } from "../UI/Text/text";
import { DefaultStyles, Screen, Colors } from "../Const/const";

export default class CreateMealView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isCooking: false };
  }

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener("didFocus", this.onFocusHandler);
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TextSubtitle>Cooking</TextSubtitle>
          <TextTitle>{this.state.recipeTitle}</TextTitle>
        </View>
        <View style={styles.body}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                      decelerationRate="fast" snapToInterval={Screen.width-60}>
            <View style={{ ...styles.itemWrapper, marginLeft: 40, }}>
              <View style={styles.itemContainer}>

              </View>
            </View>

            <View style={styles.itemWrapper}>
              <View style={styles.itemContainer}>

              </View>
            </View>

            <View style={{ ...styles.itemWrapper, marginRight: 40, }}>
              <View style={styles.itemContainer}>

              </View>
            </View>

          </ScrollView>
        </View>
      </View>
    );
  }

  onFocusHandler = () => {
    let isCooking = this.props.navigation.getParam("isCooking", false);
    this.setState({ isCooking: isCooking });
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Screen.height-DefaultStyles.navbarHeight,
  },
  header: {

  },
  body: {
    flex: 1,
    paddingBottom: 20,
  },
  itemWrapper: {
    width: Screen.width-80,
    height: "100%",
    marginLeft: 20,
  },
  itemContainer: {
    backgroundColor: Colors.turquoise,
    width: "100%",
    height: "100%",
  }
})
