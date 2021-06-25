const express = require("express");

const app = express();

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/CrowdFunding.json" , function(req,res) {
  res.sendFile(__dirname + "/build/contracts/CrowdFunding.json")
})

app.listen(3000, function() {
  console.log("Listening on port 3000");
});
