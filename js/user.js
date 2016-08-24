"use strict";
let firebase = require("./firebaseConfig"),
    provider = new firebase.auth.GoogleAuthProvider();

function logInGoogle() {
  console.log("Hello, auth!");
  //most of the methods in firebase 3 return a promise
  return firebase.auth().signInWithPopup(provider);
}

module.exports = logInGoogle;
