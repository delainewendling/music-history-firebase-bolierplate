"use strict";
// This module has no knowledge of the DOM, or where the data goes after it is fetched from Firebase.
// It is only concerned with getting and setting data in the db

let $ = require('jquery'),
    firebase = require("./firebaseConfig");

// ****************************************
// DB interaction using Firebase REST API
// ****************************************

function getSongs(userId) {
  return new Promise ((resolve, reject)=>{
    $.ajax({
      url: `https://music-history-b5816.firebaseio.com/songs.json?orderBy="uid"&equalTo${userId}`
    }).done(function(songData){
      resolve(songData);
    });
  });
}

function addSong(songFormObj) {
  return new Promise ((resolve, reject)=>{
    $.ajax({
      url: 'https://music-history-b5816.firebaseio.com/songs.json',
      method: 'POST',
      //Since we are submitting a JavaScript object we need to convert to a JSON object
      data: JSON.stringify(songFormObj),
      dataType: 'json'
    }).done((songId)=>{
      resolve(songId);
    });
  });
}

function deleteSong(songId) {
  return new Promise ((resolve, reject)=>{
    $.ajax({
      url: `https://music-history-b5816.firebaseio.com/songs/${songId}.json`,
      method: 'DELETE'
    }).done(()=>{
      resolve();
    });
  });
}

function getSong(songId) {
  return new Promise ((resolve, reject)=>{
    $.ajax({
      url: `https://music-history-b5816.firebaseio.com/songs/${songId}.json`
    }).done((song)=>{
      resolve(song);
    }).fail((error)=>{
      reject(error);
    });
  }); //end of promise
}

function editSong(songFormObj, songId) {
  return new Promise ((resolve, reject)=>{
    $.ajax({
      url: `https://music-history-b5816.firebaseio.com/songs/${songId}.json`,
      method: "PUT",
      data: JSON.stringify(songFormObj)
    }).done((data)=>{
      resolve(data);
    });
  }); //end of promise
}

module.exports = {
  getSongs,
  addSong,
  getSong,
  deleteSong,
  editSong
};
