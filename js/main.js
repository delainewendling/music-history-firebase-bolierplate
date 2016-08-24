"use strict";

let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    login = require("./user"),
    displayName,
    profileImg;
var userId,
    userSongs = {};
// Using the REST API
function loadSongsToDOM() {
  console.log("Need to load some songs, Buddy");
  $(".uiContainer--wrapper").html("");
  db.getSongs(userId)
  .then((songData)=>{
    //This is a temporary mutation - not being saved to firebase.
    var idArr = Object.keys(songData);
    console.log("songData", songData);
    idArr.forEach((key)=>{
      if(songData[key].uid) {
        songData[key].id = key;
        userSongs[key] = songData[key];
      }
    });
    templates.makeSongList(userSongs);
  });
}
// loadSongsToDOM(); //<--Move to auth section after adding login btn

// Send newSong data to db then reload DOM with updated song data
$(document).on("click", ".save_new_btn", function() {
  let songObj = buildSongObj();
  //Calling add songs gives you the song id back.
  db.addSong(songObj)
  .then((songId)=>{
    console.log("song saved", songId);
    loadSongsToDOM();
  });
});

// Load and populate form for editing a song
$(document).on("click", ".edit-btn", function () {
  let songId = $(this).data("edit-id");
  console.log("id?", songId);
  db.getSong(songId)
  .then((song)=>{
    console.log("song clicked", song);
    //need to return this to return the promise
    return templates.songForm(song, songId);
  })
  .then((finishedForm)=>{
    $('.uiContainer--wrapper').html(finishedForm);
  });
});

//Save edited song to FB then reload DOM with updated song data
$(document).on("click", ".save_edit_btn", function() {
  let songObj = buildSongObj(),
      songId = $(this).attr("id");
  db.editSong(songObj, songId)
  .then((data)=>{
    loadSongsToDOM();
  });
});

// Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function () {
  let songId = $(this).data('delete-id');
  db.deleteSong(songId)
  .then((data)=>{
    loadSongsToDOM();
  });
});


//***************************************************************
// User login section. Should ideally be in its own module
$("#auth-btn").click(function() {
  console.log("clicked auth");
  login()
  .then((result)=>{
    //this will give you access to the Google API (read up on that)
    displayName = result.user.displayName;
    profileImg = result.user.photoURL;
    let user = result.user;
    userId = user.uid;
    loadSongsToDOM();
    loadLoginInfo();
  });
});

function loadLoginInfo() {
  $(".userInfo").html(`<img src="${profileImg}" class="profilePic"> <span class="userName"> ${displayName} </span>`);
}
//****************************************************************

// Helper functions for forms stuff. Nothing related to Firebase
// Build a song obj from form data.
function buildSongObj() {
    let songObj = {
    songTitle: $("#form--title").val(),
    artist: $("#form--artist").val(),
    albumTitle: $("#form--album").val(),
    genre: $("#form--genre").val(),
    uid: userId
  };
  return songObj;
}

// Load the new song form
$("#add-song").click(function() {
  console.log("clicked add song");
  var songForm = templates.songForm()
  .then(function(songForm) {
    $(".uiContainer--wrapper").html(songForm);
  });
});
