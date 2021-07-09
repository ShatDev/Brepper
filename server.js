const express = require('express')
const IPFS = require('ipfs-mini');
const bodyParser = require('body-parser')

const app = express()



var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
 
ipfs.add('hello world!').then(console.log).catch(console.log);

ipfs.cat('QmTp2hEo8eXRp6wg7jXv1BLCMh5a4F3B7buAUZNZUu772j', (err , result) => {
   console.log(err , result);

})



app.use(express.static('public'))

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
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
app.listen(5001, function() {
  console.log("Listening on port 3000");
});
