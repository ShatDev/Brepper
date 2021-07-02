var goalElement = document.querySelectorAll('.goal')
var raisedElement  = document.querySelectorAll('.raised')
const donateButton = document.querySelector('#contribute-button')
const withdrawButton = document.querySelector('#withdraw-button')
const documentLink = document.querySelector("#doc-link")
const progress = document.querySelector("#progress")
let alertValue = false;



//Currency Convertor ETH to USD 
async function toUSD(ethValue) {
  const settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://coingecko.p.rapidapi.com/simple/price?ids=ethereum&vs_currencies=USD",
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "731cabf830msh06088b535cbc883p1cb288jsn7e8616efa3dc",
      "x-rapidapi-host": "coingecko.p.rapidapi.com"
    }
  };
  
  $.ajax(settings).done(function (response) {
    var price = response.ethereum.usd
    return ethValue * price 
  });

  
}
// Create An Alert Function
function createAlert(element ,prompt) {
  const p = document.createElement("p");
  p.innerText = prompt
  element.appendChild(p)
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


window.addEventListener('load', () => {
  window.getWeb3().then(async (web3) => {
    const networkId = await web3.eth.net.getId();

    $.getJSON("/FundingCreator.json", (FundingCreatorContract) => {

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


//Display the goal and the amount raised
          const goal = await fundraiserInstance.methods.goal().call()
          for(var i = 0 ; i < goalElement.length ; i++ ) {
            goalElement[i].innerText = web3.utils.fromWei(goal)
          }
          const dollarGoal = await toUSD(goal);
          console.log(dollarGoal)

          // const deadline = await fundraiserInstance.methods.deadline().call()
          // document.querySelector('.deadline').innerText = deadline

// Display the amount raised
          const raisedAmount = await fundraiserInstance.methods.raisedAmount().call()

          for(var r = 0; r < raisedElement.length ; r++){
            raisedElement[r].innerText = web3.utils.fromWei(raisedAmount)
          }  
 //contribute amount value     
         const contributeAmount = document.querySelector("#contribute-amount");


// Donate Button
          donateButton.addEventListener("click", async function() {
            const [account] = await getAccounts()

            if(contributeAmount.value == null){
              alert("please enter a value");
            }
            fundraiserInstance.methods.contribute().send({from : account , value: web3.utils.toWei(contributeAmount.value)})
          })

//display progress percentage
           let progressPercent =  (raisedAmount / goal) * 100
           progress.style.width = progressPercent + "%"
// Verify Url in fundraiser Form

           let urlValue = documentLink.value.toLowerCase()

          if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
              urlValue = `https://${urlValue}`; 
            }

            validate( urlValue);

             if (!validate(urlValue)){
               return false;
             }


         document.querySelector(".related-documents").setAttribute("href", documentLink.value)




        })()
      });
    });
  });
});
