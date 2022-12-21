"use strict";

var app = require("./app");

var PORT = 3000;
app.listen(PORT, function () {
  console.log("Server Listening on port ".concat(PORT));
});