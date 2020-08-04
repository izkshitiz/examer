import * as firebase from 'firebase/app';
const firebaseConfig = {
  apiKey: "AIzaSyDWTSXm_xA1Nk2g6SW4JkdO6csh9c0-T5Y",
  authDomain: "examer-4c725.firebaseapp.com",
  databaseURL: "https://examer-4c725.firebaseio.com",
  projectId: "examer-4c725",
  storageBucket: "examer-4c725.appspot.com",
  messagingSenderId: "858001192034",
  appId: "1:858001192034:web:acd8ae56173e4ea8a5cd3b"
};

export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();