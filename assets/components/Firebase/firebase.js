import * as firebase from "firebase";
import "firebase/firebase-firestore";

import { config } from "../AppConfig/config";

const firebaseConfig = config.firebase;
firebase.initializeApp(firebaseConfig);

export default firebase;
