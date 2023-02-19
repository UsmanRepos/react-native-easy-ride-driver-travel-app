// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDzHYRYShfkg4KPymyHLva4Vxz2LleZVuI",
  authDomain: "easyride-9c986.firebaseapp.com",
  projectId: "easyride-9c986",
  storageBucket: "easyride-9c986.appspot.com",
  messagingSenderId: "825632191688",
  appId: "1:825632191688:web:b2bc5cd7671247c50f21fd",
  measurementId: "G-YQC7YZCHKW"
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