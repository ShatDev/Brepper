var account



//fill values
var goalElement = document.querySelectorAll('.goal')
var raisedElement  = document.querySelectorAll('.raised')
const raisedDollars  = document.querySelector(".raised-dollars")
const goalDollars = document.querySelector(".goal-dollars")
const loader = document.querySelector(".loader")
//Buttons
const donateButton = document.querySelector('#contribute-button')
const withdrawButton = document.querySelector('#withdraw-button')


const documentLink = document.querySelector("#doc-link")
const progress = document.querySelector("#progress")
let alertValue = false;

// Get Ethereum price 
const getPrices = async () => {
  const url = `https://coingecko.p.rapidapi.com/simple/price?ids=ethereum&vs_currencies=USD`;

  try {
    const res = await fetch(url , {
      "async": true,
      "crossDomain": true,
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "731cabf830msh06088b535cbc883p1cb288jsn7e8616efa3dc",
        "x-rapidapi-host": "coingecko.p.rapidapi.com"
       } });
    const data = await res.json();
    const cryptoData = data.ethereum.usd 
    return cryptoData;
  } catch (err) {
    console.error(err);
  }
};

//convert from dollar to eth 
async function toUSD(ethValue) {
  var value = await getPrices() * ethValue
  return value; 
}


// Create An Alert Function
function createAlert(element ,prompt) {
  const p = document.createElement("p");
  p.innerText = prompt
  document.querySelector("#contribute-amount").appendChild(p)
  alertValue = true;
}

//regex link validator 
function validate(urlValue) {

  // Regex expression imported
  const expression = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g;
  const regex = new RegExp(expression);

// If there is no url value alert
if (!urlValue){
  alert('Please provide a valid url.')
  return false;
}
// if the url is valid, it matches
  if (urlValue.match(regex)){
      console.log('match');
      if(alertValue == true){
          document.querySelector("p").remove()
          alertValue= false;
      }
     
  }
  // if the url doesn't match then creates an alert
  if(!urlValue.match(regex)) {
  if (alertValue == false) {
      createAlert()
      alertValue = true;
  }   
      return false;
  }

  return true;
}


// Loading function
function loading() {
  loader.hidden = false; 
  document.querySelector(".website").hidden = true;
}
function complete() {
  loader.hidden = true; 
  document.querySelector(".website").hidden = false;
}


const connect =  () => {
  window.getWeb3().then(async (web3) => {
    const networkId = await web3.eth.net.getId();
    $.getJSON("/FundingCreator.json", (FundingCreatorContract) => {
      const deployedNetwork = FundingCreatorContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FundingCreatorContract.abi,
      deployedNetwork && deployedNetwork.address
      );
      instance.events.FundraiserCreated({}, function(_, event){
        location.replace("/index.html?index=" + event.returnValues.fundraiserIndex);
      })
      window.instance = instance;

      $.getJSON("/CrowdFunding.json", (CrowdFundingContract) => {

        const deployedNetwork = FundingCreatorContract.networks[networkId];
        const instance = new web3.eth.Contract(
          FundingCreatorContract.abi,
          deployedNetwork && deployedNetwork.address
        );
      
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        (async () => {
          const address = await instance.methods.getFundingContractAddress(params.index).call();
          const fundraiserInstance = new web3.eth.Contract(
            CrowdFundingContract.abi,
            address
          );



  // Admin Authentication and Rights
        var admin = await fundraiserInstance.methods.admin().call()
  
        const [adminAcc] = await getAccounts();
        


          if(admin.toLowerCase() == adminAcc) {
            withdrawButton.classList.remove("hidden")
          } else {
            console.log("Not Admin")
          }; 
  //Withdraw Button 
          withdrawButton.addEventListener("click", async function() {
            await fundraiserInstance.methods.withdrawFunds(7).send({from : adminAcc, value : web3.utils.toWei("1")});
          })

          
  //Display the goal and the amount raised
          const goal = await fundraiserInstance.methods.goal().call()
          for(var i = 0 ; i < goalElement.length ; i++ ) {
            goalElement[i].innerText = web3.utils.fromWei(goal) + " Ethers"
          }


          // const deadline = await fundraiserInstance.methods.deadline().call()
          // document.querySelector('.deadline').innerText = deadline

  // Display the amount raised
          const raisedAmount = await fundraiserInstance.methods.raisedAmount().call()

          for(var r = 0; r < raisedElement.length ; r++){
            raisedElement[r].innerText = web3.utils.fromWei(raisedAmount) + " Ethers"
          }  
  //contribute amount value     
        const contributeAmount = document.querySelector("#contribute-amount");
  //setting up value in dollars  
          var raisedDollarValue =  await toUSD(web3.utils.fromWei(raisedAmount))
          raisedDollars.innerText = raisedDollarValue.toFixed(2) + "$"
          var goalDollarValue = await toUSD(web3.utils.fromWei(goal))
          goalDollars.innerText = goalDollarValue.toFixed(2) + "$"

  // Donate Button 

          var clicks = 0;

          donateButton.addEventListener("click", async function() {
          

            if (clicks == 0){
              $("#contribute-amount").slideDown()
            } else{
              const [account] = await getAccounts()

              if(contributeAmount.value == null){
                console.log("null value")
                createAlert(contributeAmount, "Please enter a value")
              } else {
                fundraiserInstance.methods.contribute().send({from : account , value: web3.utils.toWei(contributeAmount.value)})
              }
            }
            clicks++;         
          })

  //display progress percentage
          let progressPercent =  (raisedAmount / goal) * 100
          progress.style.width = progressPercent + "%"


        })()
      });
    });
    if (web3.eth.accounts[0] !== account) {
      account = web3.eth.accounts[0];
      // below method needs to be defined
      //updateInterface();
    }
  });
}

const createButton = document.getElementById("create-button");
const goal = document.getElementById("funding-goal")


var noOfContracts = 0;
// make sure this function returns all accounts
const getAccounts = async () => {
  return await window.ethereum.request({ method: 'eth_requestAccounts' })
}

const createFundRaiser = async function(event) {
  event.preventDefault();
  if (!window.instance)
    await connect();
  // get up to date account data when you already submit the form
  const [account] = await getAccounts() // just destructuring result to get the first account
  const result = await window.instance.methods.createFunding(goal.value, 1728000).send({from: account});
  return false;
}
 
const getFundAddress = async (i) => { return await window.instance.methods.fundings(noOfContracts).call() }

window.addEventListener('load', async () => {
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.getAccounts();
  if (accounts.length) connect()
});