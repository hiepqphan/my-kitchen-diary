import React, { Component } from "react";
import { StyleSheet, Text, View, Image,
         TouchableOpacity, TextInput, ScrollView, Modal,
         Dimensions, Animated, Platform,
         Keyboard, UIManager, } from "react-native";
import SvgUri from "react-native-svg-uri";

import { DefaultStyles } from "../../../Const/const";

export default class InstructionsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { text: this.props.text,
                   textCurrent: this.props.text,
                   isEditing: false,
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
    let keyboardHeight = event.endCoordinates.height;
    this.setState({ paddingBottom: 0 });
  }

  render() {
    return(
      <View style={[styles.container, { paddingBottom: this.state.paddingBottom }]}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", }}>
            <Text style={styles.title}>Instructions</Text>
            {!this.state.isEditing &&
            <TouchableOpacity style={styles.leftButton} onPress={() => this.setState({ isEditing: true })}>
              <Text style={{ color: "#ffa64d", fontWeight: "600", }}>Edit</Text>
            </TouchableOpacity>}
            {this.state.isEditing &&
            <TouchableOpacity style={styles.leftButton} onPress={this.saveText}>
              <Text style={{ color: "#ffa64d", fontWeight: "600", }}>Save</Text>
            </TouchableOpacity>}
          </View>
          <TouchableOpacity style={styles.doneButton} onPress={() => this.props.closeHandler(this.state.text)}>
            <Text style={{ textAlign: "right", color: "#ff6633", fontWeight: "600" }}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <TextInput multiline={true} value={this.state.textCurrent} onChangeText={(text) => this.setState({ textCurrent: text })}
                     editable={this.state.isEditing} placeholder="Add instructions"
                     style={styles.input}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    height: DefaultStyles.headerHeight,
    paddingTop: Platform.OS === "android" ? 0 : DefaultStyles.headerPaddingTop,
    paddingRight: 20,
    paddingLeft: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: DefaultStyles.standardBlack,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  body: {
    flex: 1,
    width: "100%",
    paddingTop: 10+DefaultStyles.headerHeight,
    padding: 10,
  },
  leftButton: {
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "white",
    width: 60,
    height: 50,
    marginTop: 3,
    marginLeft: 20,
  },
  doneButton: {
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: "white",
    width: 60,
    height: 50,
  },
  input: {
    backgroundColor: "#f8f8f8",
    height: "100%",
    padding: 10,
    paddingBottom: 5,
    borderRadius: 5,
  }
})
