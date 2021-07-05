const express = require("express");
const IPFS = require("ipfs-mini" ) ;
const ipfs = new IPFS({host : 'ipfs.infura.io' , post: 5001, protocol:"https"});
const app = express();

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.get("/home", function(req, res) {
  res.sendFile(__dirname + "/public/home.html");
})

app.get("/create", function(req, res) {
  res.sendFile(__dirname + "/public/CreateFund.html")
})
app.get("/CrowdFunding.json" , function(req,res) {
  res.sendFile(__dirname + "/build/contracts/CrowdFunding.json")
})
app.get("/FundingCreator.json" , function(req,res) {
  res.sendFile(__dirname + "/build/contracts/FundingCreator.json")
})
app.get("/mango.png", function(req, res) {
  res.sendFile(__dirname + "/public/img/mango.png")
})
app.listen(3000, function() {
  console.log("Listening on port 3000");
});
