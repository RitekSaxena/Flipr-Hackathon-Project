import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA-HC_5UCWGUqQTlwq_5IExBe67a5mZqxw",
  authDomain: "flipr-hackathon-d14ad.firebaseapp.com",
  databaseURL: "https://flipr-hackathon-d14ad.firebaseio.com",
  projectId: "flipr-hackathon-d14ad",
  storageBucket: "flipr-hackathon-d14ad.appspot.com",
  messagingSenderId: "866167799084",
  appId: "1:866167799084:web:34e901150aa758ee340089",
  measurementId: "G-TQFFX0JWGM",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
