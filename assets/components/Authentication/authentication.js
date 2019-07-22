import * as Facebook from "expo-facebook";

import { config } from "../AppConfig/config";
import Firebase from "../Firebase";

export default class Auth {
  static async loginWithFacebook() {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      config.facebook.appId,
      { permissions: ["public_profile"] }
    );

    if (type === "success" && token) {
      const credential = Firebase.auth.FacebookAuthProvider.credential(token);
      await Firebase.auth().signInWithCredential(credential);
    }
  }

  static updateAuthStatus(userWrapper) {
    Firebase.auth().onAuthStateChanged(user => {
      userWrapper.user = user;
    });
  }
}
