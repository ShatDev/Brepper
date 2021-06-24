// const FundingCreatorContract = require("../build/contracts/fundingCreator.json");
// console.log(FundingCreatorContract);

const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
  });

$(window).load(function() {
  getWeb3().then(async (web3) => {
    const networkId = await web3.eth.net.getId();
    $.getJSON("fundingCreator.json", (FundingCreatorContract) => {
      const deployedNetwork = FundingCreatorContract.networks[networkId];
      const instance = new web3.eth.Contract(
        FundingCreatorContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      console.log(instance.methods.createFunding);
    });
  });
});
