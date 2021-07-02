var account

window.addEventListener('load', () => {
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
    });
    if (web3.eth.accounts[0] !== account) {
      account = web3.eth.accounts[0];
      // below method needs to be defined
      //updateInterface();
    }
  });
});

const createButton = document.getElementById("create-button");
const goal = document.getElementById("funding-goal")


var noOfContracts = 0;
// make sure this function returns all accounts
const getAccounts = async () => {
  return await window.ethereum.request({ method: 'eth_requestAccounts' })
}

const createFundRaiser = async function(event) {
  event.preventDefault();
  // get up to date account data when you already submit the form
  const [account] = await getAccounts() // just destructuring result to get the first account
  const result = await instance.methods.createFunding(goal.value, 1728000).send({from: account});
  return false;
}
 
const getFundAddress = async (i) => { return await instance.methods.fundings(noOfContracts).call() }

// document.querySelector(".body-div").addEventListener("load", () =>{
// getWeb3().then(async (web3) => {

//   $.getJSON("/CrownFunding.json", (CrowdFunding) => {
//     const fund = new web3.eth.Contract(
//       CrowdFunding.abi,
//     await getFundAddress(noOfContracts)
//     );
//     window.fund = fund;
//     console.log(fund);
  
//   });
// }); 
// })

window.ethereum.on('accountsChanged', function (accounts) {
  // Time to reload your interface with accounts[0]!
})


// Share Modal