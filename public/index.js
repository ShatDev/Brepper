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

const form = document.querySelector("#create-form");
const createButton = document.getElementById("create-button");
const goal = document.getElementById("funding-goal")

const getAccounts = async function() { 
const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
const account = accounts[0]
}
await getAccounts()

form.addEventListener("submit", function(e) {
  e.preventDefault();
  instance.methods.createFunding(goal.value , 40000).send({from: account })
})



