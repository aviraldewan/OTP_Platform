const firebase = require("firebase");
const firebaseConfig = {
    apiKey: "AIzaSyD3_T9Zvqltq8cl4odO55b4n7_Sv53DqTQ",
    authDomain: "otp-verification-platform.firebaseapp.com",
    projectId: "otp-verification-platform",
    storageBucket: "otp-verification-platform.appspot.com",
    messagingSenderId: "874878142905",
    appId: "1:874878142905:web:b357bcc0a773a5bc970e68",
    measurementId: "G-RD04TPD86H",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const User = db.collection("Users");
module.exports = User;