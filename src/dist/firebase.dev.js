"use strict";

var admin = require("firebase-admin");

var serviceAccount = require("../firebase-key.json");

var _require = require("uuid"),
    uuid = _require.v4;

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "post-virtualizacion.appspot.com"
});
var firebaseStorage = app.storage().bucket();
var firestore = app.firestore();

var uploadFile = function uploadFile(_ref) {
  var buffer, fileName, title, description, ref, fileRef, savedFile;
  return regeneratorRuntime.async(function uploadFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          buffer = _ref.buffer, fileName = _ref.fileName, title = _ref.title, description = _ref.description;
          console.log(fileName);
          ref = "".concat(uuid(), ".").concat(fileName.split(".")[fileName.split(".").length - 1]);
          fileRef = firebaseStorage.file(ref);
          _context.next = 6;
          return regeneratorRuntime.awrap(fileRef.save(buffer));

        case 6:
          savedFile = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(makeFilePublic(savedFile || fileRef));

        case 9:
          return _context.abrupt("return", {
            title: title,
            description: description,
            file: ref
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

var makeFilePublic = function makeFilePublic(ref) {
  return regeneratorRuntime.async(function makeFilePublic$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", ref.makePublic());

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var savePost = function savePost(post) {
  var postRef;
  return regeneratorRuntime.async(function savePost$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          postRef = firestore.collection("posts").doc(uuid());
          return _context3.abrupt("return", postRef.set(post));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var getPosts = function getPosts() {
  var document;
  return regeneratorRuntime.async(function getPosts$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(firestore.collection("posts").get());

        case 2:
          document = _context4.sent;
          return _context4.abrupt("return", document.docs.map(function (e) {
            return e.data();
          }));

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports = {
  uploadFile: uploadFile,
  savePost: savePost,
  getPosts: getPosts
};