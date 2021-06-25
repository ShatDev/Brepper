


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

window.addEventListener('load', () => {
  getWeb3().then(async (web3) => {
    const networkId = await web3.eth.net.getId();
    $.getJSON("CrowdFunding.json", (CrowdFundingContract) => {
      const deployedNetwork = CrowdFundingContract.networks[networkId];

      var instance = new web3.eth.Contract(
        CrowdFundingContract.abi,
        deployedNetwork && deployedNetwork.address
      );
    });
  });
});





