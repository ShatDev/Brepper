const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.send('eth_requestAccounts');
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
  });

window.addEventListener('load', () => {
  getWeb3().then(async (web3) => {
    const networkId = await web3.eth.net.getId();
    $.getJSON("/FundingCreator.json", (FundingCreatorContract) => {
      const deployedNetwork = FundingCreatorContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FundingCreatorContract.abi,
      "0x284D10E9cfFE48b5A41eB0a9F400E9881b6a2202"
      );
      window.instance = instance;
      console.log(instance.methods.createFunding);
    
    });
  });
});
var accountInterval = setInterval(function() {
  if (web3.eth.accounts[0] !== account) {
    account = web3.eth.accounts[0];
    updateInterface();
  }
}, 100);

const form = document.querySelector("#create-form");
const createButton = document.getElementById("create-button");
const goal = document.getElementById("funding-goal")


var noOfContracts = 0;
// make sure this function returns all accounts
const getAccounts = async () => {
  return await window.ethereum.request({ method: 'eth_requestAccounts' })
}

// use the above function in your event listener:
form.addEventListener('submit', async e => {
  e.preventDefault()
  // get up to date account data when you already submit the form
  const [account] = await getAccounts() // just destructuring result to get the first account
  instance.methods.createFunding(goal.value, 40000).send({ from: account }).then((value) => {console.log(value)})

  noOfContracts++;
})
 
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
