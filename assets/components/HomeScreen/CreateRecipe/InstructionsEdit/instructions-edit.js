import React, { Component } from "react";
import { StyleSheet, Text, View, Image,
         TouchableOpacity, TextInput, ScrollView, Modal,
         Dimensions, Animated, Platform,
         Keyboard, UIManager, } from "react-native";
import SvgUri from "react-native-svg-uri";

import { DefaultStyles, Colors } from "../../../Const/const";
import MyText, { TextTitle, TextSubtitle, MyTextInput } from "../../../UI/Text/text";

export default class InstructionsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { text: this.props.text,
                   paddingBottom: 0 };
  }

  componentDidMount() {
    this.keyboardDidShowSubscription = Keyboard.addListener("keyboardDidShow", this.keyboardDidShowHandler);
    this.keyboardDidHideSubscription = Keyboard.addListener("keyboardDidHide", this.keyboardDidHideHandler);
  }

  componentWillUnmount() {
    this.keyboardDidShowSubscription.remove();
    this.keyboardDidHideSubscription.remove();
  }

  saveText = () => {
    this.setState({ text: this.state.textCurrent, isEditing: false, });
  }

  keyboardDidShowHandler = (event) => {
    let keyboardHeight = event.endCoordinates.height;
    this.setState({ paddingBottom: keyboardHeight });
  }

  keyboardDidHideHandler = (event) => {
    this.setState({ paddingBottom: 0 });
  }

  render() {
    return(
      <View style={[styles.container, { paddingBottom: this.state.paddingBottom }]}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", }}>
            <TextTitle style={styles.title}>Instructions</TextTitle>
          </View>
          <TouchableOpacity style={styles.doneButton} onPress={() => this.props.closeHandler(this.state.text)}>
            <MyText style={{ textAlign: "right", color: Colors.orange, fontWeight: "600" }}>Done</MyText>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <MyTextInput multiline={true} value={this.state.text} onChangeText={(text) => this.setState({ text: text })}
                     editable={true} placeholder="Add instructions"
                     style={styles.input}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Colors.bisque,
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: Platform.OS === "android" ? DefaultStyles.headerHeightModalAndroid : DefaultStyles.headerHeight,
    paddingTop: Platform.OS === "android" ? 0 : DefaultStyles.headerPaddingTop,
    paddingRight: 20,
    paddingLeft: 20,
    // borderBottomWidth: 0.5,
    borderBottomColor: DefaultStyles.standardBlack,
  },
  title: {
  },
  body: {
    flex: 1,
    width: "100%",
    paddingTop: Platform.OS === "android" ? DefaultStyles.headerHeightModalAndroid+10 : DefaultStyles.headerHeight+10,
    padding: 10,
  },
  leftButton: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: 60,
    height: 30,
    marginTop: 3,
    marginLeft: 20,
  },
  doneButton: {
    alignItems: "flex-end",
    justifyContent: "center",
    width: 60,
    height: 30,
  },
  input: {
    // backgroundColor: Colors.lightgray,
    height: "100%",
    padding: 10,
    paddingBottom: 5,
    borderRadius: 5,
  }
})
