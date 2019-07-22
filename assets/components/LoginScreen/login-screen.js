import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Image,
         TouchableOpacity } from "react-native";

import Firebase, { FirebaseContext } from "../Firebase";
import Auth from "../Authentication/authentication";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }

  componentDidMount() {
    let userWrapper = { user: null };
    Auth.updateAuthStatus(userWrapper);
    this.setState({ user: userWrapper.user });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <Image style={{ backgroundColor: "#000", width: 90, height: 90 }}/>
        </View>
        <View style={styles.subcontainer}>
          <TouchableOpacity style={styles.loginbutton} onPress={Auth.loginWithFacebook}>
            <Text style={{ color: "white" }}>Login with Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  subcontainer: {
    flex: 1,
    justifyContent: "flex-end",
    height: "50%",
  },
  loginbutton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4267b2",
    width: 250,
    height: 40,
    borderRadius: 3,
    marginBottom: 100,
  },
});
