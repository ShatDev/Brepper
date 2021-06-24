const express = require("express");

const app = express();

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/fundingCreator.json", function(req, res) {
  res.sendFile(__dirname + "/build/contracts/fundingCreator.json");
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});
