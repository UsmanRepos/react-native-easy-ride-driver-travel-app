// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "..........",
  authDomain: "..........",
  projectId: "..........",
  storageBucket: "..........",
  messagingSenderId: "..........",
  appId: ".........."",
  measurementId: ".........."
};

// Initialize Firebase
let app;

if (firebase.default.apps.length === 0) {
  app = firebase.default.initializeApp(firebaseConfig);
} else {
  app = firebase.default.app()
}

const auth = firebase.default.auth()
const db = firebase.default.firestore()
const sg = firebase.default.storage()

export { auth, db, sg };
