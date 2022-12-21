"use strict";

var express = require("express");

var multer = require("multer");

var cors = require("cors");

var upload = multer({
  storage: multer.memoryStorage()
});
var app = express();

var _require = require("./firebase"),
    savePost = _require.savePost,
    getPosts = _require.getPosts,
    uploadFile = _require.uploadFile;

var _require2 = require("uuid"),
    uuid = _require2.v4;

app.use(cors());
app.use(express.json());
app.get("/", function (req, res) {
  res.send("Hello wrld");
});
app.get("/posts", function _callee(req, res) {
  var response;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(getPosts());

        case 2:
          response = _context.sent;
          console.log(response);
          res.json(response);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.post("/posts", upload.any(), function _callee2(req, res) {
  var files, mappedFiles, publications, response;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          files = req.files;
          mappedFiles = files.map(function (_ref) {
            var fieldname = _ref.fieldname,
                fileName = _ref.originalname,
                buffer = _ref.buffer;
            var fieldId = fieldname.split("-")[0];
            title = req.body["".concat(fieldId, "-title")];
            description = req.body["".concat(fieldId, "-description")];

            if (!title || !description || !buffer) {
              throw new Error("Bad Metadata Format");
            }

            return {
              title: title,
              description: description,
              fileName: fileName,
              buffer: buffer
            };
          });
          _context2.next = 5;
          return regeneratorRuntime.awrap(Promise.all(mappedFiles.map(function (e) {
            return uploadFile(e);
          })));

        case 5:
          publications = _context2.sent;
          console.log(publications);
          _context2.next = 9;
          return regeneratorRuntime.awrap(savePost({
            title: req.body.title,
            description: req.body.description,
            creationDate: new Date(),
            publications: publications
          }));

        case 9:
          response = _context2.sent;
          console.log(response);
          res.send("Uploaded");
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.status(500).send(_context2.t0.message);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
module.exports = app;