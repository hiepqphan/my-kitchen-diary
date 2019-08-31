import React from "react";
import { View, Text, Animated, StyleSheet,
         TouchableOpacity, } from "react-native";
import SvgUri from "react-native-svg-uri";

import { DefaultStyles, Colors } from "../Const/const";
import MyText, { TextTitle } from "../UI/Text/text";
import { IconPlus } from "../../icons/icons";

export default class CookedMealScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };

  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TextTitle>Meals</TextTitle>
          <TouchableOpacity onPress={this.props.createMealHandler} activeOpacity={1} style={styles.addButtonContainer}>
            <SvgUri style={styles.addButton} width="25" height="25" svgXmlData={IconPlus} fill={Colors.orange}/>
          </TouchableOpacity>
        </View>

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: DefaultStyles.headerHeight,
    paddingTop: DefaultStyles.headerPaddingTop,
    paddingLeft: DefaultStyles.standardPadding,
    // borderBottomWidth: 0.5,
    borderBottomColor: DefaultStyles.standardBlack,
  },
  addButtonContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: 35,
    height: 35,
    paddingRight: DefaultStyles.standardPadding,
  },
  addButton: {
    width: 25,
    height: 25,
  },
  body: {
    flex: 1,
  },
});
