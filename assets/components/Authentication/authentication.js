import * as Facebook from "expo-facebook";
import uuid from "uuid";

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

  static getCurrentUser() {
    return Firebase.auth().currentUser;
  }

  static uploadFile(blob, name, id, type) {
    let userId = Auth.getCurrentUser().uid;
    let storageRef = Firebase.storage().ref(`${userId}/${type}/${id}/${name}`);

    return storageRef.put(blob);
  }

  static createRecipe(data, successCallback) {
    let today = new Date();
    data.dateCreated = Firebase.firestore.Timestamp.fromDate(today);
    data.dateCreatedReversed = -today.getTime();

    Firebase.app().firestore().collection(`${Auth.getCurrentUser().uid}`).doc("recipes").collection("recipes").add({})
    .then(docRef => {
      Auth.createRecipeInStorage(data, docRef.id, successCallback);
    })
    .catch(error => {
      console.log("Creating recipe error while creating doc", error);
    });
  }

  static async createRecipeInStorage(data, recipeId, successCallback) {
    let downloadURLs = {};
    let uploadTasks = {};
    let uploadTimeout = {};
    let urlsCount = 0;

    for (let i = 0; i < data.photos.length; ++i) {
      let fileName = uuid.v4();
      uploadTasks[i] = Auth.uploadFile(data.blobs[i], fileName, recipeId, "recipes");
    }

    for (let i in uploadTasks) {
      uploadTasks[i].on(Firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {

        },
        (error) => {
          console.log("Creating recipe error while uploading", error);
        },
        () => {
          // Callback when finished uploading
          if (uploadTasks[i].snapshot.state === Firebase.storage.TaskState.SUCCESS) {
            uploadTasks[i].snapshot.ref.getDownloadURL()
            .then(url => {
              downloadURLs[i] = url;
              ++urlsCount;
              if (urlsCount === data.photos.length) {
                for (let j = 0; j < data.photos.length; ++j)
                  data.photos[j].node.image.uri = downloadURLs[j];
                delete data.blobs;
                Auth.createRecipeInDatabase(data, recipeId, successCallback);
              }
            })
            .catch(error => {
              console.log("Couldn't get download url", error);
            });
          }
        });
    }

    if (data.photos.length === 0)
      Auth.createRecipeInDatabase(data, recipeId, successCallback);

  }

  static createRecipeInDatabase(data, recipeId, successCallback) {
    Firebase.app().firestore().collection(`${Auth.getCurrentUser().uid}`)
    .doc("recipes").collection("recipes").doc(recipeId).set(data)
    .then(() => {
      // Recipe created successfully. Callback here
      successCallback();
      console.log("successfully created new recipe");
    })
    .catch((error) => {
      console.log("Creating recipe error while writing to database", error);
    });
  }

  static getRecipes(after = null, limit = 20) {
    let query = Firebase.app().firestore().collection(`${Auth.getCurrentUser().uid}`).doc("recipes").collection("recipes")
                .orderBy("dateCreatedReversed");
    if (after !== null)
      query = query.startAfter(after);

    query = query.limit(limit);

    return (
      query.get().then(documentSnapshots => {
        return documentSnapshots.docs;
      })
      .catch(error => {
        console.log("error querying",error);
      })
    );
  }

}
